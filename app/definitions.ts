import React from "react"

export type NavLink = {
    name: string,
    href: string
}

export interface NavBarProps {
    useLinks: boolean,
}

export interface NavLinkProps {
    links?: NavLink[],
}

export const NavLinksDefault = [
    {name: "Home", href:"/"}, 
    {name: "About Us", href:"/about-us"}, 
    {name: "Dashboard", href:"/dashboard"},
    {name: "Contact Us", href:"/contact-us"}
]

export type SideBarItems = {
    name: string,
    href?: string,
    links?: NavLink[],
}

export interface SideBarProps {
    items: SideBarItems[]
}

export const SideBarItemsPlayer = [
    {name: "Home", href:"/dashboard"}, 
    {name: "About Us", href:"/about-us"}, 
    {name: "My Team", links:[
        {name: "Calendar", href: "/dashboard/my-team/calendar"},
        {name: "Team Profile", href: "/dashboard/my-team/team-profile"},
    ]}, 
    {name: "Profile", href:"/dashboard/profile"}, 
    {name: "Training", links:[
        {name: "Analytics", href:"/dashboard/analytics"},
        {name: "Modules", href:"/dashboard/modules"},
        {name: "Videos", href:"/dashboard/videos"},
    ]},
    {name: "Contact Us", href:"/contact-us"}
]


export const SideBarItemsTeam = [
    {name: "Home", href:"/dashboard"}, 
    {name: "About Us", href:"/about-us"}, 
    {name: "My Team", links:[
        {name: "Calendar", href: "/dashboard/my-team/calendar"},
        {name: "Team Profile", href: "/dashboard/my-team/team-profile"},
    ]}, 
    {name: "Finances", links:[
        {name: "Budget", href:"/dashboard/finances/budget"},
        {name: "Expenses", href:"/dashboard/finances/expenses"},
        {name: "Expense Report", href:"/dashboard/finances/expense-report"},
    ]}, 
    {name: "Coaching", links:[
        {name: "Analytics", href:"/dashboard/analytics"},
        {name: "Modules", href:"/dashboard/modules"},
        {name: "Videos", href:"/dashboard/videos"},
    ]},
    {name: "Contact Us", href:"/contact-us"}
]

export interface WidgetProps {
    title: string,
    text?: string,
    reversed?: boolean
}

export interface RegisterCardProps {
    type: "player" | "recruiter"
}

export type User = {
    id: number,
    name: string,
    email: string,
    password: string,
    variant: "player" | "team"
}

export const PlayerPaths = ["/dashboard/profile"]

export const TeamPaths = ["/dashboard/finances/budget", "/dashboard/finances/expense-report", "/dashboard/finances/expenses"]

export const SharedPaths = ["/dashboard/my-team/calendar", "/dashboard/my-team/team-profile", "/dashboard/videos", "/dashboard/analytics"]

export interface EventModalProps {
    isOpen: boolean,
    className?: string,
    children: React.ReactNode,
}

export const NavBarHeight = "96px"

export const SideNavWidth = "192px"

export type ModuleSearchParams = {
    game: string,
    mechanic: string,
}

export type Guide = {
    name: string,
    url: string,
    img: string | undefined,
}

export type MediaPromise = Promise<{ 
    videos: string[],
    guides: Guide[],
}>

export type BudgetEntry = {
    id: string,
    date: Date,
    category?: string,
    amount: number,
    type: "EXPENSE" | "INCOME",
    budgetId: string,
}

export type Category = {
    id: string,
    name: string,
    totalSpent: number,
    totalAllocated: number,
    budgetId: string,
}

export type Budget = {
    id: string,
    userId: string,
    totalBudget: number,
    totalSpent: number,
    year: number,
    categories: Category[],
    expenses: BudgetEntry[],
    income: BudgetEntry[]
}

// Account V1 Response
export interface RiotAccountResponse {
    puuid: string;
    gameName: string;
    tagLine: string;
}

// Summoner V4 Response
export interface SummonerResponse {
    id: string;           // Encrypted summoner ID
    accountId: string;    // Encrypted account ID
    puuid: string;        // Encrypted PUUID
    profileIconId: number;
    revisionDate: number;
    summonerLevel: number;
}

// League V4 Ranked Entry Response
export interface RankedEntryResponse {
    leagueId: string;
    queueType: string;    // e.g., "RANKED_SOLO_5x5"
    tier: string;         // e.g., "GOLD", "PLATINUM"
    rank: string;         // e.g., "I", "II", "III", "IV"
    summonerId: string;
    summonerName: string;
    puuid: string;
    leaguePoints: number;
    wins: number;
    losses: number;
    veteran: boolean;
    inactive: boolean;
    freshBlood: boolean;
    hotStreak: boolean;
}

export interface DailyBreakdown {
    date: string;
    csPerMin: number;
    kdaRatio: number;
    goldPerMin: number;
    damagePerMin: number;
    killParticipation: number;
    visionScore: number;
    winRate: number;
}

// Aggregate statistics interface
export interface AggregateStats {
    timeframe: 'week' | 'month' | 'year';
    csPerMin: number;
    kdaRatio: number;
    goldPerMin: number;
    damagePerMin: number;
    killParticipation: number;
    visionScore: number;
    winRate: number;
    dailyBreakdown: DailyBreakdown[];
}