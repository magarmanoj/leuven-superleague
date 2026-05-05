"use client";

import { createContext, useState, useEffect } from "react";
import { collection, getDocs } from "firebase/firestore";
import { dbContext } from "../firebase/firebase";

export const StatisticsContext = createContext({
    statistics: {},
    loading: true
});

export function StatisticsProvider({ children }) {
    const [statistics, setStatistics] = useState({});
    const [loading, setLoading] = useState(true);

    /* ================= GLOBAL TOP LISTS ================= */
    const allStats = Object.values(statistics).flat();

    const topScorers = allStats
        .filter(p => p.goals > 0)
        .sort((a, b) => b.goals - a.goals)
        .slice(0, 10);

    const topAssisters = allStats
        .filter(p => p.assists > 0)
        .sort((a, b) => b.assists - a.assists)
        .slice(0, 10);

    useEffect(() => {
        const fetchStatistics = async () => {
            setLoading(true);

            try {
                const statsRootRef = collection(dbContext, "Statistics");
                const teamSnapshots = await getDocs(statsRootRef);

                const allStats = {};

                await Promise.all(
                    teamSnapshots.docs.map(async teamDoc => {
                        const teamId = teamDoc.id;

                        const teamStatsRef = collection(
                            dbContext,
                            "Statistics",
                            teamId,
                            "stats"
                        );

                        const statsSnapshot = await getDocs(teamStatsRef);

                        allStats[teamId] = statsSnapshot.docs.map(doc => ({
                            playerName: doc.id,
                            goals: doc.data().goals ?? 0,
                            assists: doc.data().assists ?? 0
                        }));
                    })
                );

                setStatistics(allStats);
            } catch (error) {
                console.error("Error loading statistics:", error);
            } finally {
                setLoading(false);
            }
        };

        fetchStatistics();
    }, []);

    return (
        <StatisticsContext.Provider value={{ statistics, topScorers, topAssisters, loading }}>
            {children}
        </StatisticsContext.Provider>
    );
}
