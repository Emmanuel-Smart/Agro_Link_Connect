"use client";

import { useEffect, useState } from "react";
import { supabase } from "@/lib/supabaseClient";
import { useAuth } from "../../context/AuthContext";
import { useRouter } from "next/navigation";
import styles from "./Home.module.css";
import Link from "next/link";
import Footer from "../../components/Footer/Footer";

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

const getHarvestCountdown = (availableDate: string) => {
    if (!availableDate) return null;
    const target = new Date(availableDate);
    const now = new Date();
    const diffMs = target.getTime() - now.getTime();
    
    if (diffMs <= 0) return "Ready for Harvest";
    
    const diffDays = Math.floor(diffMs / (1000 * 60 * 60 * 24));
    const diffHours = Math.floor((diffMs % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
    
    if (diffDays > 0) return `${diffDays}d ${diffHours}h left`;
    return `${diffHours}h left`;
};

export default function HomePage() {
    const router = useRouter();
    const { user } = useAuth();
    const [profile, setProfile] = useState<any>(null);
    const [products, setProducts] = useState<any[]>([]);
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
    const [userSubscriptions, setUserSubscriptions] = useState<Set<string>>(new Set());
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
                }

                // Fetch user subscriptions
                const { data: subData } = await supabase.from("demand_signals").select("crop, location").eq("user_id", user.id);
                if (subData) {
                    const subSet = new Set(subData.map(s => `${s.crop}_${s.location}`));
                    setUserSubscriptions(subSet);
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
        const searchParams = new URLSearchParams(window.location.search);
        const highlightId = searchParams.get("highlight");

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
            .select("*, profiles(whatsapp, phone)", { count: 'exact' });

        if (highlightId && reset) {
            // Prioritize the highlighted product
            query = query.eq("id", highlightId);
        } else {
            query = query.order("created_at", { ascending: false }).range(start, end);
            if (category) query = query.eq("category", category);
            if (location) query = query.eq("location", location);
            if (debouncedSearch) query = query.ilike("crop", `%${debouncedSearch}%`);
        }

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

    const handleDemandCapture = async (cropParam?: string, locationParam?: string, isFutureHarvest = false) => {
        const cropToSave = cropParam || debouncedSearch;
        const locationToSave = locationParam || location || profile?.location || "Unknown";

        if (!cropToSave) return;

        // PROFILE CHECK: Must have phone/whatsapp and location for alerts to work
        if (!profile?.whatsapp || !profile?.location) {
            alert("🛠️ Profile Incomplete: Please set your WhatsApp number and Location in your Profile first so we know where to send your alerts!");
            router.push("/profile");
            return;
        }
        
        const { error } = await supabase.from("demand_signals").insert([{
            user_id: user?.id,
            crop: cropToSave,
            location: locationToSave,
            created_at: new Date().toISOString()
        }]);
        
        if (!error) {
            const msg = isFutureHarvest 
                ? `Subscription Active! We will notify you on the harvest date and whenever new ${cropToSave} is posted in ${locationToSave}.`
                : `Signal captured! We will notify you when ${cropToSave} becomes available in ${locationToSave}.`;
            alert(msg);
            setUserSubscriptions(prev => new Set(prev).add(`${cropToSave}_${locationToSave}`));
        } else if (error.code === '23505') {
            alert(`You're already on the list! We'll alert you when ${cropToSave} arrives in ${locationToSave}.`);
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
            newSubs.delete(`${crop}_${location}`);
            setUserSubscriptions(newSubs);
        }
    };

    const handleContactGuard = (e?: React.MouseEvent) => {
        if (!user) {
            if (e) e.preventDefault();
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
                        <option value="">All Locations</option>
                        {allLocations.map(loc => (
                            <option key={loc} value={loc}>{loc}</option>
                        ))}
                    </select>
                </div>
            </section>

            <div className={styles.contentWrapper}>
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
                                    <div className={styles.actionsContainer}>
                                        {item.harvest === "future" && (
                                            <div className={styles.futureHarvestActionsBadge}>
                                                ⏳ Future Harvest: {getHarvestCountdown(item.available_date)}
                                            </div>
                                        )}
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
                                        {userSubscriptions.has(`${item.crop}_${item.location}`) ? (
                                            <button 
                                                className={styles.btnUnsubscribe} 
                                                onClick={() => handleUnsubscribe(item.crop, item.location)}
                                            >
                                                🔕 Unsubscribe from {item.crop}
                                            </button>
                                        ) : (
                                            <button 
                                                className={styles.btnFollow} 
                                                onClick={() => {
                                                    if (!user) return handleContactGuard(null as any);
                                                    handleDemandCapture(item.crop, item.location, item.harvest === 'future');
                                                }}
                                            >
                                                🔔 Notify me of future {item.crop} posts
                                            </button>
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
                                    <button className={styles.demandBtn} onClick={() => handleDemandCapture()}>
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
            <Footer />
        </main>
    );
}
