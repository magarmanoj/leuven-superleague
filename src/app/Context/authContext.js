"use client";
import { createContext, useState, useEffect, useContext } from "react";
import { onAuthStateChanged, signOut } from "firebase/auth";
import { auth } from "@/app/firebase/firebase";

const ADMIN_EMAIL = "anojmagar12@gmail.com";

export const AuthContext = createContext();

export function AuthProvider({ children }) {
    const [user, setUser] = useState(null);
    const [isAdmin, setIsAdmin] = useState(false);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const unsubscribe = onAuthStateChanged(auth, (u) => {
            setUser(u);
            setIsAdmin(u?.email === ADMIN_EMAIL);
            setLoading(false);
        });
        return () => unsubscribe();
    }, []);

    const logout = async () => {
        try {
            await signOut(auth);
            setUser(null);
            setIsAdmin(false);
        } catch (err) {
            console.error("Logout failed:", err);
        }
    };
    return (
        <AuthContext.Provider value={{ user, isAdmin, logout, loading }}>
            {children}
        </AuthContext.Provider>
    );
}

export const useAuth = () => useContext(AuthContext);
