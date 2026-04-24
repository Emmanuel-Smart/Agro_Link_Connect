"use client";

import { useEffect, useState } from "react";
import { supabase } from "@/lib/supabaseClient";
import { useAuth } from "../../context/AuthContext";
import { useRouter } from "next/navigation";
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
    const router = useRouter();
    const { user } = useAuth();
    const [profile, setProfile] = useState<any>(null);
    const [products, setProducts] = useState<any[]>([]);
    const [alerts, setAlerts] = useState<any[]>([]);
    const [marketPulse, setMarketPulse] = useState<Record<string, {min: number, avg: number, max: number}>>({});
    const [loading, setLoading] = useState(true);
    const [initialLoading, setInitialLoading] = useState(true);
    const [loadingMore, setLoadingMore] = useState(false);

    // Filter & Search State
    const [searchQuery, setSearchQuery] = useState("");
    const [debouncedSearch, setDebouncedSearch] = useState("");
    const [category, setCategory] = useState("");
    const [location, setLocation] = useState("");
    const [allLocations, setAllLocations] = useState<string[]>([]);
    
    // Pagination
    const [page, setPage] = useState(0);
    const [hasMore, setHasMore] = useState(true);
    const PAGE_SIZE = 12;

    useEffect(() => {
        const fetchMetadata = async () => {
            // Fetch unique locations for the filter
            const { data } = await supabase.from("products").select("location");
            if (data) {
                const unique = Array.from(new Set(data.map(i => i.location))).filter(Boolean) as string[];
                setAllLocations(unique.sort());
            }

            if (user) {
                const { data: profileData } = await supabase.from("profiles").select("*").eq("id", user.id).single();
                if (profileData) {
                    setProfile(profileData);
                    // Fetch local alerts
                    const { data: alertData } = await supabase.from("alerts").select("*").eq("location", profileData.location).order("created_at", { ascending: false });
                    if (alertData) setAlerts(alertData);
                }
            }
            setInitialLoading(false);
        };
        fetchMetadata();
    }, [user]);

    // Debounce Search Logic
    useEffect(() => {
        const handler = setTimeout(() => {
            setDebouncedSearch(searchQuery);
        }, 500);
        return () => clearTimeout(handler);
    }, [searchQuery]);

    useEffect(() => {
        fetchProducts(true);
    }, [debouncedSearch, category, location]);

    const fetchProducts = async (reset = false) => {
        if (reset) {
            setLoading(true);
            setPage(0);
        } else {
            setLoadingMore(true);
        }

        const start = reset ? 0 : (page + 1) * PAGE_SIZE;
        const end = start + PAGE_SIZE - 1;

        let query = supabase
            .from("products")
            .select("*, profiles(whatsapp, phone)", { count: 'exact' })
            .order("created_at", { ascending: false })
            .range(start, end);

        if (category) query = query.eq("category", category);
        if (location) query = query.eq("location", location);
        if (debouncedSearch) query = query.ilike("crop", `%${debouncedSearch}%`);

        const { data, count, error } = await query;

        if (error) {
            console.error(error);
        } else if (data) {
            if (reset) {
                setProducts(data);
            } else {
                setProducts([...products, ...data]);
                setPage(page + 1);
            }
            setHasMore(count ? (reset ? data.length : products.length + data.length) < count : false);

            // Update Market Pulse based on full system (or at least current batch)
            const pulse: Record<string, {min: number, avg: number, max: number}> = { ...marketPulse };
            data.forEach(p => {
                const key = `${p.crop}_${p.location}_${p.unit}`;
                const similar = data.filter(x => x.crop === p.crop && x.location === p.location && x.unit === p.unit);
                const prices = similar.map(x => Number(x.price));
                pulse[key] = {
                    min: Math.min(...prices),
                    avg: prices.reduce((a, b) => a + b, 0) / prices.length,
                    max: Math.max(...prices)
                };
            });
            setMarketPulse(pulse);
        }

        setLoading(false);
        setLoadingMore(false);
    };

    const handleDemandCapture = async () => {
        if (!debouncedSearch) return;
        const { error } = await supabase.from("demand_signals").insert([{
            user_id: user?.id,
            crop: debouncedSearch,
            location: location || profile?.location || "Unknown",
            created_at: new Date().toISOString()
        }]);
        
        if (!error) {
            alert(`Signal captured! We will notify you when ${debouncedSearch} becomes available in ${location || profile?.location || "your area"}.`);
        } else {
            alert("Error saving interest. Please try again.");
        }
    };

    const handleContactGuard = (e: React.MouseEvent) => {
        if (!user) {
            e.preventDefault();
            alert("🔒 Access Restricted: Please Sign Up or Login to contact farmers and view full market details.");
            router.push("/register");
        }
    };

    if (initialLoading) return <div className={styles.loading}>Loading Regional Marketplace...</div>;

    return (
        <main className={styles.container}>
            {/* HERO */}
            <section className={styles.hero}>
                <div className={styles.heroContent}>
                    <h1>Public Market Discovery</h1>
                    <p>Transparent local trading, direct from the source.</p>
                </div>
            </section>

            <section className={styles.discoveryBar}>
                <div className={styles.searchGroup}>
                    <span className={styles.searchIcon}>🔍</span>
                    <input 
                        type="text" 
                        placeholder="Search crops, farmers, or keywords..." 
                        className={styles.searchInput}
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                    />
                </div>
                <div className={styles.filterGroup}>
                    <select className={styles.filterSelect} value={category} onChange={(e) => setCategory(e.target.value)}>
                        <option value="">All Categories</option>
                        <option>Tubers</option>
                        <option>Cereals</option>
                        <option>Vegetables</option>
                        <option>Fruits</option>
                        <option>Livestock</option>
                        <option>Cash Crops</option>
                        <option>Others</option>
                    </select>
                    <select className={styles.filterSelect} value={location} onChange={(e) => setLocation(e.target.value)}>
                        <option value="">All Regions</option>
                        {allLocations.map(loc => (
                            <option key={loc} value={loc}>{loc}</option>
                        ))}
                    </select>
                </div>
            </section>

            <div className={styles.contentWrapper}>
                {/* Phase 4: Geofenced Hub */}
                {alerts.length > 0 && !searchQuery && !category && !location && (
                    <section className={styles.broadcastHub}>
                        <h2 className={styles.sectionTitle}>📡 Official Bulletin ({profile?.location})</h2>
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
                    <div style={{display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '20px'}}>
                        <h2 className={styles.sectionTitle} style={{margin: 0}}>Live Listings</h2>
                        {loading && !initialLoading && <span style={{fontSize: '0.8rem', color: '#94a3b8', fontWeight: 600}}>Updating results...</span>}
                    </div>
                    
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
                                            <a onClick={handleContactGuard} href={`https://wa.me/${item.profiles.whatsapp}`} target="_blank" className={styles.btnWhatsapp}>
                                                💬 WhatsApp
                                            </a>
                                        ) : (
                                            <button disabled className={styles.btnDisabled}>No WhatsApp</button>
                                        )}
                                        {item.profiles?.phone && (
                                            <a onClick={handleContactGuard} href={`tel:${item.profiles.phone}`} className={styles.btnCall}>
                                                📞 Call
                                            </a>
                                        )}
                                    </div>
                                </div>
                            );
                        })}

                        {products.length === 0 && !loading && (
                            <div className={styles.emptyState}>
                                <span className={styles.emptyIcon}>🚜</span>
                                <h3>No matching crops found</h3>
                                <p>We couldn't find any results for "{debouncedSearch}" in this region.</p>
                                {debouncedSearch && (
                                    <button className={styles.demandBtn} onClick={handleDemandCapture}>
                                        Notify me when "{debouncedSearch}" is available
                                    </button>
                                )}
                            </div>
                        )}
                    </div>

                    {hasMore && (
                        <div className={styles.loadMoreContainer}>
                            <button 
                                className={styles.btnLoadMore} 
                                onClick={() => fetchProducts(false)}
                                disabled={loadingMore}
                            >
                                {loadingMore ? "Loading..." : "View More Listings"}
                            </button>
                        </div>
                    )}
                </section>
            </div>
        </main>
    );
}
