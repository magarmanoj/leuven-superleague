"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import LoginPopup from "../components/auth/LoginPopup";
import { useAuth } from "../Context/authContext";


export default function AdminLayout({ children }) {
    const { user, isAdmin, loading } = useAuth();
    const [showLogin, setShowLogin] = useState(false);
    const router = useRouter();

    useEffect(() => {
        if (!loading) {
            if (!user) {
                setTimeout(() => setShowLogin(true), 0);
            } else if (!isAdmin) {
                router.replace("/");
            }
        }
    }, [user, isAdmin, loading, router]);

    if (loading) return <div>Checking admin access...</div>;

    if (!user || !isAdmin) {
        return <LoginPopup isOpen={showLogin} onClose={() => setShowLogin(false)} />;
    }

    return <>{children}</>;
}