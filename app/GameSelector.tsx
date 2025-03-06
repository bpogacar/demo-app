'use client';

import { useSearchParams, usePathname, useRouter } from "next/navigation";

export default function GameSelector({ games, divClassName }: { games: string[], divClassName?: string }) {
    const searchParams = useSearchParams();
    const pathname = usePathname();
    const { replace } = useRouter();

    function handleOptionSelect(game: string) {
        const params = new URLSearchParams(searchParams);
        if (game) {
            params.set('game', game);
        } else {
            params.delete('game');
        }
        replace(`${pathname}?${params.toString()}`);
    }

    return (
        <div className={divClassName}>
            <select onChange={(e) => handleOptionSelect(e.target.value)} defaultValue={searchParams.get('game')?.toString() ?? ""}
                className="bg-background"
            >
                <option disabled value={""}>Select a game</option>
                { games ? 
                    (
                        games.map((game, index) => (
                            <option key={index} value={game}>{game}</option>
                        ))
                    )
                    :
                    <></>
                }
            </select>
        </div>
    )
}