import { getLolStats } from "@/app/riot";

export async function getPlayerStats(game: string, account: string) {
    switch (game) {
        case "League of Legends":
            return getLolStats(account);
        case "Valorant":
            break;
    }
}

const testAccount="samikin#uwu";

export async function getUserAccount(game: string) {
    return testAccount
}