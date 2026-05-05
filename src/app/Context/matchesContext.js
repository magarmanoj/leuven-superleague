"use client";

import { createContext, useEffect, useState, useMemo, useContext } from "react";
import { dbContext } from "../firebase/firebase";
import {
    collection,
    getDocs,
    query,
    updateDoc,
    doc,
    setDoc,
    deleteDoc
} from "firebase/firestore";
import { TeamsContext } from "./teamsContext";
import { useCallback } from "react";

export const MatchesContext = createContext();

export function MatchesProvider({ children }) {
    const [matches, setMatches] = useState([]);
    const [loading, setLoading] = useState(true);

    const { teams } = useContext(TeamsContext);

    const EARLY_JUMP_DAYS = 14;
    const [currentWeek, setCurrentWeek] = useState(1);


    useEffect(() => {
        const fetchMatches = async () => {
            try {
                const q = query(collection(dbContext, "matches"));
                const snapshot = await getDocs(q);

                const data = snapshot.docs.map(doc => ({
                    id: doc.id,
                    ...doc.data(),
                }));;

                data.sort((a, b) => {
                    if (a.slot !== b.slot) {
                        return a.slot - b.slot;
                    }

                    if (a.slot === "Slot 2") {
                        return b.ground - a.ground;
                    }

                    return a.ground - b.ground;
                });

                setMatches(data);
            } catch (err) {
                console.error("Error fetching matches:", err);
            } finally {
                setLoading(false);
            }
        };

        fetchMatches();
    }, []);

    // ---------------- Compute week start dates ----------------
    const weekStartDates = useMemo(() => {
        const map = {};
        matches.forEach(match => {
            const week = Number(match.matchday);
            const matchDate = new Date(match.date);
            if (!map[week] || matchDate < map[week]) {
                map[week] = matchDate;
            }
        });
        return map; // {1: Date, 2: Date, ...}
    }, [matches]);


    const teamNameToId = useMemo(() => {
        const map = {};
        teams.forEach(team => {
            map[team.name.toLowerCase()] = team.id;
        });
        return map;
    }, [teams]);


    const getTeamIdByName = useCallback((name) =>
        teamNameToId[name?.toLowerCase()] ?? null, [teamNameToId]);

    // ---------------- Determine current week automatically ----------------
    const determineCurrentWeek = useCallback(() => {
        const today = new Date();
        let week = Math.min(...Object.keys(weekStartDates).map(Number));

        Object.entries(weekStartDates).forEach(([w, startDate]) => {
            const earlyDate = new Date(startDate);
            earlyDate.setDate(earlyDate.getDate() - EARLY_JUMP_DAYS);
            if (today >= earlyDate) {
                week = Number(w);
            }
        });

        return week;
    }, [weekStartDates]);

    // Auto-set currentWeek on load and every hour
    useEffect(() => {
        if (!loading && Object.keys(weekStartDates).length) {
            setCurrentWeek(determineCurrentWeek());

            const interval = setInterval(() => {
                setCurrentWeek(determineCurrentWeek());
            }, 1000 * 60 * 60); // check every hour

            return () => clearInterval(interval);
        }
    }, [loading, weekStartDates, determineCurrentWeek]);


    const rebuildStatistics = useCallback(async () => {

        // DELETE ALL EXISTING STATS
        const statsRoot = collection(dbContext, "Statistics");
        const teamDocs = await getDocs(statsRoot);

        for (const teamDoc of teamDocs.docs) {
            const statsCol = collection(
                dbContext,
                "Statistics",
                teamDoc.id,
                "stats"
            );
            const playerDocs = await getDocs(statsCol);

            for (const playerDoc of playerDocs.docs) {
                await deleteDoc(playerDoc.ref);
            }
        }

        // REBUILD FROM MATCHES
        const snapshot = await getDocs(collection(dbContext, "matches"));

        const stats = {}; // { teamId: { playerId: { goals, assists } } }

        snapshot.docs.forEach(docSnap => {
            const match = docSnap.data();
            if (!match.goals || !match.played) return;

            match.goals.forEach(goal => {
                const teamName =
                    goal.team === "home" ? match.homeTeam : match.awayTeam;

                const teamId = getTeamIdByName(teamName);
                if (!teamId) return;

                // Scorer
                if (goal.scorerId) {
                    stats[teamId] ??= {};
                    stats[teamId][goal.scorerId] ??= { goals: 0, assists: 0 };
                    stats[teamId][goal.scorerId].goals += 1;
                }

                // Assist
                if (goal.assistId) {
                    stats[teamId] ??= {};
                    stats[teamId][goal.assistId] ??= { goals: 0, assists: 0 };
                    stats[teamId][goal.assistId].assists += 1;
                }
            });
        });

        // 3. Write statistics to Firestore
        for (const teamId of Object.keys(stats)) {
            for (const playerId of Object.keys(stats[teamId])) {
                await setDoc(
                    doc(dbContext, "Statistics", teamId, "stats", playerId),
                    stats[teamId][playerId]
                );
            }
        }
    }, [getTeamIdByName]);

    useEffect(() => {
        const checkAndRebuild = async () => {
            const statsSnapshot = await getDocs(collection(dbContext, "Statistics"));

            if (statsSnapshot.empty) {
                await rebuildStatistics();
            }
        };

        if (!loading && matches.length) {
            checkAndRebuild();
        }
    }, [loading, matches, rebuildStatistics]);

    // ---------------- Weeks & Week Matches ----------------
    const weeks = useMemo(
        () => Array.from(new Set(matches.map(m => Number(m.matchday)))).sort((a, b) => a - b),
        [matches]
    );

    const weekMatches = useMemo(
        () => matches.filter(m => Number(m.matchday) === currentWeek),
        [matches, currentWeek]
    );


    const getNextOpponent = (teamId) => {
        const getId = (teamName) =>
            teamNameToId[teamName?.toLowerCase()];

        // All upcoming (unplayed) matches for this team
        const upcoming = matches
            .filter(m => {
                if (m.played) return false;

                const homeId = getId(m.homeTeam);
                const awayId = getId(m.awayTeam);

                return homeId === teamId || awayId === teamId;
            })
            .sort((a, b) => {
                // primary: matchday
                if (Number(a.matchday) !== Number(b.matchday)) {
                    return Number(a.matchday) - Number(b.matchday);
                }

                // secondary: kickoff time (if exists)
                if (a.kickoff && b.kickoff) {
                    return a.kickoff.localeCompare(b.kickoff);
                }

                return 0;
            });

        if (!upcoming.length) return null;

        const nextMatch = upcoming[0];

        const homeId = getId(nextMatch.homeTeam);
        const awayId = getId(nextMatch.awayTeam);

        return homeId === teamId ? awayId : homeId;
    };



    const saveMatchGoals = useCallback(async (matchId, goals = [], meta = {}) => {
        const { date, kickoff, played } = meta;

        const homeGoals = goals.filter(g => g.team === "home").length;
        const awayGoals = goals.filter(g => g.team === "away").length;

        const updatePayload = {
            goals,
            homeGoals,
            awayGoals,
        };

        // Only update played if explicitly provided
        if (played !== undefined) {
            updatePayload.played = played;
        }

        // Optional fields
        if (date !== undefined) updatePayload.date = date;
        if (kickoff !== undefined) updatePayload.kickoff = kickoff;

        await updateDoc(doc(dbContext, "matches", matchId), updatePayload);

        setMatches(prev =>
            prev.map(m =>
                m.id === matchId
                    ? { ...m, ...updatePayload }
                    : m
            )
        );

        await rebuildStatistics();
    }, [rebuildStatistics]);

    return (
        <MatchesContext.Provider value={{ matches, loading, getNextOpponent, weeks, weekMatches, currentWeek, setCurrentWeek, getTeamIdByName, saveMatchGoals, rebuildStatistics }}>
            {children}
        </MatchesContext.Provider>
    );
}
