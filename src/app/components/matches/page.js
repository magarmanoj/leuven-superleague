"use client";

import { useContext, useState, useEffect } from "react";
import { MatchesContext } from "../../Context/matchesContext";
import { TeamsContext } from "../../Context/teamsContext";
import Image from "next/image";
import "./matches.css";
import { useAuth } from "../../Context/authContext";


export default function MatchTable() {
    const { loading: matchesLoading, weeks, weekMatches, currentWeek, setCurrentWeek, getTeamIdByName, saveMatchGoals } = useContext(MatchesContext);
    const { loading: teamsLoading, getTeamLogo, getPlayersByTeam } = useContext(TeamsContext);

    const [editingMatch, setEditingMatch] = useState(null);
    const [showModal, setShowModal] = useState(false);

    const [homeGoals, setHomeGoals] = useState([]);
    const [awayGoals, setAwayGoals] = useState([]);
    const { isAdmin } = useAuth();

    const [matchDate, setMatchDate] = useState("");
    const [played, setPlayed] = useState(false);
    const [kickoffTime, setKickoffTime] = useState("");


    if (matchesLoading || teamsLoading) {
        return <div>Loading…</div>;
    }



    const formatDate = (dateString) => {
        const date = new Date(dateString);

        return date.toLocaleDateString("en-GB", {
            day: "numeric",
            month: "short"
        });
    };



    const renderGoals = (goals, setGoals, players) =>
        goals.map((g, i) => (
            <div key={g.id} className="goal-row">
                <span>Goal {i + 1}</span>

                <input
                    type="number"
                    placeholder="Min"
                    value={g.minute}
                    onChange={e => {
                        const copy = [...goals];
                        copy[i].minute = e.target.value;
                        setGoals(copy);
                    }}
                />

                <select
                    value={g.scorerId}
                    onChange={e => {
                        const copy = [...goals];
                        copy[i].scorerId = e.target.value;
                        setGoals(copy);
                    }}
                >
                    <option value="">Scorer</option>
                    {players.map(p => (
                        <option key={p.id} value={p.id}>
                            {p.name}
                        </option>
                    ))}
                </select>

                <select
                    value={g.assistId}
                    onChange={e => {
                        const copy = [...goals];
                        copy[i].assistId = e.target.value;
                        setGoals(copy);
                    }}
                >
                    <option value="">Assist (optional)</option>
                    {players.map(p => (
                        <option key={p.id} value={p.id}>
                            {p.name}
                        </option>
                    ))}
                </select>

                <button
                    className="remove-goal-btn"
                    onClick={() =>
                        setGoals(prev => prev.filter(goal => goal.id !== g.id))
                    }
                >
                    ❌
                </button>
            </div>
        ));

    const renderTeamGoals = (team, match) => {
        if (!match.goals) return null;

        return match.goals
            .filter(g => g.team === team)
            .map(goal => {
                const players = getPlayersByTeam(
                    getTeamIdByName(
                        team === "home" ? match.homeTeam : match.awayTeam
                    )
                );

                const scorer =
                    players.find(p => p.id === goal.scorerId)?.name;

                return (
                    <div key={goal.id} className="team-goal-line">
                        <span className="minute">{goal.minute}&apos;</span>
                        <span className="scorer">{scorer}</span>
                    </div>
                );
            });
    };


    return (
        <div className="match-table">
            {/* Matchweek selector */}
            <div className="matchweek-select">
                <label htmlFor="week">Matchweek:</label>
                <select
                    id="week"
                    value={currentWeek}
                    onChange={e => setCurrentWeek(Number(e.target.value))}
                >
                    {weeks.map(week => (
                        <option key={week} value={week}>
                            Matchweek {week}
                        </option>
                    ))}
                </select>
            </div>

            {/* Matches */}
            <div className="matchtable">
                {weekMatches.map(match => {
                    const hasGoals = match.goals && match.goals.length > 0;
                    const hasScore = match.played === true;
                    return (
                        <div key={match.id} className="match-row">
                            <div className="match-team home">
                                <Image
                                    src={getTeamLogo(getTeamIdByName(match.homeTeam))}
                                    alt={match.homeTeam}
                                    width={80}
                                    height={80}
                                    unoptimized
                                />
                                <span>{match.homeTeam}</span>
                                {hasGoals && (
                                    <div className="team-goals-list home">
                                        {renderTeamGoals("home", match)}
                                    </div>
                                )}
                            </div>

                            {/* SCORE / TIME */}

                            <div className="modal-score">
                                <div className="match-date">
                                    {formatDate(match.date)}
                                </div>
                                {hasScore ? (
                                    <strong>
                                        {match.homeGoals} – {match.awayGoals}
                                    </strong>
                                ) : (
                                    <span className="kickoff-time">
                                        {match.kickoff}
                                    </span>
                                )}
                            </div>

                            <div className="match-team away">
                                <Image
                                    src={getTeamLogo(getTeamIdByName(match.awayTeam))}
                                    alt={match.awayTeam}
                                    width={80}
                                    height={80}
                                    unoptimized
                                />
                                <span>{match.awayTeam}</span>
                                {hasGoals && (
                                    <div className="team-goals-list away">
                                        {renderTeamGoals("away", match)}
                                    </div>
                                )}
                            </div>

                            {isAdmin && (
                                <div className="match-actions">
                                    <button
                                        className="edit-btn"
                                        onClick={() => {
                                            const goals = match.goals || [];
                                            setEditingMatch(match);
                                            setHomeGoals(goals.filter(g => g.team === "home"));
                                            setAwayGoals(goals.filter(g => g.team === "away"));
                                            setMatchDate(match.date);
                                            setPlayed(match.played);
                                            setKickoffTime(match.kickoff || "");
                                            setShowModal(true);
                                        }}
                                    >
                                        Edit
                                    </button>
                                </div>
                            )}
                        </div>
                    );
                })}
            </div>

            {/* MODAL */}
            {showModal && editingMatch && (
                <div className="modal-backdrop">
                    <div className="modal">
                        <div className="modal-header">
                            <h2>Edit Match</h2>
                            <strong>
                                {editingMatch.homeTeam} {homeGoals.length} –{" "}
                                {awayGoals.length} {editingMatch.awayTeam}
                            </strong>
                            <div className="match-meta">
                                <label>
                                    Date:
                                    <input
                                        type="date"
                                        value={matchDate?.slice(0, 10) || ""}
                                        onChange={e => setMatchDate(e.target.value)}
                                    />
                                </label>

                                <label>
                                    Played:
                                    <select
                                        value={played ? "true" : "false"}
                                        onChange={e => setPlayed(e.target.value === "true")}
                                    >
                                        <option value="false">No</option>
                                        <option value="true">Yes</option>
                                    </select>
                                </label>
                                <label>
                                    Kickoff
                                    <input
                                        type="time"
                                        value={kickoffTime}
                                        onChange={e => setKickoffTime(e.target.value)}
                                    />
                                </label>
                            </div>

                            <div className="goal-columns">
                                <h3>{editingMatch.homeTeam}</h3>
                                {renderGoals(
                                    homeGoals,
                                    setHomeGoals,
                                    getPlayersByTeam(
                                        getTeamIdByName(editingMatch.homeTeam)
                                    )
                                )}

                                <button
                                    className="add-goal-btn"
                                    onClick={() => {
                                        setHomeGoals(prev => [
                                            ...prev,
                                            { id: crypto.randomUUID(), team: "home", minute: "", scorerId: "", assistId: "" }
                                        ]);
                                        setPlayed(true); // auto mark played
                                    }}
                                >
                                    + Add goal
                                </button>
                            </div>
                            <div className="team-goals">
                                <h3>{editingMatch.awayTeam}</h3>
                                {renderGoals(
                                    awayGoals,
                                    setAwayGoals,
                                    getPlayersByTeam(
                                        getTeamIdByName(editingMatch.awayTeam)
                                    )
                                )}

                                <button
                                    className="add-goal-btn"
                                    onClick={() => {
                                        setAwayGoals(prev => [
                                            ...prev,
                                            { id: crypto.randomUUID(), team: "away", minute: "", scorerId: "", assistId: "" }
                                        ]);
                                        setPlayed(true);
                                    }}
                                >
                                    + Add goal
                                </button>
                            </div>
                            <div className="modal-actions">
                                <button className="save-btn"
                                    onClick={() => {
                                        const isEmptyScore =
                                            homeGoals.length === 0 && awayGoals.length === 0;

                                        if (isEmptyScore) {
                                            const confirmZeroZero = window.confirm(
                                                "No goals entered. Save this match as a 0–0 draw?"
                                            );

                                            if (!confirmZeroZero) {
                                                return; // user cancelled → do nothing
                                            }
                                        }
                                        saveMatchGoals(editingMatch.id,
                                            [...homeGoals, ...awayGoals],
                                            {
                                                date: matchDate,
                                                played: played,
                                                kickoff: kickoffTime
                                            }
                                        );
                                        setShowModal(false);
                                        setEditingMatch(null);
                                        setMatchDate("");
                                        setPlayed(false);
                                    }}
                                >
                                    Done
                                </button>

                                <button
                                    className="cancel-btn"
                                    onClick={() => {
                                        setShowModal(false);
                                        setEditingMatch(null);
                                    }}
                                >
                                    Cancel
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}
