"use client";

import { useEffect, useState } from "react";
import { supabase } from "@/lib/supabaseClient";
import { useAuth } from "../../context/AuthContext";
import { useRouter } from "next/navigation";
import styles from "./Dashboard.module.css";
import Link from "next/link";
import Footer from "../Footer/Footer";

const getHarvestCountdown = (availableDate: string) => {
    if (!availableDate) return null;
    const target = new Date(availableDate);
    const now = new Date();
    const diffMs = target.getTime() - now.getTime();
    if (diffMs <= 0) return "Ready";
    const diffDays = Math.floor(diffMs / (1000 * 60 * 60 * 24));
    const diffHours = Math.floor((diffMs % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
    if (diffDays > 0) return `${diffDays}d ${diffHours}h`;
    return `${diffHours}h`;
};

export default function Dashboard() {
    const { user } = useAuth();
    const router = useRouter();
    const [products, setProducts] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);
    const [profile, setProfile] = useState<any>(null);
    const [userSubscriptions, setUserSubscriptions] = useState<Set<string>>(new Set());

    useEffect(() => {
        const fetchData = async () => {
            const { data } = await supabase
                .from("products")
                .select("*, profiles(whatsapp, phone)")
                .order("created_at", { ascending: false })
                .limit(12);
            
            if (data) setProducts(data);

            if (user) {
                const { data: profileData } = await supabase.from("profiles").select("*").eq("id", user.id).single();
                if (profileData) setProfile(profileData);

                // Fetch subscriptions
                const { data: subData } = await supabase.from("demand_signals").select("crop, location").eq("user_id", user.id);
                if (subData) {
                    const subSet = new Set(subData.map(s => `${s.crop}_${s.location}`));
                    setUserSubscriptions(subSet);
                }
            }

            setLoading(false);
        };
        fetchData();
    }, [user]);

    const handleContactGuard = (e: React.MouseEvent) => {
        if (!user) {
            if (e) e.preventDefault();
            alert("🔒 Access Restricted: Please Sign Up or Login to contact farmers and view full market details.");
            router.push("/register");
            return true;
        }
        return false;
    };

    const handleDemandCapture = async (crop: string, location: string, isFutureHarvest = false) => {
        if (handleContactGuard(null as any)) return;

        // PROFILE CHECK
        if (!profile?.whatsapp || !profile?.location) {
            alert("🛠️ Profile Incomplete: Please set your WhatsApp number and Location in your Profile first so we know where to send your alerts!");
            router.push("/profile");
            return;
        }

        const { error } = await supabase.from("demand_signals").insert([{
            user_id: user?.id,
            crop: crop,
            location: location,
            created_at: new Date().toISOString()
        }]);
        
        if (!error) {
            const msg = isFutureHarvest 
                ? `Subscription Active! We will notify you on the harvest date and whenever new ${crop} is posted in ${location}.`
                : `Signal captured! We will notify you when ${crop} becomes available in ${location}.`;
            alert(msg);
            setUserSubscriptions(prev => new Set(prev).add(`${crop}_${location}`));
        } else if (error.code === '23505') {
            alert(`You're already on the list for ${crop} in ${location}.`);
        } else {
            alert("Error saving interest. Please try again.");
        }
    };

    const handleUnsubscribe = async (crop: string, location: string) => {
        if (!user) return;
        const { error } = await supabase
            .from("demand_signals")
            .delete()
            .eq("user_id", user.id)
            .eq("crop", crop)
            .eq("location", location);
        
        if (!error) {
            alert(`Unsubscribed from ${crop} alerts in ${location}.`);
            const newSubs = new Set(userSubscriptions);
            newSubs.delete(`${crop}_location`); // Wait, typo in my thought, fixing below
            setUserSubscriptions(newSubs);
        }
    };

    // Correcting unsubscribe logic
    const handleUnsubscribeCorrect = async (crop: string, location: string) => {
        if (!user) return;
        const { error } = await supabase
            .from("demand_signals")
            .delete()
            .eq("user_id", user.id)
            .eq("crop", crop)
            .eq("location", location);
        
        if (!error) {
            alert(`Unsubscribed from ${crop} alerts in ${location}.`);
            const newSubs = new Set(userSubscriptions);
            newSubs.delete(`${crop}_${location}`);
            setUserSubscriptions(newSubs);
        }
    };

    return (
        <div className={styles.landingContainer}>
            {/* HERO SECTION */}
            <section className={styles.hero}>
                <div className={styles.heroOverlay}></div>
                <div className={styles.heroContent}>
                    <span className={styles.badge}>#1 Agricultural Network</span>
                    <h1>The Future of Bamenda</h1>
                    <p>Agro-Link Intelligence. Direct from the farm to your warehouse. Eliminate middlemen, reduce waste, and increase profits.</p>
                    <div className={styles.ctaGroup}>
                        <Link href="/register" className={styles.btnPrimary}>Start Trading Now</Link>
                        <Link href="/About" className={styles.btnSecondary}>Learn How It Works</Link>
                    </div>
                    <div className={styles.trustSignals}>
                        <span>✅ Verified Producers</span>
                        <span>🚛 Logistics Tracking</span>
                        <span>📊 Live Market Rates</span>
                    </div>
                </div>
            </section>

            {/* LIVE MARKET PREVIEW */}
            <section className={styles.previewSection}>
                <div className={styles.sectionHeader}>
                    <div>
                        <h2>Live Market Preview</h2>
                        <p>Real-time listings from local farmers across the region.</p>
                    </div>
                    <Link href="/home" className={styles.viewAll}>View Full Marketplace →</Link>
                </div>

                {loading ? (
                    <div className={styles.loading}>Scanning market floor...</div>
                ) : (
                    <div className={styles.grid}>
                        {products.map((item) => (
                            <div key={item.id} className={styles.card}>
                                {item.image_url && (
                                    <div className={styles.imageBox}>
                                        <img src={item.image_url} alt={item.crop} />
                                    </div>
                                )}
                                <div className={styles.cardBody}>
                                    <div className={styles.cardTags}>
                                        <span className={styles.tag}>{item.category}</span>
                                        <span className={styles.location}>📍 {item.location}</span>
                                    </div>
                                    <h3>{item.crop}</h3>
                                    <div className={styles.price}>
                                        <strong>{Number(item.price).toLocaleString()} FCFA</strong> / {item.unit}
                                    </div>
                                    <div className={styles.dashboardActionsContainer}>
                                        {item.harvest === "future" && (
                                            <div style={{fontSize: '0.7rem', fontWeight: 800, color: '#0284c7', marginBottom: '8px', textAlign: 'center', background: '#f0f9ff', padding: '6px', borderRadius: '8px', border: '1px solid #bae6fd'}}>
                                                🚚 Future Harvest: {getHarvestCountdown(item.available_date)}
                                            </div>
                                        )}
                                        <div className={styles.actions}>
                                            <button onClick={handleContactGuard} className={styles.btnAction}>💬 WhatsApp</button>
                                            <button onClick={handleContactGuard} className={styles.btnActionSecondary}>📞 Call Farmer</button>
                                        </div>
                                        
                                        {userSubscriptions.has(`${item.crop}_${item.location}`) ? (
                                            <button 
                                                onClick={() => handleUnsubscribeCorrect(item.crop, item.location)}
                                                style={{width: '100%', background: 'transparent', border: 'none', color: '#94a3b8', fontSize: '0.65rem', fontWeight: 800, marginTop: '10px', cursor: 'pointer', textAlign: 'center'}}
                                            >
                                                🔕 Unsubscribe from {item.crop}
                                            </button>
                                        ) : (
                                            <button 
                                                onClick={() => handleDemandCapture(item.crop, item.location, item.harvest === 'future')}
                                                style={{width: '100%', background: 'transparent', border: 'none', color: '#0ea5e9', fontSize: '0.65rem', fontWeight: 800, marginTop: '10px', cursor: 'pointer', textAlign: 'center'}}
                                            >
                                                🔔 Notify me of future {item.crop} in {item.location}
                                            </button>
                                        )}
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                )}
            </section>

            {/* WHY AGROLINK */}
            <section className={styles.features}>
                <div className={styles.featureGrid}>
                    <div className={styles.featureCard}>
                        <div className={styles.icon}>🌾</div>
                        <h3>For Farmers</h3>
                        <p>Set your own prices and reach thousands of buyers instantly via SMS and Web.</p>
                    </div>
                    <div className={styles.featureCard}>
                        <div className={styles.icon}>💰</div>
                        <h3>For Buyers</h3>
                        <p>Access transparent market rates and purchase directly from the source.</p>
                    </div>
                    <div className={styles.featureCard}>
                        <div className={styles.icon}>📦</div>
                        <h3>For Logistics</h3>
                        <p>Partner with producers to transport crops and minimize post-harvest loss.</p>
                    </div>
                </div>
            </section>

            <Footer />
        </div>
    );
}
