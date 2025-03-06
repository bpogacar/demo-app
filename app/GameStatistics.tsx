import { getPlayerStats, getUserAccount } from "@/app/playerAnalytics";
// import { getServerAuthSession } from "@/app/lib/auth";
import { revalidateTag, unstable_cache } from "next/cache";
import Button from "@/app/button";
import LeagueStats from "@/app/LeagueStats";

export default async function GameStatistics({ game }: { game: string }) {
    // const session = await getServerAuthSession();
    const account = await getUserAccount(game);

    const cachedGetPlayerStats = unstable_cache(
        getPlayerStats,
        ['player-stats'],
        {
            tags: [
                `player-stats-${account}`,
            ],
            revalidate: 60 * 60 * 24 * 3,   // 3 days, converted from seconds
        }
    );

    async function refreshPlayerData() {
        'use server'
        revalidateTag(`player-stats-${account}`)
    };

    const playerStats = cachedGetPlayerStats(game, account);

    let StatisticsComponent;
    
    switch (game) {
        case "League of Legends":
            StatisticsComponent = <LeagueStats data={playerStats}/>;
            break;
        case "Valorant":
            break;
    }
    
    return (
        <div className="contents">
            <div className="row-start-2 col-start-2 col-span-5 row-span-10">
                {StatisticsComponent}
            </div>
            { (game === "League of Legends" || game === "Valorant") ? 
                <footer className="fixed bottom-0 left-120 text-center bg-background pb-2">
                    <p className="text-white text-opacity-75 text-sm" >LvlUpGames LLC is not endorsed by Riot Games and does not reflect the views or opinions of Riot Games or anyone officially involved in producing or managing Riot Games properties. Riot Games and all associated properties are trademarks or registered trademarks of Riot Games, Inc</p>
                </footer>
                :
                <></>
            }
            <Button variant="blue" onClick={refreshPlayerData} className="w-fit">Refresh</Button>
            {/* <pre>{JSON.stringify(session)}</pre> */}
        </div>
    )
}