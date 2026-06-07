"use client";

import { useEffect, useState } from "react";
import { supabase } from "@/lib/supabaseClient";
import { useAuth } from "../../context/AuthContext";
import { useRouter } from "next/navigation";
import styles from "./Dashboard.module.css";
import Link from "next/link";
import Footer from "../Footer/Footer";
import { 
    CheckCircle2, 
    Truck, 
    TrendingUp, 
    MapPin, 
    Calendar, 
    MessageCircle, 
    Search, 
    Bell, 
    BellOff, 
    Sprout, 
    Tag, 
    Package,
    ShieldCheck,
    Clock,
    Lock
} from "lucide-react";

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
    const [modalState, setModalState] = useState<{show: boolean, type: 'auth' | 'success' | 'error', message: string}>({show: false, type: 'auth', message: ''});

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
            setModalState({ show: true, type: 'auth', message: 'Join AgroLink to contact farmers, view detailed market intelligence, and get real-time quality diagnostics.' });
            return true;
        }
        return false;
    };

    const handleDemandCapture = async (crop: string, location: string, isFutureHarvest = false) => {
        if (handleContactGuard(null as any)) return;

        // PROFILE CHECK
        if (!profile?.whatsapp || !profile?.location) {
            setModalState({ show: true, type: 'error', message: "Profile Incomplete: Please set your WhatsApp number and Location in your Profile first so we know where to send your alerts!" });
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
            setModalState({ show: true, type: 'success', message: msg });
            setUserSubscriptions(prev => new Set(prev).add(`${crop}_${location}`));
        } else if (error.code === '23505') {
            setModalState({ show: true, type: 'success', message: `You're already on the list for ${crop} in ${location}.` });
        } else {
            setModalState({ show: true, type: 'error', message: "Error saving interest. Please try again." });
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
            setModalState({ show: true, type: 'success', message: `Unsubscribed from ${crop} alerts in ${location}.` });
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
                        <span style={{ display: "inline-flex", alignItems: "center", gap: "6px" }}>
                            <CheckCircle2 size={15} style={{ color: "#4ade80" }} /> Verified Producers
                        </span>
                        <span style={{ display: "inline-flex", alignItems: "center", gap: "6px" }}>
                            <Truck size={15} style={{ color: "#4ade80" }} /> Logistics Tracking
                        </span>
                        <span style={{ display: "inline-flex", alignItems: "center", gap: "6px" }}>
                            <TrendingUp size={15} style={{ color: "#4ade80" }} /> Live Market Rates
                        </span>
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
                    <button 
                        onClick={(e) => {
                            if (handleContactGuard(e)) return;
                            router.push("/home");
                        }} 
                        className={styles.viewAll}
                        style={{ background: 'none', border: 'none', font: 'inherit', cursor: 'pointer', padding: 0 }}
                    >
                        View Full Marketplace →
                    </button>
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
                                        <span className={styles.location} style={{ display: "inline-flex", alignItems: "center", gap: "4px" }}>
                                            <MapPin size={12} /> {item.location}
                                        </span>
                                    </div>
                                    <h3>{item.crop}</h3>
                                    <div className={styles.price}>
                                        <strong>{Number(item.price).toLocaleString()} FCFA</strong> / {item.unit}
                                    </div>

                                    {/* Geo-Environmental Quality Engine Trust Badge */}
                                    {item.calculated_quality_score !== null && item.calculated_quality_score !== undefined && (
                                        <div className={`${styles.trustBadgeContainer} ${
                                            item.calculated_quality_score >= 90 ? styles.badgePremium :
                                            item.calculated_quality_score >= 70 ? styles.badgeHealthy :
                                            item.calculated_quality_score >= 40 ? styles.badgeDegraded :
                                            styles.badgeCritical
                                        }`}>
                                            <div className={styles.trustBadgeHeader}>
                                                <ShieldCheck size={16} />
                                                <span>Quality: {item.calculated_quality_score}% [{item.quality_status_badge}]</span>
                                            </div>
                                        </div>
                                    )}

                                    {/* Explicit Date and Time */}
                                    <div style={{ marginTop: '8px', padding: '12px 14px', background: '#f8fafc', borderRadius: '12px', border: '1px solid #e2e8f0', display: 'flex', justifyContent: 'space-between', alignItems: 'center', width: '100%', color: '#64748b', fontSize: '0.75rem', fontWeight: 700, marginBottom: '16px' }}>
                                        <span style={{ display: "inline-flex", alignItems: "center", gap: "4px" }}><Package size={12} style={{color: '#94a3b8'}}/> {item.quantity}</span>
                                        <span style={{ display: "inline-flex", alignItems: "center", gap: "4px" }}><Calendar size={12} style={{color: '#94a3b8'}}/> {new Date(item.created_at).toLocaleDateString()}</span>
                                        <span style={{ display: "inline-flex", alignItems: "center", gap: "4px" }}><Clock size={12} style={{color: '#94a3b8'}}/> {new Date(item.created_at).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</span>
                                    </div>

                                    <div className={styles.dashboardActionsContainer}>
                                        {item.harvest === "future" && (
                                            <div style={{fontSize: '0.7rem', fontWeight: 800, color: '#0284c7', marginBottom: '8px', textAlign: 'center', background: '#f0f9ff', padding: '6px', borderRadius: '8px', border: '1px solid #bae6fd', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '6px'}}>
                                                <Calendar size={12} /> Future Harvest: {getHarvestCountdown(item.available_date)}
                                            </div>
                                        )}
                                        <div className={styles.actions}>
                                            <button onClick={handleContactGuard} className={styles.btnAction} style={{ display: "inline-flex", alignItems: "center", justifyContent: "center", gap: "6px" }}>
                                                <MessageCircle size={14} /> WhatsApp
                                            </button>
                                            {item.id ? (
                                                <button onClick={(e) => {
                                                    if (handleContactGuard(e)) return;
                                                    router.push(`/product/${item.id}`);
                                                }} className={styles.btnActionSecondary} style={{ display: "inline-flex", alignItems: "center", justifyContent: "center", gap: "6px" }}>
                                                    <Search size={14} /> View Details
                                                </button>
                                            ) : (
                                                <button disabled className={styles.btnActionSecondary}>No Details</button>
                                            )}
                                        </div>
                                        
                                        {userSubscriptions.has(`${item.crop}_${item.location}`) ? (
                                            <button 
                                                onClick={() => handleUnsubscribeCorrect(item.crop, item.location)}
                                                style={{width: '100%', background: 'transparent', border: 'none', color: '#94a3b8', fontSize: '0.65rem', fontWeight: 800, marginTop: '10px', cursor: 'pointer', display: 'inline-flex', alignItems: 'center', justifyContent: 'center', gap: '4px'}}
                                            >
                                                <BellOff size={11} /> Unsubscribe from {item.crop}
                                            </button>
                                        ) : (
                                            <button 
                                                onClick={() => handleDemandCapture(item.crop, item.location, item.harvest === 'future')}
                                                style={{width: '100%', background: 'transparent', border: 'none', color: '#0ea5e9', fontSize: '0.65rem', fontWeight: 800, marginTop: '10px', cursor: 'pointer', display: 'inline-flex', alignItems: 'center', justifyContent: 'center', gap: '4px'}}
                                            >
                                                <Bell size={11} /> Notify me of future {item.crop} in {item.location}
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
                        <div className={styles.icon} style={{ display: "flex", alignItems: "center", justifyContent: "center" }}>
                            <Sprout size={32} style={{ color: "#4ade80" }} />
                        </div>
                        <h3>For Farmers</h3>
                        <p>Set your own prices and reach thousands of buyers instantly via SMS and Web.</p>
                    </div>
                    <div className={styles.featureCard}>
                        <div className={styles.icon} style={{ display: "flex", alignItems: "center", justifyContent: "center" }}>
                            <Tag size={32} style={{ color: "#4ade80" }} />
                        </div>
                        <h3>For Buyers</h3>
                        <p>Access transparent market rates and purchase directly from the source.</p>
                    </div>
                    <div className={styles.featureCard}>
                        <div className={styles.icon} style={{ display: "flex", alignItems: "center", justifyContent: "center" }}>
                            <Package size={32} style={{ color: "#4ade80" }} />
                        </div>
                        <h3>For Logistics</h3>
                        <p>Partner with producers to transport crops and minimize post-harvest loss.</p>
                    </div>
                </div>
            </section>

            <Footer />

            {/* Custom Modal */}
            {modalState.show && (
                <div className={styles.modalOverlay}>
                    <div className={styles.authModal}>
                        <div className={styles.authModalIcon} style={{ background: modalState.type === 'auth' ? '#fef2f2' : (modalState.type === 'error' ? '#fef2f2' : '#f0fdf4'), color: modalState.type === 'auth' ? '#ef4444' : (modalState.type === 'error' ? '#ef4444' : '#22c55e') }}>
                            {modalState.type === 'auth' ? <Lock size={32} /> : (modalState.type === 'error' ? <BellOff size={32} /> : <CheckCircle2 size={32} />)}
                        </div>
                        <h3>{modalState.type === 'auth' ? 'Access Restricted' : (modalState.type === 'error' ? 'Notice' : 'Success')}</h3>
                        <p>{modalState.message}</p>
                        <div className={styles.authModalActions}>
                            {modalState.type === 'auth' ? (
                                <>
                                    <Link href="/register" className={styles.btnModalPrimary}>Create Free Account</Link>
                                    <Link href="/login" className={styles.btnModalSecondary} onClick={() => setModalState({...modalState, show: false})}>Sign In</Link>
                                    <button className={styles.btnModalSecondary} style={{marginTop: '4px'}} onClick={() => setModalState({...modalState, show: false})}>Continue Browsing</button>
                                </>
                            ) : (
                                <button className={styles.btnModalPrimary} onClick={() => setModalState({...modalState, show: false})}>
                                    Got it
                                </button>
                            )}
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}
