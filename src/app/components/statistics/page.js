"use client";

import { useContext, useMemo, useState, useEffect } from "react";
import { StatisticsContext } from "../../Context/statisticsContext";
import { TeamsContext } from "../../Context/teamsContext";
import { MatchesContext } from "../../Context/matchesContext";

import Image from "next/image";
import "./statistics.css";
import { getDoc, doc, setDoc } from "firebase/firestore";
import { dbContext } from "../../firebase/firebase";



export default function StatisticsPage() {
    const { statistics, topAssisters, topScorers, loading } = useContext(StatisticsContext);
    const { teams, getTeamLogo } = useContext(TeamsContext);

    const [selectedTeam, setSelectedTeam] = useState(null);

    const playerMap = useMemo(() => {
        const map = {};
        teams.forEach(team => {
            team.players.forEach(player => {
                map[player.id] = {
                    name: player.name,
                    teamId: team.id
                };
            });
        });
        return map;
    }, [teams]);

    if (loading) return <div>Loading statistics…</div>;

    return (
        <div className="statistics-page">
            <div className="statistics-wrapper">
                <div className="statistics-title-wrapper">
                    <div className="statistics-title-badge">
                        Statistics
                    </div>
                </div>
                {/* ================= TOP CARDS ================= */}
                <div className="top-stats">
                    {/* GOALS */}
                    <div className="stats-card">
                        <h2>Goals</h2>
                        {topScorers.length ? topScorers.map((p, i) => (
                            <div key={p.playerName} className="stats-row">
                                <span className="rank">{i + 1}</span>
                                <span className="player">
                                    {playerMap[p.playerName]?.name ?? "Unknown"}
                                </span>
                                <span className="value">{p.goals}</span>
                            </div>
                        )) : <p className="empty">No goals yet</p>}
                    </div>

                    {/* ASSISTS */}
                    <div className="stats-card">
                        <h2>Assists</h2>
                        {topAssisters.length ? topAssisters.map((p, i) => (
                            <div key={p.playerName} className="stats-row">
                                <span className="rank">{i + 1}</span>
                                <span className="player">
                                    {playerMap[p.playerName]?.name ?? "Unknown"}
                                </span>
                                <span className="value">{p.assists}</span>
                            </div>
                        )) : <p className="empty">No assists yet</p>}
                    </div>
                </div>

                {/* ================= TEAM LEADERS ================= */}
                <div className="team-leaders">
                    {teams.slice(0, 4).map(team => {
                        const teamStats = statistics[team.id] || [];

                        const topScorer = teamStats
                            .filter(p => p.goals > 0)
                            .sort((a, b) => b.goals - a.goals)[0];

                        const topAssister = teamStats
                            .filter(p => p.assists > 0)
                            .sort((a, b) => b.assists - a.assists)[0];

                        return (
                            <div key={team.id} className="teamCard" onClick={() => setSelectedTeam(team)}>
                                <Image
                                    src={getTeamLogo(team.id)}
                                    alt={team.name}
                                    width={80}
                                    height={80}
                                    unoptimized
                                />

                                <div className="team-leader-info">
                                    <p>
                                        <strong>
                                            {topScorer
                                                ? playerMap[topScorer.playerName]?.name
                                                : "—"}
                                        </strong>
                                        <span>{topScorer?.goals ?? 0} goals</span>
                                    </p>

                                    <p>
                                        <strong>
                                            {topAssister
                                                ? playerMap[topAssister.playerName]?.name
                                                : "—"}
                                        </strong>
                                        <span>{topAssister?.assists ?? 0} assists</span>
                                    </p>
                                </div>
                            </div>
                        );
                    })}
                </div>
                {selectedTeam && (
                    <div className="modal-backdrop" onClick={() => setSelectedTeam(null)}>
                        <div className="team-modal" onClick={e => e.stopPropagation()}>
                            <h2>{selectedTeam.name}</h2>
                            <div className="teamModal-scroll">
                                <table className="team-stats-table">
                                    <thead>
                                        <tr>
                                            <th>Player</th>
                                            <th>Goals</th>
                                            <th>Assists</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {selectedTeam.players.map(player => {
                                            const stat =
                                                statistics[selectedTeam.id]?.find(
                                                    s => s.playerName === player.id
                                                ) ?? { goals: 0, assists: 0 };

                                            return (
                                                <tr key={player.id}>
                                                    <td>{player.name}</td>
                                                    <td>{stat.goals}</td>
                                                    <td>{stat.assists}</td>
                                                </tr>
                                            );
                                        })}
                                    </tbody>
                                </table>
                            </div>
                            <button className="closeBtn" onClick={() => setSelectedTeam(null)}>
                                Close
                            </button>
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
}
