"use client";

import Link from "next/link";
import styles from "./Footer.module.css";

export default function Footer() {
    return (
        <footer className={styles.footer}>
            <div className={styles.footerGrid}>
                <div className={styles.footerBrand}>
                    <h3>AgroLink</h3>
                    <p>Empowering African agriculture through digital transparency and direct commerce.</p>
                    <div className={styles.socials}>
                        <span>Facebook</span> • <span>Twitter</span> • <span>LinkedIn</span>
                    </div>
                </div>
                <div className={styles.footerLinks}>
                    <h4>Marketplace</h4>
                    <Link href="/home">Discovery Feed</Link>
                    <Link href="/register">Become a Provider</Link>
                    <Link href="/login">Farmer Login</Link>
                </div>
                <div className={styles.footerLinks}>
                    <h4>Platform</h4>
                    <Link href="/About">About Us</Link>
                    <Link href="/Community">Community</Link>
                    <Link href="/Tools">Pro Tools</Link>
                </div>
            </div>
            <div className={styles.footerBottom}>
                <p>© 2026 AgroLink Connect. All rights reserved. Designed for the Future of Bamenda.</p>
            </div>
        </footer>
    );
}
