"use client";

import { createContext, useEffect, useState } from "react";
import {
    collection,
    setDoc,
    getDocs,
    serverTimestamp,
    orderBy,
    query, doc,
    onSnapshot
} from "firebase/firestore";

import {
    ref,
    uploadBytes,
    getDownloadURL
} from "firebase/storage";

import { dbContext, storage } from "../firebase/firebase";
import { useAuth } from "../Context/authContext";

export const EventContext = createContext();

export function EventProvider({ children }) {

    const [events, setEvents] = useState([]);
    const [loading, setLoading] = useState(true);

    const { isAdmin } = useAuth();

    useEffect(() => {
        const q = query(collection(dbContext, "Events"), orderBy("date", "asc"));

        const unsubscribe = onSnapshot(q, (snapshot) => {
            const data = snapshot.docs.map(doc => ({
                id: doc.id,
                ...doc.data()
            }));
            setEvents(data);
            setLoading(false);
        }, (err) => {
            console.error("Error loading events:", err);
            setLoading(false);
        });
        return () => unsubscribe();
    }, [isAdmin]);

    // 🔹 CREATE EVENT + IMAGE
    const createEvent = async ({
        title,
        date,
        location,
        description,
        imageFile,

    }) => {
        if (!isAdmin) return console.warn("Only admins can create events.");

        try {

            let imageUrl = "";
            if (imageFile) {
                const imageRef = ref(
                    storage,
                    `events/${Date.now()}_${imageFile.name}`
                );

                await uploadBytes(imageRef, imageFile);
                imageUrl = await getDownloadURL(imageRef);
            }
            const snapshot = await getDocs(collection(dbContext, "Events"));
            const nextNumber = snapshot.size + 1;
            const id = `event${String(nextNumber).padStart(2, "0")}`;

            const docRef = doc(dbContext, "Events", id);

            await setDoc(docRef, {
                title,
                date,
                location: location || "",
                description: description || "",
                imageUrl,
                createdAt: serverTimestamp()
            });

        } catch (err) {
            console.error("Error creating event:", err);
        }
    };

    return (
        <EventContext.Provider
            value={{
                events,
                loading,
                createEvent,
                isAdmin
            }}
        >
            {children}
        </EventContext.Provider>
    );
}