"use client";

import { useContext } from "react";
import { TablesContext } from "../../Context/tableContext";
import { TeamsContext } from "../../Context/teamsContext";
import { MatchesContext } from "../../Context/matchesContext";

import "../table/table.css";
import Image from "next/image";

export default function TablePage() {
    const { loading, sortedTable } = useContext(TablesContext);
    const { getTeamLogo } = useContext(TeamsContext);
    const { getNextOpponent } = useContext(MatchesContext);

    if (loading) return <div className="table-loading">Loading table...</div>;

    return (
        <div className="league-table">
            <div className="table-wrapper">
                <div className="table-title-wrapper">
                    <div className="table-title-badge">
                        League Table
                    </div>
                </div>
                <div className="table-border">
                    <div className="table-scroll">
                        <table className="table">
                            <thead className="table-head">
                                <tr className="table-header-row">
                                    <th className="col-pos">Pos</th>
                                    <th className="col-team">Team</th>
                                    <th>Pl</th>
                                    <th>W</th>
                                    <th>D</th>
                                    <th>L</th>
                                    <th>GF</th>
                                    <th>GA</th>
                                    <th>GD</th>
                                    <th className="col-points">Pts</th>
                                    <th>Form</th>
                                    <th>Next</th>
                                </tr>
                            </thead>

                            <tbody className="table-body">
                                {sortedTable.map((team, index) => (
                                    <tr className="table-row" key={team.id}>
                                        <td className="table-pos">
                                            <span className="pos-number">{index + 1}</span>
                                        </td>

                                        <td className="table-team">
                                            <div className="team-info">
                                                <Image
                                                    src={getTeamLogo(team.id)}
                                                    alt={team.name}
                                                    className="teamlogo"
                                                    width={80}
                                                    height={80}
                                                    unoptimized
                                                />
                                                <span className="team-name">{team.name}</span>
                                            </div>
                                        </td>

                                        <td className="table-stat">{team.played}</td>
                                        <td className="table-stat">{team.wins}</td>
                                        <td className="table-stat">{team.draws}</td>
                                        <td className="table-stat">{team.losses}</td>
                                        <td className="table-stat">{team.goalsFor}</td>
                                        <td className="table-stat">{team.goalsAgainst}</td>
                                        <td className="table-stat goal-diff">{team.goalDiff}</td>

                                        <td className="table-points">{team.points}</td>

                                        <td className="table-form">
                                            <div className="form-icons">
                                                {[...team.form].reverse().map((result, i) => (
                                                    <span
                                                        key={i}
                                                        className={`form-badge form-${result.toLowerCase()}`}
                                                    >
                                                        {result}
                                                    </span>
                                                ))}
                                            </div>
                                        </td>

                                        <td className="table-next">
                                            {(() => {
                                                const nextOpponentId = getNextOpponent(team.id);
                                                if (!nextOpponentId) return <span>-</span>;

                                                return (
                                                    <Image
                                                        src={getTeamLogo(nextOpponentId)}
                                                        alt="Next opponent"
                                                        className="next-logo"
                                                        width={50}
                                                        height={50}
                                                        unoptimized
                                                    />
                                                );
                                            })()}
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                </div>
            </div>
        </div>
    );
}
