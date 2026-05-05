"use client";

import { SocialIcon } from "react-social-icons";
import Image from "next/image";
import "../footer/footer.css";
import Link from 'next/link';


export default function Footer() {
    return (
        <footer className="footer">

            <div className="footer-grid">

                {/* COLUMN 1 */}
                <div className="footer-column">
                    <h4>League</h4>
                    <a href="/components/about">About</a>
                    <a href="/components/news">News</a>
                </div>

                {/* COLUMN 2 */}
                <div className="footer-column">
                    <h4>Matches</h4>
                    <Link href="/components/matches">
                        <button className="primary">Matches</button>
                    </Link>
                    <Link href="/components/table">
                        <button className="primary">Table</button>
                    </Link>
                </div>

                {/* COLUMN 3 */}
                <div className="footer-column">
                    <h4>Clubs</h4>
                    <Link href="/components/teams">
                        <button className="primary">Teams</button>
                    </Link>
                    <Link href="/components/statistics">
                        <button className="primary">Stats</button>
                    </Link>
                </div>

                {/* COLUMN 4 */}
                <div className="footer-column social-column">
                    <h4>Follow Us</h4>
                    <div className="social-links" id="social-links">
                        <SocialIcon
                            url="https://www.facebook.com/WhateverFC2017"
                            aria-label="Facebook"
                            target="_blank"
                            rel="noopener noreferrer"
                            className="social-link"
                        />
                        <SocialIcon
                            url="https://www.instagram.com/fc.whatever/"
                            aria-label="Instagram"
                            target="_blank"
                            rel="noopener noreferrer"
                            className="social-link"
                        />
                    </div>
                </div>

            </div>

            {/* Bottom Bar */}
            <div className="footer-bottom">
                <div className="footerLogo">
                    <Image src="/img/whatever.png" width={40}
                        height={20} loading="eager" priority
                        unoptimized alt="Logo" className="footerLogo" id="footerLogo" />
                    <small className="footer-small" id="footer-small">© {new Date().getFullYear()} FcWhatever</small>
                </div>
                <div className="footer-sponsor">
                    <span className="sponsor-text">Supported by</span>
                    <a
                        href="https://vakisushi.be/"
                        target="_blank"
                        rel="noopener noreferrer"
                    >
                        <Image
                            src="/img/vakiSushi.png"
                            width={40}
                            height={40}
                            alt="Vaki Sushi logo"
                            unoptimized
                        />
                    </a>
                    <small className="footer-small">Vaki Sushi</small>
                </div>

            </div>

        </footer>
    );
}
