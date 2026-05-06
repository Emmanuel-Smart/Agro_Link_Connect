"use client";

import { useState } from "react";
import Link from "next/link";
import styles from "./Navbar.module.css";

export default function Navbar() {
    const [menuOpen, setMenuOpen] = useState(false);

    return (
        <nav className={styles.navbar}>
            <h1 className={styles.logo}>AgroLink</h1>
            
            <div
                className={`${styles.hamburger} ${menuOpen ? styles.active : ""}`}
                onClick={() => setMenuOpen(!menuOpen)}
            >
                <span></span>
                <span></span>
                <span></span>
            </div>

            <ul className={`${styles.menu} ${menuOpen ? styles.menuActive : ""}`}>
                <li><Link href="/" onClick={() => setMenuOpen(false)}>Home</Link></li>
                <li><Link href="/register" onClick={() => setMenuOpen(false)}>Register</Link></li>
                <li><Link href="/login" onClick={() => setMenuOpen(false)}>Login</Link></li>
            </ul>
        </nav>
    );
}
