"use client";
import { useState } from "react";
import { signInWithEmailAndPassword } from "firebase/auth";
import { auth } from "../../firebase/firebase";
import { useRouter } from "next/navigation";
import "./login.css";

export default function LoginPopup({ isOpen, onClose }) {
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [isSigningIn, setIsSigningIn] = useState(false);
    const [error, setError] = useState("");
    const router = useRouter();
    const [showPassword, setShowPassword] = useState(false);

    const ADMIN_EMAIL = "anojmagar12@gmail.com";

    const handleEmailSignIn = async (e) => {
        e.preventDefault();
        setError("");
        setIsSigningIn(true);
        try {
            const userCredential = await signInWithEmailAndPassword(auth, email.trim(), password);
            if (userCredential.user.email !== ADMIN_EMAIL) {
                setError("You are not authorized to access admin.");
                await auth.signOut();
                return;
            }
            onClose();
            router.push("/");
        } catch (err) {
            setError("Invalid email or password.");
        }
        finally {
            setIsSigningIn(false);
        }
    };
    if (!isOpen) return null;
    return (
        <div className="modalOverlay" onClick={onClose}>
            <div className="modalContent" onClick={(e) => e.stopPropagation()}>
                <h2>Welcome to Myjourney</h2>
                {error && <p className="error">{error}</p>}
                <form onSubmit={handleEmailSignIn}>
                    <input type="email" placeholder="Email" value={email} onChange={(e) => setEmail(e.target.value)}
                        required className="input" />
                    <div className="passwordWrapper">
                        <input
                            type={showPassword ? "text" : "password"} // <-- toggle type
                            placeholder="Password"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            required
                            className="input"
                        />
                        <button
                            type="button"
                            className="togglePassword"
                            onClick={() => setShowPassword(!showPassword)}
                        >
                            {showPassword ? "Hide" : "Show"}
                        </button>
                    </div>
                    <button type="submit" id="btn">
                        {isSigningIn ? "Signing in..." : "Log In"}
                    </button>
                </form>
                <button className="closeBtn" onClick={onClose}>
                    ×
                </button>
            </div>
        </div>
    );
}