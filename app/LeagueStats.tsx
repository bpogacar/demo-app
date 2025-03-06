import { RiotAccountResponse, SummonerResponse, RankedEntryResponse, AggregateStats } from "@/app/definitions";
import LineGraph from "@/app/LineGraph";
import StatCard from "@/app/StatCard";

interface LeagueStatsProps {
    data: Promise<{
        accountInfo: RiotAccountResponse;
        summonerInfo: SummonerResponse;
        rankedInfo: RankedEntryResponse[];
        aggregateStats: AggregateStats;
    } | undefined>
}

// Helper to generate tier color
const getTierColor = (tier: string) => {
    const tierColors: Record<string, string> = {
        'IRON': 'text-gray-500',
        'BRONZE': 'text-amber-800',
        'SILVER': 'text-gray-400',
        'GOLD': 'text-yellow-500',
        'PLATINUM': 'text-teal-400',
        'EMERALD': 'text-emerald-500',
        'DIAMOND': 'text-blue-400',
        'MASTER': 'text-purple-600',
        'GRANDMASTER': 'text-red-600',
        'CHALLENGER': 'text-blue-600'
    };
    return tierColors[tier] || 'text-gray-700';
};

// Helper to format percentage values
const formatPercent = (value: number) => {
    return `${(value * 100).toFixed(1)}%`;
};

// Helper to format decimal values
const formatDecimal = (value: number) => {
    return value.toFixed(2);
};

// Helper to format larger values
const formatLarge = (value: number) => {
    return value.toFixed(1);
}

export default async function LeagueStats({ data }: LeagueStatsProps) {
    const stats = await data;
    
    if (!stats) {
        return (
            <div className="text-center text-xl text-gray-500 p-8">
                No player statistics available
            </div>
        );
    }

    const soloQueueRanked = stats.rankedInfo?.find(
        queue => queue.queueType === "RANKED_SOLO_5x5"
    );

    const winRate = soloQueueRanked ? (soloQueueRanked.wins / (soloQueueRanked.wins + soloQueueRanked.losses)) : 0;

    return (
        <div className="w-full h-full flex flex-col p-2">
            {/* Player Info Header */}
            <div className="bg-altBackground outline outline-LvlupBlue-light rounded-lg p-4 mb-4">
                <div className="flex flex-col">
                    <div className="flex justify-between items-start">
                        <div>
                            <h1 className="text-xl font-bold text-white">
                                {stats.accountInfo.gameName} 
                                <span className="text-opacity-40 text-white">#{stats.accountInfo.tagLine}</span>
                            </h1>
                            <p className="text-white text-opacity-60">Level {stats.summonerInfo.summonerLevel}</p>
                        </div>
                        
                        {soloQueueRanked && (
                            <div className="flex flex-col items-end">
                                <div className={`text-xl font-bold ${getTierColor(soloQueueRanked.tier)}`}>
                                    {soloQueueRanked.tier} {soloQueueRanked.rank}
                                </div>
                                <div className="text-white text-sm">
                                    {soloQueueRanked.leaguePoints} LP
                                </div>
                                <div className="text-xs text-white text-opacity-70">
                                    {soloQueueRanked.wins}W {soloQueueRanked.losses}L 
                                    <span className="ml-1">
                                        ({(winRate * 100).toFixed(1)}% WR)
                                    </span>
                                </div>
                            </div>
                        )}
                        
                        {!soloQueueRanked && (
                            <div className="text-blue-200">
                                Unranked in Solo Queue
                            </div>
                        )}
                    </div>
                </div>
            </div>
            
            {/* Aggregate Stats Grid */}
            <h2 className="text-lg font-bold mb-2 text-white">
                Performance Summary - {stats.aggregateStats.timeframe}
            </h2>
            <div className="grid grid-cols-4 gap-2 mb-4">
                <StatCard 
                    title="Win Rate" 
                    value={formatPercent(stats.aggregateStats.winRate)} 
                />
                <StatCard 
                    title="KDA Ratio" 
                    value={formatDecimal(stats.aggregateStats.kdaRatio)} 
                />
                <StatCard 
                    title="CS per Min" 
                    value={formatDecimal(stats.aggregateStats.csPerMin)} 
                />
                <StatCard 
                    title="Kill Participation" 
                    value={formatPercent(stats.aggregateStats.killParticipation)} 
                />
            </div>
            <div className="grid grid-cols-3 gap-2 mb-4">
                <StatCard 
                    title="Damage per Min" 
                    value={formatDecimal(stats.aggregateStats.damagePerMin)} 
                />
                <StatCard 
                    title="Gold per Min" 
                    value={formatDecimal(stats.aggregateStats.goldPerMin)} 
                />
                <StatCard 
                    title="Vision Score" 
                    value={formatDecimal(stats.aggregateStats.visionScore)} 
                />
            </div>
            
            {/* Graphs Section */}
            {stats.aggregateStats.dailyBreakdown.length > 0 && (
                <>
                    <h2 className="text-lg font-bold mb-2 text-white">Performance Trends</h2>
                    <div className="grid grid-cols-3 gap-2">
                        <LineGraph 
                            data={stats.aggregateStats.dailyBreakdown} 
                            dataKey="winRate" 
                            title="Win Rate" 
                            formatValue={formatPercent}
                        />
                        <LineGraph 
                            data={stats.aggregateStats.dailyBreakdown} 
                            dataKey="kdaRatio" 
                            title="KDA Ratio" 
                        />
                        <LineGraph 
                            data={stats.aggregateStats.dailyBreakdown} 
                            dataKey="csPerMin" 
                            title="CS per Minute" 
                        />
                        <LineGraph 
                            data={stats.aggregateStats.dailyBreakdown} 
                            dataKey="killParticipation" 
                            title="Kill Participation" 
                            formatValue={formatPercent}
                        />
                        <LineGraph 
                            data={stats.aggregateStats.dailyBreakdown} 
                            dataKey="damagePerMin" 
                            title="Damage per Minute" 
                            formatValue={formatLarge}
                        />
                        <LineGraph 
                            data={stats.aggregateStats.dailyBreakdown} 
                            dataKey="goldPerMin" 
                            title="Gold per Minute" 
                            formatValue={formatLarge}
                        />
                    </div>
                </>
            )}
            
            {stats.aggregateStats.dailyBreakdown.length === 0 && (
                <div className="text-center text-gray-400 p-3 bg-gray-800 rounded-lg">
                    No daily performance data available for this period.
                </div>
            )}
        </div>
    )
}