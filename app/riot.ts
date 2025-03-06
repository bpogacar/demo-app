import axios from "axios";
import { RiotAccountResponse, SummonerResponse, RankedEntryResponse, AggregateStats, DailyBreakdown } from "@/app/definitions";
import { riotRateLimiter } from "@/app/riotRateLimiter";

const API_KEY = process.env.RIOT_API_KEY as string;

// Detailed match participant interface
interface MatchParticipant {
    puuid: string;
    kills: number;
    deaths: number;
    assists: number;
    totalMinionsKilled: number;
    neutralMinionsKilled: number;
    goldEarned: number;
    totalDamageDealtToChampions: number;
    visionScore: number;
    win: boolean;
    timePlayed: number;
}

export async function getLolStats(account: string, timeframe: 'week' | 'month' | 'year' = 'week') {
    try {
        // Step 1: Split the account into game name and tagline
        const [gameName, tagLine] = account.split('#');

        // Step 2: First, get the PUUID using the account details
        await riotRateLimiter.waitForRateLimit();
        const accountResponse = await axios.get(
            `https://americas.api.riotgames.com/riot/account/v1/accounts/by-riot-id/${gameName}/${tagLine}`, 
            {
                headers: {
                    'X-Riot-Token': API_KEY
                }
            }
        );

        const accountData = accountResponse.data as RiotAccountResponse;

        // Step 3: Get summoner information using PUUID
        await riotRateLimiter.waitForRateLimit();
        const summonerResponse = await axios.get(
            `https://na1.api.riotgames.com/lol/summoner/v4/summoners/by-puuid/${accountData.puuid}`,
            {
                headers: {
                    'X-Riot-Token': API_KEY
                }
            }
        );

        const summonerData = summonerResponse.data as SummonerResponse;

        // Step 4: Get ranked information
        await riotRateLimiter.waitForRateLimit();
        const rankedResponse = await axios.get(
            `https://na1.api.riotgames.com/lol/league/v4/entries/by-summoner/${summonerData.id}`,
            {
                headers: {
                    'X-Riot-Token': API_KEY
                }
            }
        );

        const rankedData = rankedResponse.data as RankedEntryResponse[];

        // Step 5: Fetch match history and calculate aggregate stats
        const aggregateStats = await calculateAggregateStats(accountData.puuid, timeframe);

        return {
            accountInfo: accountData,
            summonerInfo: summonerData,
            rankedInfo: rankedData,
            aggregateStats: aggregateStats
        };

    } catch (error) {
        console.error('Error fetching LOL stats:', error);
        return undefined;
    }
}

async function calculateAggregateStats(puuid: string, timeframe: 'week' | 'month' | 'year'): Promise<AggregateStats> {
    // Determine time range
    const now = Date.now();
    let timeRangeMs: number;
    switch (timeframe) {
        case 'week':
            timeRangeMs = 7 * 24 * 60 * 60 * 1000; // 7 days
            break;
        case 'month':
            timeRangeMs = 30 * 24 * 60 * 60 * 1000; // 30 days
            break;
        case 'year':
            timeRangeMs = 365 * 24 * 60 * 60 * 1000; // 365 days
            break;
    }

    // Fetch match history
    await riotRateLimiter.waitForRateLimit();
    const matchHistoryResponse = await axios.get(
        `https://americas.api.riotgames.com/lol/match/v5/matches/by-puuid/${puuid}/ids`,
        {
            params: {
                startTime: Math.floor((now - timeRangeMs) / 1000),
                count: 100 // Adjust as needed
            },
            headers: {
                'X-Riot-Token': API_KEY
            }
        }
    );

    // Fetch detailed match data
    const matchDetails = await Promise.all(
        matchHistoryResponse.data.map(async (matchId: string) => {
            await riotRateLimiter.waitForRateLimit();
            const matchResponse = await axios.get(
                `https://americas.api.riotgames.com/lol/match/v5/matches/${matchId}`,
                {
                    headers: {
                        'X-Riot-Token': API_KEY
                    }
                }
            );

            // Find player's participant data
            const participantData = matchResponse.data.info.participants.find(
                (participant: MatchParticipant) => participant.puuid === puuid
            );

            return {
                ...participantData,
                date: new Date(matchResponse.data.info.gameCreation)
            };
        })
    );

    // Calculate aggregate statistics
    const totalMatches = matchDetails.length;
    const wins = matchDetails.filter(match => match.win).length;

    // Calculate daily/monthly breakdown based on timeframe
    const breakdown = calculateBreakdown(matchDetails, timeframe);

    return {
        timeframe,
        csPerMin: calculateAverage(matchDetails, match => 
            (match.totalMinionsKilled + match.neutralMinionsKilled) / (match.timePlayed / 60)
        ),
        kdaRatio: calculateKDA(matchDetails),
        goldPerMin: calculateAverage(matchDetails, match => match.goldEarned / (match.timePlayed / 60)),
        damagePerMin: calculateAverage(matchDetails, match => match.totalDamageDealtToChampions / (match.timePlayed / 60)),
        killParticipation: calculateKillParticipation(matchDetails),
        visionScore: calculateAverage(matchDetails, match => match.visionScore),
        winRate: wins / totalMatches,
        dailyBreakdown: breakdown
    };
}

