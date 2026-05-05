"use client";

import { createContext, useEffect, useState } from "react";
import { collection, onSnapshot, query, orderBy, getDoc, addDoc, updateDoc, deleteDoc, doc, serverTimestamp } from "firebase/firestore";
import { dbContext, storage } from "../firebase/firebase";
import { useAuth } from "../Context/authContext";
import {
    ref,
    uploadBytes,
    getDownloadURL,
    deleteObject
} from "firebase/storage";

export const NewsContext = createContext();

export function NewsProvider({ children }) {
    const [news, setNews] = useState([]);
    const [loading, setLoading] = useState(true);

    const { isAdmin } = useAuth();

    useEffect(() => {
        const q = query(
            collection(dbContext, "News"),
            orderBy("publishedAt", "desc")
        );

        const unsubscribe = onSnapshot(
            q,
            (snapshot) => {
                const newsData = snapshot.docs.map((doc) => ({
                    id: doc.id,
                    ...doc.data(),
                }));

                setNews(newsData);
                setLoading(false);
            },
            (error) => {
                console.error("Error fetching news:", error);
                setLoading(false);
            }
        );

        return () => unsubscribe();
    }, []);

    // CREATE
    const createNews = async ({ title, content, imageFile }) => {
        if (!isAdmin) return console.warn("Only admins can create news.");

        try {

            let imageUrl = "";
            if (imageFile) {
                const imageRef = ref(
                    storage,
                    `news/${Date.now()}_${imageFile.name}`
                );

                await uploadBytes(imageRef, imageFile);
                imageUrl = await getDownloadURL(imageRef);
            }

            await addDoc(collection(dbContext, "News"), {
                title,
                content,
                imageUrl,
                publishedAt: serverTimestamp()
            });
        } catch (err) {
            console.error("Error creating news:", err);
        }
    };

    // UPDATE
    const updateNews = async ({ id, title, content, imageFile }) => {
        if (!isAdmin) return console.warn("Only admins can update news.");
        try {
            const newsRef = doc(dbContext, "News", id);
            const updatedData = {
                title,
                content,
                publishedAt: serverTimestamp()
            };
            if (imageFile) {
                const docSnap = await getDoc(newsRef);
                const existingItem = docSnap.data();

                const imageRef = ref(
                    storage,
                    `news/${Date.now()}_${imageFile.name}`
                );

                await uploadBytes(imageRef, imageFile);
                const newImageUrl = await getDownloadURL(imageRef);

                if (existingItem?.imageUrl) {
                    const oldImageRef = refFromURL(existingItem.imageUrl);
                    await deleteObject(oldImageRef).catch(() => { });
                }

                updatedData.imageUrl = newImageUrl;
            }

            await updateDoc(newsRef, updatedData);
        } catch (err) {
            console.error("Error updating news:", err);
        }
    };

    // DELETE
    const deleteNews = async (id) => {
        if (!isAdmin) return console.warn("Only admins can delete news.");
        try {
            const newsRef = doc(dbContext, "News", id);
            const newsItem = news.find((item) => item.id === id);

            await deleteDoc(newsRef);
        } catch (err) {
            console.error("Error deleting news:", err);
        }
    };

    return (
        <NewsContext.Provider value={{ news, loading, createNews, updateNews, deleteNews, isAdmin }}>
            {children}
        </NewsContext.Provider>
    );
}
