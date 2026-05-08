"use client";

import { useContext, useState } from "react";
import "./teams.css";
import { TeamsContext } from "../../Context/teamsContext";
import { TablesContext } from "../../Context/tableContext";

import Image from "next/image";
import TablePage from "../table/page";

export default function TeamsPage() {
    const {
        teams,
        selectedTeam,
        openTeam,
        closeTeam,
        addPlayer,
        updatePlayer,
        deletePlayer,
        handleUpload,
        isAdmin,
        loading
    } = useContext(TeamsContext);


    const [newName, setNewName] = useState("");
    const [newRole, setNewRole] = useState("");

    const [addName, setAddName] = useState("");
    const [addRole, setAddRole] = useState("");
    const [editingPlayer, setEditingPlayer] = useState(null);

    if (loading) return <div>Loading teams...</div>;

    return (
        <div className="team-table">
            <div className="teams-wrapper">

                <div className="teams-title-wrapper">
                    <div className="teams-title-badge">Teams</div>
                </div>

                <div className="teams-grid">
                    {teams.map((team) => (
                        <div
                            key={team.id}
                            className="team-card"
                            onClick={() => openTeam(team)}
                        >
                            <Image
                                src={team.logo || "/img/default-team.png"}
                                width={140}
                                height={140}
                                alt={team.name || "Team logo"}
                                className="team-logo"
                                unoptimized
                            />
                            <h2 className="team-name">{team.name}</h2>
                        </div>
                    ))}
                </div>

                {selectedTeam && (
                    <div className="modal-overlay" onClick={closeTeam}>
                        <div
                            className="modal-content"
                            onClick={(e) => e.stopPropagation()}
                        >
                            <h1>{selectedTeam.name}</h1>
                            {/* PLAYER LIST */}
                            <div className="player-cards">
                                {selectedTeam.players?.map((player) => (
                                    <div key={player.id} className="player-card">

                                        <div className="player-image-wrapper">
                                            <Image
                                                src={player.image || "/img/players.png"}
                                                alt={player.name || "Player photo"}
                                                width={100}
                                                height={100}
                                                className="player-image"
                                                unoptimized
                                            />
                                        </div>

                                        <div className="player-info">
                                            {editingPlayer === player.id ? (
                                                <>
                                                    <input
                                                        value={newName}
                                                        onChange={(e) => setNewName(e.target.value)}
                                                    />
                                                    <input
                                                        value={newRole}
                                                        onChange={(e) => setNewRole(e.target.value)}
                                                    />
                                                </>
                                            ) : (
                                                <>
                                                    <div className="player-name">{player.name}</div>
                                                    {player.role && (
                                                        <div className="player-role">
                                                            {player.role}
                                                        </div>
                                                    )}
                                                </>
                                            )}
                                        </div>

                                        {isAdmin && (
                                            <div className="admin-controls">

                                                {editingPlayer === player.id ? (
                                                    <>
                                                        <button
                                                            onClick={() => {
                                                                updatePlayer(
                                                                    selectedTeam.id,
                                                                    player.id,
                                                                    {
                                                                        name: newName,
                                                                        role: newRole,
                                                                    }
                                                                );
                                                                setEditingPlayer(null);
                                                                setNewName("");
                                                                setNewRole("");
                                                            }}
                                                        >
                                                            Save
                                                        </button>

                                                        <button
                                                            onClick={() => setEditingPlayer(null)}
                                                        >
                                                            Cancel
                                                        </button>
                                                    </>
                                                ) : (
                                                    <>
                                                        <button
                                                            onClick={() => {
                                                                setEditingPlayer(player.id);
                                                                setNewName(player.name);
                                                                setNewRole(player.role || "");
                                                            }}
                                                        >
                                                            Edit
                                                        </button>

                                                        <button
                                                            onClick={() => {
                                                                if (window.confirm("Delete player?")) {
                                                                    deletePlayer(
                                                                        selectedTeam.id,
                                                                        player
                                                                    );
                                                                }
                                                            }}
                                                        >
                                                            Delete
                                                        </button>

                                                        <input
                                                            type="file"
                                                            accept="image/png, image/jpeg"
                                                            onChange={(e) =>
                                                                handleUpload(e, player)
                                                            }
                                                        />
                                                    </>
                                                )}
                                            </div>
                                        )}
                                    </div>
                                ))}
                            </div>

                            {/* ADD PLAYER */}
                            {isAdmin && (
                                <div className="add-player-box">
                                    <input
                                        type="text"
                                        placeholder="Player name"
                                        value={addName}
                                        onChange={(e) => setAddName(e.target.value)}
                                    />
                                    <input
                                        type="text"
                                        placeholder="Role"
                                        value={addRole}
                                        onChange={(e) => setAddRole(e.target.value)}
                                    />
                                    <button
                                        onClick={() => {
                                            if (!addName) return;

                                            addPlayer(selectedTeam.id, {
                                                name: addName,
                                                role: addRole,
                                                image: ""
                                            });

                                            setAddName("");
                                            setAddRole("");
                                        }}
                                    >
                                        Add Player
                                    </button>
                                </div>
                            )}
                            <button className="close-btn" onClick={closeTeam}>
                                Close
                            </button>

                        </div>
                    </div>
                )}
            </div>

        </div>
    );
}
