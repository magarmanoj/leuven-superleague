"use client";
import { createContext, useEffect, useState } from "react";
import { ref, uploadBytes, getDownloadURL } from "firebase/storage";
import { doc, updateDoc, getDocs, setDoc, collection, deleteDoc } from "firebase/firestore";
import { storage, dbContext } from "../firebase/firebase";
import { useAuth } from "../Context/authContext";


export const TeamsContext = createContext();

export function TeamsProvider({ children }) {
    const [teams, setTeams] = useState([]);
    const [loading, setLoading] = useState(true);
    const [selectedTeam, setSelectedTeam] = useState(null);

    const { isAdmin } = useAuth();

    useEffect(() => {
        const fetchTeams = async () => {
            try {
                const teamsCol = collection(dbContext, "teams");
                const teamsSnapshot = await getDocs(teamsCol);

                const teamsData = await Promise.all(
                    teamsSnapshot.docs.map(async (teamDoc) => {
                        const teamData = { id: teamDoc.id, ...teamDoc.data() };

                        const playersCol = collection(dbContext, `teams/${teamDoc.id}/players`);
                        const playersSnapshot = await getDocs(playersCol);
                        const players = playersSnapshot.docs.map((playerDoc) => ({
                            id: playerDoc.id,
                            ...playerDoc.data(),
                        }));

                        return { ...teamData, players };
                    })
                );
                setTeams(teamsData);
                setLoading(false);
            } catch (e) {
                console.error("Error fetching teams:", e);
                setLoading(false);
            }
        };
        fetchTeams();
    }, []);

    const fetchTeamPlayers = async (teamId) => {
        const playersRef = collection(dbContext, "teams", teamId, "players");
        const snapshot = await getDocs(playersRef);

        const players = snapshot.docs.map((doc) => ({
            id: doc.id,
            ...doc.data(),
        }));
        return players;
    };

    const openTeam = async (team) => {
        const players = await fetchTeamPlayers(team.id);
        setSelectedTeam({ ...team, players });
    }

    const closeTeam = () => {
        setSelectedTeam(null);
    };


    const handleUpload = async (event, player) => {
        if (!selectedTeam) return;
        const file = event.target.files[0];
        if (!file || !file.type.startsWith("image/")) return;

        try {
            const fileRef = ref(
                storage,
                `players/${selectedTeam.id}/${player.id}.jpg`
            );

            await uploadBytes(fileRef, file);
            const downloadURL = await getDownloadURL(fileRef);

            const playerRef = doc(dbContext, "teams", selectedTeam.id, "players", player.id);

            await setDoc(playerRef, { image: downloadURL }, { merge: true });

            setSelectedTeam((prev) => ({
                ...prev,
                players: prev.players.map((p) =>
                    p.id === player.id ? { ...p, image: downloadURL } : p
                ),
            }));

            setTeams((prev) =>
                prev.map((team) =>
                    team.id === selectedTeam.id
                        ? {
                            ...team,
                            players: team.players.map((p) =>
                                p.id === player.id
                                    ? { ...p, image: downloadURL }
                                    : p
                            ),
                        }
                        : team
                )
            );
        } catch (err) {
            alert(`Upload failed: ${err.message || err}`);
        }
    };

    const getTeamLogo = (teamId) => {
        const foundTeam = teams.find(t => t.id === teamId);
        return foundTeam?.logo || "/img/whatever.png";
    };

    const getPlayersByTeam = (teamId) => {
        if (!teamId) return [];

        const team = teams.find(t => t.id === teamId);
        return team?.players || [];
    };

    const addPlayer = async (teamId, playerData) => {
        try {
            const playersCollection = collection(
                dbContext,
                "teams",
                teamId,
                "players"
            );

            // Let Firestore generate the ID
            const playerRef = doc(playersCollection);
            const newPlayer = {
                ...playerData,
                id: playerRef.id,
            };

            await setDoc(playerRef, newPlayer);

            // Update selectedTeam
            setSelectedTeam((prev) =>
                prev?.id === teamId
                    ? { ...prev, players: [...prev.players, newPlayer] }
                    : prev
            );

            // Update teams list
            setTeams((prev) =>
                prev.map((team) =>
                    team.id === teamId
                        ? { ...team, players: [...team.players, newPlayer] }
                        : team
                )
            );
        } catch (err) {
            console.error("Error adding player:", err);
        }
    };

    const updatePlayer = async (teamId, playerId, updatedData) => {
        try {
            const playerRef = doc(
                dbContext,
                "teams",
                teamId,
                "players",
                playerId
            );

            await updateDoc(playerRef, updatedData);

            setSelectedTeam((prev) =>
                prev?.id === teamId
                    ? {
                        ...prev,
                        players: prev.players.map((p) =>
                            p.id === playerId ? { ...p, ...updatedData } : p
                        ),
                    }
                    : prev
            );

            setTeams((prev) =>
                prev.map((team) =>
                    team.id === teamId
                        ? {
                            ...team,
                            players: team.players.map((p) =>
                                p.id === playerId ? { ...p, ...updatedData } : p
                            ),
                        }
                        : team
                )
            );
        } catch (err) {
            console.error("Error updating player:", err);
        }
    };

    const deletePlayer = async (teamId, player) => {
        try {
            const playerRef = doc(dbContext, "teams", teamId, "players", player.id);

            await deleteDoc(playerRef);

            setSelectedTeam((prev) =>
                prev?.id === teamId
                    ? {
                        ...prev,
                        players: prev.players.filter((p) => p.id !== player.id),
                    }
                    : prev
            );

            setTeams((prev) =>
                prev.map((team) =>
                    team.id === teamId
                        ? {
                            ...team,
                            players: team.players.filter((p) => p.id !== player.id),
                        }
                        : team
                )
            );
        } catch (err) {
            console.error("Error deleting player:", err);
        }
    };


    return (
        <TeamsContext.Provider value={{
            teams,
            selectedTeam,
            loading,
            openTeam,
            closeTeam,
            handleUpload,
            getTeamLogo,
            getPlayersByTeam,
            addPlayer,
            updatePlayer,
            deletePlayer,
            isAdmin
        }}>
            {children}
        </TeamsContext.Provider>
    );
}