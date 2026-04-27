"use client";

import { useEffect, useState } from "react";
import { supabase } from "@/lib/supabaseClient";
import { useAuth } from "@/app/context/AuthContext";
import styles from "./News.module.css";
import Footer from "../../components/Footer/Footer";

export default function OfficialReportsPage() {
    const { user } = useAuth();
    const [reports, setReports] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchReports = async () => {
            const now = new Date().toISOString();
            const { data, error } = await supabase
                .from("alerts")
                .select("*")
                .or(`expires_at.is.null,expires_at.gt.${now}`)
                .order("created_at", { ascending: false });

            if (data) setReports(data);
            setLoading(false);
        };
        fetchReports();
    }, []);

    const formatTimeAgo = (dateString: string) => {
        const date = new Date(dateString);
        const now = new Date();
        const diffInMs = now.getTime() - date.getTime();
        const diffInDays = Math.floor(diffInMs / (1000 * 60 * 60 * 24));
        
        if (diffInDays === 0) return "Today";
        if (diffInDays === 1) return "Yesterday";
        return `${diffInDays} days ago`;
    };

    const getCountdown = (expiryDate: string) => {
        if (!expiryDate) return null;
        const target = new Date(expiryDate);
        const now = new Date();
        const diffMs = target.getTime() - now.getTime();
        
        if (diffMs <= 0) return "EXPIRED";
        
        const diffDays = Math.floor(diffMs / (1000 * 60 * 60 * 24));
        const diffHours = Math.floor((diffMs % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
        const diffMins = Math.floor((diffMs % (1000 * 60 * 60)) / (1000 * 60));
        
        if (diffDays > 0) return `${diffDays}d ${diffHours}h left`;
        return `${diffHours}h ${diffMins}m left`;
    };

    if (loading) return <div className={styles.loading}>Loading Official Intelligence...</div>;

    return (
        <main className={styles.container}>
            <section className={styles.hero}>
                <div className={styles.heroContent}>
                    <h1>🛡️ Official Regional Reports</h1>
                    <p>Verified agricultural bulletins and emergency broadcasts for the Bamenda region.</p>
                </div>
            </section>

            <div className={styles.feed}>
                {reports.length === 0 ? (
                    <div className={styles.empty}>
                        <h3>No official reports at this time</h3>
                        <p>When verified providers broadcast bulletins, they will appear here.</p>
                    </div>
                ) : (
                    reports.map(report => {
                        const countdown = getCountdown(report.expires_at);
                        return (
                            <article key={report.id} className={styles.reportCard}>
                                <div className={styles.cardHeader}>
                                    <div className={styles.typeGroup}>
                                        <span className={styles.typeBadge}>{report.type}</span>
                                        {countdown && (
                                            <span className={`${styles.countdownBadge} ${countdown === 'EXPIRED' ? styles.expired : ''}`}>
                                                ⏳ {countdown}
                                            </span>
                                        )}
                                    </div>
                                    <span className={styles.locationBadge}>📍 {report.location}</span>
                                </div>
                                <p className={styles.message}>{report.message}</p>
                                <div className={styles.footer}>
                                    <span className={styles.date}>Verified: {formatTimeAgo(report.created_at)}</span>
                                    <span className={styles.source}>Source: Approved Regional Provider</span>
                                </div>
                            </article>
                        );
                    })
                )}
            </div>
            <Footer />
        </main>
    );
}
