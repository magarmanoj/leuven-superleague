"use client";

import { useState, useContext } from "react";
import Link from 'next/link';
import Image from "next/image";
import '../navigation/nav.css';
import { AuthContext } from "../Context/authContext";

export default function Navigation() {
    const [menuOpen, setMenuOpen] = useState(false);
    const { logout, isAdmin } = useContext(AuthContext); // track logged-in user


    const toggleMenu = () => setMenuOpen(!menuOpen);
    const closeMenu = () => setMenuOpen(false);

    return (
        <header className="header">
            <nav className="nav" aria-label="Main navigation">
                {/* Desktop Links */}
                <ul className="nav-list nav-left">
                    <li className="nav-item"><Link href="/" className="nav-link">Home</Link></li>
                    <li className="nav-item"><Link href="/components/teams" className="nav-link">Teams</Link></li>
                    <li className="nav-item"><Link href="/components/matches" className="nav-link">Matches</Link></li>
                </ul>

                {/* Brand Logo */}
                <div className="brand">
                    <Link href="/">
                        <Image
                            src="/img/superleague.png"
                            width={250}
                            height={150}
                            alt="Logo"
                            className="logo"
                            priority
                            unoptimized
                        />
                    </Link>
                </div>

                {/* Desktop Right Links */}
                <ul className="nav-list nav-right">
                    <li className="nav-item"><Link href="/components/table" className="nav-link">Table</Link></li>
                    <li className="nav-item"><Link href="/components/statistics" className="nav-link">Statistics</Link></li>
                    <li className="nav-item"><Link href="/components/events" className="nav-link">Events</Link></li>
                    {isAdmin && (
                        <li className="nav-item">
                            <button className="nav-link logout-btn" onClick={logout}>
                                Logout
                            </button>
                        </li>
                    )}
                </ul>

                {/* Hamburger Button */}
                <button className="burger-btn" onClick={toggleMenu} aria-label="Open menu">
                    <span className="burger-line"></span>
                    <span className="burger-line"></span>
                    <span className="burger-line"></span>
                </button>

                {/* Left Sidebar Overlay */}
                {menuOpen && (
                    <div className="menu-overlay" onClick={closeMenu}>
                        <div className="menu-sidebar" onClick={e => e.stopPropagation()}>
                            <button className="close-btn" onClick={closeMenu}>×</button>
                            <ul className="mobile-nav-list">
                                <li><Link href="/" onClick={closeMenu}>Home</Link></li>
                                <li><Link href="/components/teams" onClick={closeMenu}>Teams</Link></li>
                                <li><Link href="/components/matches" onClick={closeMenu}>Matches</Link></li>
                                <li><Link href="/components/table" onClick={closeMenu}>Table</Link></li>
                                <li><Link href="/components/statistics" onClick={closeMenu}>Statistics</Link></li>
                                <li><Link href="/components/events" onClick={closeMenu} >Events</Link></li>
                                {isAdmin && (
                                    <li className="nav-item">
                                        <button className="nav-link logout-btn" onClick={logout}>
                                            Logout
                                        </button>
                                    </li>
                                )}
                            </ul>
                        </div>
                    </div>
                )}
            </nav>
        </header>
    );
}
