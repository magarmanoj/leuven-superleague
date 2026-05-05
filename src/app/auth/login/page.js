"use client";
import { useState } from "react";
import LoginPopup from "../../components/auth/LoginPopup";

export default function LoginPage() {
    const [isOpen, setIsOpen] = useState(true);
    return (
        <LoginPopup
            isOpen={isOpen}
            onClose={() => setIsOpen(false)}
        />
    );
}