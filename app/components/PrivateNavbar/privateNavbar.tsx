"use client";

import Link from "next/link";
import { useAuth } from "@/app/context/AuthContext";
import { supabase } from "@/lib/supabaseClient";
import { useState, useEffect } from "react";
import styles from "./Nav.module.css";
import NotificationHub from "../NotificationHub/NotificationHub";

export default function PrivateNavbar() {
    const { user } = useAuth();
    const [menuOpen, setMenuOpen] = useState(false);
    const [reportCount, setReportCount] = useState(0);
    const [pendingCount, setPendingCount] = useState(0);
    const [toast, setToast] = useState<{ message: string, type: string } | null>(null);

    useEffect(() => {
        if (!user) return;
        const isAdmin = user.email?.toLowerCase().trim() === "nsamiemmanuelkongnyu@gmail.com";

        const fetchCounts = async () => {
            // Unread reports
            const { count: rCount } = await supabase
                .from("notifications")
                .select("*", { count: 'exact', head: true })
                .eq("user_id", user.id)
                .eq("type", "report")
                .eq("is_read", false);
            if (rCount !== null) setReportCount(rCount);

            // Pending providers (Admin only)
            if (isAdmin) {
                const { count: pCount } = await supabase
                    .from("profiles")
                    .select("*", { count: 'exact', head: true })
                    .eq("is_provider", true)
                    .eq("is_approved_provider", false);
                if (pCount !== null) setPendingCount(pCount);
            }
        };

        fetchCounts();

        // 1. Listen for new reports
        const reportChannel = supabase
            .channel('navbar-reports')
            .on('postgres_changes', { 
                event: '*', 
                schema: 'public', 
                table: 'notifications'
            }, (payload) => {
                // Filter in JS for better reliability
                if (payload.new.user_id === user.id && payload.new.type === 'report') {
                    if (payload.eventType === 'INSERT' || (payload.eventType === 'UPDATE' && payload.new.is_read === false)) {
                        setReportCount(prev => prev + 1);
                        setToast({ message: payload.new.message, type: payload.new.type });
                        setTimeout(() => setToast(null), 8000);
                    }
                }
            })
            .subscribe();

        // 2. Listen for new provider requests (Admin only)
        let providerChannel: any;
        if (isAdmin) {
            providerChannel = supabase
                .channel('admin-pending')
                .on('postgres_changes', { 
                    event: '*', // Listen to everything (inserts and updates)
                    schema: 'public', 
                    table: 'profiles'
                }, () => {
                    fetchCounts(); // Re-fetch to be accurate
                })
                .subscribe();
        }

        return () => { 
            supabase.removeChannel(reportChannel); 
            if (providerChannel) supabase.removeChannel(providerChannel);
        };
    }, [user]);

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
            
            <div className={styles.navRight}>
                <div
                    className={`${styles.hamburger} ${menuOpen ? styles.active : ""}`}
                    onClick={() => setMenuOpen(!menuOpen)}
                >
                    <span></span>
                    <span></span>
                    <span></span>
                </div>
            </div>

            <ul className={`${styles.menu} ${menuOpen ? styles.menuActive : ""}`}>
                <li>
                    {/* <button onClick={handleHomeReload} className={styles.linkButton}>
                        Home
                    </button> */}
                </li>
                <li><Link href="/home">Home</Link></li>
                <li>
                    <Link href="/news" onClick={() => setReportCount(0)}>
                        Official Reports {reportCount > 0 && <span className={styles.navBadge}>{reportCount}</span>}
                    </Link>
                </li>
                <li><Link href="/profile">Profile</Link></li>
                <li><Link href="/about">About Us</Link></li>
                <li><NotificationHub /></li>
                {user?.email?.toLowerCase() === "nsamiemmanuelkongnyu@gmail.com" && (
                    <li>
                        <Link href="/admin/verify" style={{ color: "#ef4444", fontWeight: "900" }}>
                            Admin Hub {pendingCount > 0 && <span className={styles.navBadge}>{pendingCount}</span>}
                        </Link>
                    </li>
                )}
                <li>
                    <button onClick={handleLogout} className={styles.logoutButton}>
                        Logout
                    </button>
                </li>
            </ul>
            {toast && (
                <div className={styles.toastContainer} onClick={() => setToast(null)}>
                    <div className={styles.toastContent}>
                        <span className={styles.toastBadge}>📢 NEW OFFICIAL REPORT</span>
                        <p>{toast.message}</p>
                    </div>
                </div>
            )}
        </nav>
    );
}
