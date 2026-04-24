"use client";

import { useEffect, useState } from "react";
import { supabase } from "@/lib/supabaseClient";
import { useAuth } from "../../context/AuthContext";
import styles from "./Home.module.css";
import Link from "next/link";

const formatTimeAgo = (dateString: string) => {
    if (!dateString) return "Recently";
    const date = new Date(dateString);
    const now = new Date();
    const diffInMs = now.getTime() - date.getTime();
    const diffInMins = Math.floor(diffInMs / (1000 * 60));

    if (diffInMins < 60) return `${diffInMins || 1}m ago`;
    if (date.toDateString() === now.toDateString()) return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
    return date.toLocaleDateString();
};

const getPerishabilityState = (availableDate: string, isPerishable: boolean) => {
    if (!isPerishable) return null;
    const target = new Date(availableDate);
    target.setDate(target.getDate() + 7); // Mock 7-day shelf life
    const now = new Date();
    const diffMs = target.getTime() - now.getTime();
    
    if (diffMs <= 0) return { state: 'red', text: 'Expired' };
    const diffDays = Math.floor(diffMs / (1000 * 60 * 60 * 24));
    
    if (diffDays > 4) return { state: 'green', text: `${diffDays}d left (Fresh)` };
    if (diffDays > 1) return { state: 'yellow', text: `${diffDays}d left (Expiring)` };
    return { state: 'red', text: `Critical: <1d left` };
};

export default function HomePage() {
    const { user } = useAuth();
    const [profile, setProfile] = useState<any>(null);
    const [products, setProducts] = useState<any[]>([]);
    const [alerts, setAlerts] = useState<any[]>([]);
    const [marketPulse, setMarketPulse] = useState<Record<string, {min: number, avg: number, max: number}>>({});
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchInitialData = async () => {
            let userLocation = null;
            if (user) {
                const { data: profileData } = await supabase.from("profiles").select("*").eq("id", user.id).single();
                if (profileData) {
                    setProfile(profileData);
                    userLocation = profileData.location;
                }
            }

            const { data: productData } = await supabase
                .from("products")
                .select("*, profiles(whatsapp, phone)")
                .order("created_at", { ascending: false });
                
            if (productData) {
                setProducts(productData);
                
                // Calculate Market Pulse dynamically
                const pulse: Record<string, {min: number, avg: number, max: number}> = {};
                productData.forEach(p => {
                    const key = `${p.crop}_${p.location}_${p.unit}`;
                    const similar = productData.filter(x => x.crop === p.crop && x.location === p.location && x.unit === p.unit);
                    const prices = similar.map(x => Number(x.price));
                    pulse[key] = {
                        min: Math.min(...prices),
                        avg: prices.reduce((a, b) => a + b, 0) / prices.length,
                        max: Math.max(...prices)
                    };
                });
                setMarketPulse(pulse);
            }

            if (userLocation) {
                const { data: alertData } = await supabase.from("alerts").select("*").eq("location", userLocation).order("created_at", { ascending: false });
                if (alertData) setAlerts(alertData);
            }

            setLoading(false);
        };

        fetchInitialData();
    }, [user]);

    if (loading) return <div className={styles.loading}>Loading Regional Marketplace...</div>;

    return (
        <main className={styles.container}>
            {/* HERO */}
            <section className={styles.hero}>
                <div className={styles.heroContent}>
                    <h1>Public Market Discovery</h1>
                    <p>Transparent local trading, direct from the source.</p>
                </div>
            </section>

            <div className={styles.contentWrapper}>
                {/* Phase 4: Geofenced Hub */}
                {alerts.length > 0 && (
                    <section className={styles.broadcastHub}>
                        <h2 className={styles.sectionTitle}>📡 Official Bulletin ({profile.location})</h2>
                        <div className={styles.alertGrid}>
                            {alerts.map(alert => (
                                <div key={alert.id} className={styles.alertCard}>
                                    <span className={styles.alertBadge}>{alert.type}</span>
                                    <p>{alert.message}</p>
                                </div>
                            ))}
                        </div>
                    </section>
                )}

                <section className={styles.marketplace}>
                    <h2 className={styles.sectionTitle}>Live Listings</h2>
                    
                    <div className={styles.grid}>
                        {products.map(item => {
                            const pulseKey = `${item.crop}_${item.location}_${item.unit}`;
                            const pulse = marketPulse[pulseKey];
                            const perishState = getPerishabilityState(item.available_date || item.created_at, item.is_perishable);
                            
                            return (
                                <div key={item.id} className={styles.card}>
                                    {item.image_url && (
                                        <div className={styles.cardImageWrapper}>
                                            <img src={item.image_url} alt={item.crop} className={styles.cardImage} />
                                        </div>
                                    )}
                                    <div className={styles.cardHeader}>
                                        <div className={styles.tags}>
                                            <span className={styles.categoryTag}>{item.category || "Crop"}</span>
                                            {item.harvest === "future" && <span className={styles.blueprintBadge}>Future Harvest</span>}
                                        </div>
                                        <span className={styles.locationBadge}>📍 {item.location}</span>
                                    </div>

                                    <h3>{item.crop}</h3>
                                    
                                    <div className={styles.priceRow}>
                                        💰 <strong>{Number(item.price).toLocaleString()} FCFA</strong> / {item.unit}
                                    </div>

                                    {/* Phase 5: Transparency Badges */}
                                    {pulse && (
                                        <div className={styles.transparencyBadge}>
                                            <div className={styles.transTitle}>Market Pulse</div>
                                            <div className={styles.transStats}>
                                                <span>Min <strong>{pulse.min}</strong></span>
                                                <span>Max <strong>{pulse.max}</strong></span>
                                            </div>
                                        </div>
                                    )}

                                    {/* Phase 5: Perishability Meter */}
                                    {perishState && (
                                        <div className={`${styles.perishMeter} ${styles[`perish_${perishState.state}`]}`}>
                                            ⏱️ Quality Timer: <strong>{perishState.text}</strong>
                                        </div>
                                    )}

                                    <div className={styles.details}>
                                        <p>{item.description}</p>
                                        <div className={styles.meta}>
                                            <span>📦 {item.quantity}</span>
                                            <span>🕒 {formatTimeAgo(item.created_at)}</span>
                                        </div>
                                    </div>

                                    {/* Phase 5: Direct P2P Closing */}
                                    <div className={styles.actions}>
                                        {item.profiles?.whatsapp ? (
                                            <a href={`https://wa.me/${item.profiles.whatsapp}`} target="_blank" className={styles.btnWhatsapp}>
                                                💬 WhatsApp
                                            </a>
                                        ) : (
                                            <button disabled className={styles.btnDisabled}>No WhatsApp</button>
                                        )}
                                        {item.profiles?.phone && (
                                            <a href={`tel:${item.profiles.phone}`} className={styles.btnCall}>
                                                📞 Call
                                            </a>
                                        )}
                                    </div>
                                </div>
                            );
                        })}
                    </div>
                </section>
            </div>
        </main>
    );
}
