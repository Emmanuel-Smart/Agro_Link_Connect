"use client";

import Link from "next/link";
import { useAuth } from "@/app/context/AuthContext";
import { supabase } from "@/lib/supabaseClient";
import { useState } from "react";
import styles from "./Nav.module.css";

export default function PrivateNavbar() {
    const { user } = useAuth();
    const [menuOpen, setMenuOpen] = useState(false);

    const handleLogout = async () => {
        await supabase.auth.signOut();
        window.location.href = "/login";
    };

    const handleHomeReload = () => {
        window.location.reload(); // reloads current page
    };

    return (
        <nav className={styles.navbar}>
            <h1 className={styles.logo}>AgroLink</h1>

            {/* Hamburger menu for mobile */}
            <div
                className={`${styles.hamburger} ${menuOpen ? styles.active : ""}`}
                onClick={() => setMenuOpen(!menuOpen)}
            >
                <span></span>
                <span></span>
                <span></span>
            </div>

            <ul className={`${styles.menu} ${menuOpen ? styles.menuActive : ""}`}>
                <li>
                    {/* <button onClick={handleHomeReload} className={styles.linkButton}>
                        Home
                    </button> */}
                </li>
                <li><Link href="/home">Home</Link></li>
                <li><Link href="/news">News</Link></li>
                <li><Link href="/community">Community</Link></li>
                <li><Link href="/tools">Tools</Link></li>
                <li><Link href="/profile">Profile</Link></li>
                <li><Link href="/about">About Us</Link></li>
                {user?.email?.toLowerCase() === "nsamiemmanuelkongnyu@gmail.com" && (
                    <li><Link href="/admin/verify" style={{color: '#ef4444', fontWeight: 'bold'}}>Admin Hub</Link></li>
                )}
                <li>
                    <button onClick={handleLogout} className={styles.logoutButton}>
                        Logout
                    </button>
                </li>
            </ul>
        </nav>
    );
}
