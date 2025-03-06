import { Suspense } from "react";
import GameSelector from "@/app/GameSelector";
import GameStatistics from "@/app/GameStatistics";


// this information should retrieved from the db, on the player profile page the user can add game accounts that they have and then the games would show up here
const testGames = [
    'League of Legends',
    'Valorant',
] 

export default async function PlayerAnalytics(props: {
    searchParams?: Promise<{
        game?: string;
    }>;
}) {
    const searchParams = await props.searchParams;
    const game = searchParams?.game || "";

    return (
        <div className={`w-full h-full grid grid-cols-6 grid-rows-12`}>
            <div className="row-span-12 bg-gray-500 bg-opacity-30">
                <h1>Player Information Goes Here</h1>
            </div>
            <GameSelector games={testGames} divClassName="p-2"/>
            <Suspense fallback={<div>Loading...</div>}>
                <GameStatistics game={game}/>
            </Suspense>
        </div>
    );
}