// Utility functions for calculations
function calculateAverage<T>(
    matches: T[], 
    selector: (match: T) => number
): number {
    const values = matches.map(selector).filter(val => !isNaN(val));
    return values.length > 0 
        ? values.reduce((sum, val) => sum + val, 0) / values.length 
        : 0;
}

function calculateKDA(matches: MatchParticipant[]): number {
    const totalKills = calculateAverage(matches, match => match.kills);
    const totalDeaths = calculateAverage(matches, match => match.deaths);
    const totalAssists = calculateAverage(matches, match => match.assists);

    return totalDeaths === 0 
        ? (totalKills + totalAssists) 
        : (totalKills + totalAssists) / totalDeaths;
}

function calculateKillParticipation(matches: MatchParticipant[]): number {
    const averageTeamKills = calculateAverage(matches, match => {
        // This is a simplification. In a real scenario, you'd need to calculate total team kills
        return match.kills + match.assists;
    });

    const averagePlayerKillsAndAssists = calculateAverage(matches, match => 
        match.kills + match.assists
    );

    return averagePlayerKillsAndAssists / (averageTeamKills || 1);
}

function calculateBreakdown(
    matches: (MatchParticipant & { date: Date })[], 
    timeframe: 'week' | 'month' | 'year'
): DailyBreakdown[] {
    // Group matches by day/month
    const groupedMatches = groupMatchesByPeriod(matches, timeframe);

    // Calculate stats for each period
    return Object.entries(groupedMatches).map(([period, periodMatches]) => ({
        date: period,
        csPerMin: calculateAverage(periodMatches, match => 
            (match.totalMinionsKilled + match.neutralMinionsKilled) / (match.timePlayed / 60)
        ),
        kdaRatio: calculateKDA(periodMatches),
        goldPerMin: calculateAverage(periodMatches, match => match.goldEarned / (match.timePlayed / 60)),
        damagePerMin: calculateAverage(periodMatches, match => match.totalDamageDealtToChampions / (match.timePlayed / 60)),
        killParticipation: calculateKillParticipation(periodMatches),
        visionScore: calculateAverage(periodMatches, match => match.visionScore),
        winRate: periodMatches.filter(match => match.win).length / periodMatches.length
    }));
}

function groupMatchesByPeriod(
    matches: (MatchParticipant & { date: Date })[], 
    timeframe: 'week' | 'month' | 'year'
): Record<string, (MatchParticipant & { date: Date })[]> {
    return matches.reduce((acc, match) => {
        let key: string;
        switch (timeframe) {
            case 'week':
                key = match.date.toISOString().split('T')[0]; // Daily
                break;
            case 'month':
                key = match.date.toISOString().split('T')[0]; // Daily
                break;
            case 'year':
                key = match.date.toISOString().slice(0, 7); // Monthly
                break;
        }

        if (!acc[key]) {
            acc[key] = [];
        }
        acc[key].push(match);
        return acc;
    }, {} as Record<string, (MatchParticipant & { date: Date })[]>);
}