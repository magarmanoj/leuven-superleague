"use client";

import { createContext, useContext, useMemo } from "react";
import { TeamsContext } from "./teamsContext";
import { MatchesContext } from "./matchesContext";

export const TablesContext = createContext();

export function TablesProvider({ children }) {
    const { teams, loading: teamsLoading } = useContext(TeamsContext);
    const { matches, loading: matchesLoading, getTeamIdByName } =
        useContext(MatchesContext);

    const loading = teamsLoading || matchesLoading;

    const table = useMemo(() => {
        if (!teams.length || !matches.length) return [];

        // 1️⃣ Initialize empty table
        const tableMap = {};
        teams.forEach(team => {
            tableMap[team.id] = {
                id: team.id,
                name: team.name,
                played: 0,
                wins: 0,
                draws: 0,
                losses: 0,
                goalsFor: 0,
                goalsAgainst: 0,
                goalDiff: 0,
                points: 0,
                form: [],
            };
        });

        // 2️⃣ Process played matches
        matches
            .filter(m => m.played)
            .sort((a, b) => new Date(a.date) - new Date(b.date))
            .forEach(match => {
                const homeId = getTeamIdByName(match.homeTeam);
                const awayId = getTeamIdByName(match.awayTeam);

                if (!homeId || !awayId) return;

                const home = tableMap[homeId];
                const away = tableMap[awayId];

                home.played++;
                away.played++;

                home.goalsFor += match.homeGoals;
                home.goalsAgainst += match.awayGoals;

                away.goalsFor += match.awayGoals;
                away.goalsAgainst += match.homeGoals;

                if (match.homeGoals > match.awayGoals) {
                    home.wins++;
                    home.points += 3;
                    home.form.push("W");

                    away.losses++;
                    away.form.push("L");
                } else if (match.homeGoals < match.awayGoals) {
                    away.wins++;
                    away.points += 3;
                    away.form.push("W");

                    home.losses++;
                    home.form.push("L");
                } else {
                    home.draws++;
                    away.draws++;
                    home.points++;
                    away.points++;
                    home.form.push("D");
                    away.form.push("D");
                }
            });

        const finalTable = Object.values(tableMap).map(team => ({
            ...team,
            goalDiff: team.goalsFor - team.goalsAgainst,
            form: team.form.slice(-5),
        }));

        return finalTable.sort((a, b) =>
            b.points - a.points ||
            b.goalDiff - a.goalDiff ||
            b.goalsFor - a.goalsFor ||
            a.name.localeCompare(b.name)
        );
    }, [teams, matches, getTeamIdByName]);

    const sortedTable = useMemo(() => {
        return [...table].sort((a, b) => {
            if (b.points !== a.points) return b.points - a.points;
            if (b.goalDiff !== a.goalDiff) return b.goalDiff - a.goalDiff;
            if (b.goalsFor !== a.goalsFor) return b.goalsFor - a.goalsFor;
            return a.name.localeCompare(b.name);
        });
    }, [table]);

    return (
        <TablesContext.Provider value={{ table, loading, sortedTable }}>
            {children}
        </TablesContext.Provider>
    );
}