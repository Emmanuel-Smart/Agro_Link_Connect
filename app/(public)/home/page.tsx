"use client";

import { useEffect, useState } from "react";
import { supabase } from "@/lib/supabaseClient";
import { useAuth } from "../../context/AuthContext";
import { useRouter } from "next/navigation";
import styles from "./Home.module.css";
import Link from "next/link";
import Footer from "../../components/Footer/Footer";
import { 
    Search, 
    Sprout, 
    CircleDot, 
    Leaf, 
    Apple, 
    Egg, 
    Package, 
    MapPin, 
    Clock, 
    MessageCircle, 
    BellOff, 
    Bell, 
    Globe,
    ShieldCheck,
    Lock,
    CheckCircle2,
    Calendar,
    RefreshCw,
    SlidersHorizontal,
    X,
    Tag
} from "lucide-react";

// Removed formatTimeAgo in favor of explicit date/time rendering

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
    const PAGE_SIZE = 50;

    // Category Expand State
    const [expandedCategories, setExpandedCategories] = useState<Record<string, boolean>>({});
    const [isMobile, setIsMobile] = useState(false);
    const [modalState, setModalState] = useState<{show: boolean, type: 'auth' | 'success' | 'error', message: string}>({show: false, type: 'auth', message: ''});
    
    // Mobile Overhaul States
    const [showMobileFilters, setShowMobileFilters] = useState(false);
    const [selectedDiagnostic, setSelectedDiagnostic] = useState<{text: string, title: string, score: number, status: string} | null>(null);

    useEffect(() => {
        const checkMobile = () => setIsMobile(window.innerWidth <= 768);
        checkMobile(); // Check on mount
        window.addEventListener('resize', checkMobile);
        return () => window.removeEventListener('resize', checkMobile);
    }, []);

    const toggleCategory = (catName: string) => {
        setExpandedCategories(prev => ({
            ...prev,
            [catName]: !prev[catName]
        }));
    };

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

    // Auto-update products that are currently evaluating AI Quality
    useEffect(() => {
        const evaluatingProducts = products.filter(p => p.calculated_quality_score === null || p.calculated_quality_score === undefined);
        if (evaluatingProducts.length === 0) return;

        const intervalId = setInterval(async () => {
            const { data } = await supabase
                .from('products')
                .select('*')
                .in('id', evaluatingProducts.map(p => p.id));
            
            if (data && data.length > 0) {
                let hasUpdates = false;
                const newProducts = products.map(p => {
                    const updatedP = data.find(newP => newP.id === p.id);
                    if (updatedP && updatedP.calculated_quality_score !== null) {
                        hasUpdates = true;
                        return { ...p, ...updatedP };
                    }
                    return p;
                });
                
                if (hasUpdates) {
                    setProducts(newProducts);
                }
            }
        }, 3000);

        return () => clearInterval(intervalId);
    }, [products]);

    const handleDemandCapture = async (cropParam?: string, locationParam?: string, isFutureHarvest = false) => {
        const cropToSave = cropParam || debouncedSearch;
        const locationToSave = locationParam || location || profile?.location || "Unknown";

        if (!cropToSave) return;

        // PROFILE CHECK: Must have phone/whatsapp and location for alerts to work
        if (!profile?.whatsapp || !profile?.location) {
            setModalState({ show: true, type: 'error', message: "Profile Incomplete: Please set your WhatsApp number and Location in your Profile first so we know where to send your alerts!" });
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
            setModalState({ show: true, type: 'success', message: msg });
            setUserSubscriptions(prev => new Set(prev).add(`${cropToSave}_${locationToSave}`));
        } else if (error.code === '23505') {
            setModalState({ show: true, type: 'success', message: `You're already on the list! We'll alert you when ${cropToSave} arrives in ${locationToSave}.` });
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
            newSubs.delete(`${crop}_${location}`);
            setUserSubscriptions(newSubs);
        }
    };

    const handleContactGuard = (e?: React.MouseEvent) => {
        if (!user) {
            if (e) e.preventDefault();
            setModalState({ show: true, type: 'auth', message: 'Join AgroLink to contact farmers, view detailed market intelligence, and get real-time quality diagnostics.' });
        }
    };

    if (initialLoading) return <div className={styles.loading}>Loading Regional Marketplace...</div>;

    // --- Grouping and Sorting Logic ---
    const groupedProducts = products.reduce((acc, product) => {
        const cat = product.category || "Others";
        if (!acc[cat]) acc[cat] = [];
        acc[cat].push(product);
        return acc;
    }, {} as Record<string, any[]>);

    // Maintain original chronological order (which is by created_at desc from Supabase)

    const categoryIcons: Record<string, any> = {
        "Tubers": CircleDot,
        "Cereals": Sprout,
        "Vegetables": Leaf,
        "Fruits": Apple,
        "Livestock": Egg,
        "Cash Crops": Tag,
        "Others": Package
    };

    const sortedCategories = (Object.entries(groupedProducts) as [string, any[]][]).sort(([_catA, itemsA], [_catB, itemsB]) => {
        const arrA = itemsA as any[];
        const arrB = itemsB as any[];
        
        // Sort categories by the created_at of their newest item (the first item, since they are ordered desc)
        const dateA = new Date(arrA[0]?.created_at || 0).getTime();
        const dateB = new Date(arrB[0]?.created_at || 0).getTime();
        return dateB - dateA;
    });
    // ----------------------------------

    return (
        <main className={styles.container}>
            {/* HERO */}
            <section className={styles.hero}>
                <div className={styles.heroContent}>
                    <div className={styles.heroBadge} style={{ display: "inline-flex", alignItems: "center", gap: "6px" }}>
                        <Globe size={14} /> Live Regional Marketplace
                    </div>
                    <h1>Discover Fresh Crops <span>Near You</span></h1>
                    <p>Transparent local trading, direct from the source. Real prices. Real farmers.</p>
                </div>
            </section>

            <section className={styles.discoveryBar}>
                <div className={styles.searchGroup}>
                    <span className={styles.searchIcon} style={{ display: "flex", alignItems: "center" }}><Search size={16} /></span>
                    <input 
                        type="text" 
                        placeholder="Search crops, farmers..." 
                        className={styles.searchInput}
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                    />
                    {isMobile && (
                        <button className={styles.mobileFilterBtn} onClick={() => setShowMobileFilters(true)}>
                            <SlidersHorizontal size={18} />
                        </button>
                    )}
                </div>
                <div className={`${styles.filterGroup} ${isMobile ? styles.hiddenMobile : ''}`}>
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
                    
                    {sortedCategories.map(([categoryName, categoryProducts]) => {
                        const isExpanded = expandedCategories[categoryName];
                        const limit = isMobile ? 4 : 8;
                        const visibleProducts = isExpanded ? categoryProducts : categoryProducts.slice(0, limit);
                        const hasMoreLocal = categoryProducts.length > limit;

                        return (
                            <div key={categoryName} className={styles.categorySection}>
                                <h3 className={styles.categoryTitle} style={{ display: "flex", alignItems: "center", gap: "8px" }}>
                                    {(() => {
                                        const Icon = categoryIcons[categoryName] || Package;
                                        return <Icon size={20} style={{ color: "#22c55e" }} />;
                                    })()}
                                    {categoryName}
                                </h3>
                                <div className={styles.grid}>
                                    {visibleProducts.map(item => {
                                    const pulseKey = `${item.crop}_${item.location}_${item.unit}`;
                                    const pulse = marketPulse[pulseKey];
                                    
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
                                                <span className={styles.locationBadge} style={{ display: "inline-flex", alignItems: "center", gap: "4px" }}>
                                                    <MapPin size={12} /> {item.location}
                                                </span>
                                            </div>

                                            <h3>{item.crop}</h3>
                                            
                                            <div className={styles.priceRow} style={{ display: "inline-flex", alignItems: "center", gap: "4px" }}>
                                                <Tag size={14} style={{ color: "#4ade80" }} /> <strong>{Number(item.price).toLocaleString()} FCFA</strong> / {item.unit}
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

                                            {/* Geo-Environmental Quality Engine Trust Badge */}
                                            {item.calculated_quality_score !== null && item.calculated_quality_score !== undefined ? (
                                                <div 
                                                    className={`${styles.trustBadgeContainer} ${
                                                        item.calculated_quality_score >= 90 ? styles.badgeEmerald :
                                                        item.calculated_quality_score >= 70 ? styles.badgeOcean :
                                                        item.calculated_quality_score >= 40 ? styles.badgeAmber :
                                                        styles.badgeCrimson
                                                    }`}
                                                    onClick={() => {
                                                        if (isMobile && item.quality_diagnostic_text) {
                                                            setSelectedDiagnostic({
                                                                text: item.quality_diagnostic_text,
                                                                title: item.crop,
                                                                score: item.calculated_quality_score,
                                                                status: item.quality_status_badge
                                                            });
                                                        }
                                                    }}
                                                >
                                                    <div className={styles.trustBadgeHeader}>
                                                        <ShieldCheck size={16} />
                                                        <span>Quality: {item.calculated_quality_score}% [{item.quality_status_badge}]</span>
                                                    </div>
                                                </div>
                                            ) : (
                                                <div className={`${styles.trustBadgeContainer} ${styles.badgeUpdating}`}>
                                                    <div className={styles.trustBadgeHeader} style={{ justifyContent: 'center' }}>
                                                        <RefreshCw size={16} className={styles.spinIcon} style={{ color: '#64748b' }} />
                                                        <span style={{ color: '#475569', fontWeight: 600 }}>Evaluating AI Quality...</span>
                                                    </div>
                                                </div>
                                            )}

                                            <div className={styles.details} style={{ marginTop: '8px', marginInline: '16px', padding: '10px 12px', background: '#f8fafc', borderRadius: '10px', border: '1px solid #e2e8f0', flex: 'none' }}>
                                                <div className={styles.meta} style={{ display: "flex", justifyContent: "space-between", alignItems: "center", width: "100%", color: "#64748b", fontSize: "0.75rem", fontWeight: 700 }}>
                                                    <span style={{ display: "inline-flex", alignItems: "center", gap: "4px" }}><Package size={12} style={{color: '#94a3b8'}}/> {item.quantity}</span>
                                                    <span style={{ display: "inline-flex", alignItems: "center", gap: "4px" }}><Calendar size={12} style={{color: '#94a3b8'}}/> {new Date(item.created_at).toLocaleDateString()}</span>
                                                    <span style={{ display: "inline-flex", alignItems: "center", gap: "4px" }}><Clock size={12} style={{color: '#94a3b8'}}/> {new Date(item.created_at).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</span>
                                                </div>
                                            </div>

                                            {/* Phase 5: Direct P2P Closing */}
                                            <div className={styles.actionsContainer}>
                                                {item.harvest === "future" && (
                                                    <div className={styles.futureHarvestActionsBadge} style={{ display: "inline-flex", alignItems: "center", gap: "6px" }}>
                                                        <Clock size={12} /> Future Harvest: {getHarvestCountdown(item.available_date)}
                                                    </div>
                                                )}
                                                <div className={styles.actions}>
                                                    {item.profiles?.whatsapp && (
                                                        <a onClick={handleContactGuard} href={`https://wa.me/${item.profiles.whatsapp}`} target="_blank" className={styles.btnWhatsapp} style={{ display: "inline-flex", alignItems: "center", gap: "6px" }}>
                                                            <MessageCircle size={14} /> WhatsApp
                                                        </a>
                                                    )}
                                                    {item.id ? (
                                                        <Link href={`/product/${item.id}`} className={styles.btnCall} style={{ display: "inline-flex", alignItems: "center", gap: "6px" }}>
                                                            <Search size={14} /> View Details
                                                        </Link>
                                                    ) : null}
                                                </div>
                                                {userSubscriptions.has(`${item.crop}_${item.location}`) ? (
                                                    <button 
                                                        className={styles.btnUnsubscribe} 
                                                        onClick={() => handleUnsubscribe(item.crop, item.location)}
                                                        style={{ display: "inline-flex", alignItems: "center", justifyContent: "center", gap: "6px" }}
                                                    >
                                                        <BellOff size={12} /> Unsubscribe from {item.crop}
                                                    </button>
                                                ) : (
                                                    <button 
                                                        className={styles.btnFollow} 
                                                        onClick={() => {
                                                            if (!user) return handleContactGuard(null as any);
                                                            handleDemandCapture(item.crop, item.location, item.harvest === 'future');
                                                        }}
                                                        style={{ display: "inline-flex", alignItems: "center", justifyContent: "center", gap: "6px" }}
                                                    >
                                                        <Bell size={12} /> Notify me of future {item.crop} posts
                                                    </button>
                                                )}
                                        </div>
                                    </div>
                                    );
                                })}
                            </div>

                            {hasMoreLocal && (
                                <div className={styles.categoryActions}>
                                    <button 
                                        className={styles.btnShowMoreCategory} 
                                        onClick={() => toggleCategory(categoryName)}
                                    >
                                        {isExpanded ? "Show Less" : `Show All ${categoryProducts.length} ${categoryName}`}
                                    </button>
                                </div>
                            )}
                            </div>
                        );
                    })}

                        {products.length === 0 && !loading && (
                            <div className={styles.emptyState}>
                                <span className={styles.emptyIcon} style={{ display: "flex", justifyContent: "center" }}><Sprout size={48} style={{ color: "#94a3b8" }} /></span>
                                <h3>No matching crops found</h3>
                                <p>We couldn't find any results for "{debouncedSearch}" in this region.</p>
                                {debouncedSearch && (
                                    <button className={styles.demandBtn} onClick={() => handleDemandCapture()}>
                                        Notify me when "{debouncedSearch}" is available
                                    </button>
                                )}
                            </div>
                        )}
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
            {/* Mobile Bottom Sheets */}
            {/* Filter Drawer */}
            {isMobile && showMobileFilters && (
                <>
                    <div className={styles.bottomSheetOverlay} onClick={() => setShowMobileFilters(false)} />
                    <div className={styles.bottomSheet}>
                        <div className={styles.sheetHeader}>
                            <h3>Marketplace Filters</h3>
                            <button className={styles.closeBtn} onClick={() => setShowMobileFilters(false)}>
                                <X size={24} />
                            </button>
                        </div>
                        <div className={styles.sheetBody}>
                            <div className={styles.formGroup}>
                                <label>Category</label>
                                <select className={styles.filterSelectMobile} value={category} onChange={(e) => setCategory(e.target.value)}>
                                    <option value="">All Categories</option>
                                    <option>Tubers</option>
                                    <option>Cereals</option>
                                    <option>Vegetables</option>
                                    <option>Fruits</option>
                                    <option>Livestock</option>
                                    <option>Cash Crops</option>
                                    <option>Others</option>
                                </select>
                            </div>
                            <div className={styles.formGroup}>
                                <label>Location</label>
                                <select className={styles.filterSelectMobile} value={location} onChange={(e) => setLocation(e.target.value)}>
                                    <option value="">All Locations</option>
                                    {allLocations.map(loc => (
                                        <option key={loc} value={loc}>{loc}</option>
                                    ))}
                                </select>
                            </div>
                            <button className={styles.applyFiltersBtn} onClick={() => setShowMobileFilters(false)}>
                                Apply Filters
                            </button>
                        </div>
                    </div>
                </>
            )}

            {/* Diagnostic Drawer */}
            {isMobile && selectedDiagnostic && (
                <>
                    <div className={styles.bottomSheetOverlay} onClick={() => setSelectedDiagnostic(null)} />
                    <div className={styles.bottomSheet}>
                        <div className={styles.sheetHeader}>
                            <h3>Quality Diagnosis</h3>
                            <button className={styles.closeBtn} onClick={() => setSelectedDiagnostic(null)}>
                                <X size={24} />
                            </button>
                        </div>
                        <div className={styles.sheetBody}>
                            <div className={styles.diagHeader}>
                                <ShieldCheck size={32} style={{ color: selectedDiagnostic.score >= 90 ? '#10b981' : selectedDiagnostic.score >= 70 ? '#2563eb' : selectedDiagnostic.score >= 40 ? '#f59e0b' : '#ef4444' }} />
                                <div>
                                    <h4 style={{ margin: 0, fontSize: '1.2rem', color: '#0f172a' }}>{selectedDiagnostic.title}</h4>
                                    <span style={{ fontSize: '0.9rem', color: '#64748b', fontWeight: 600 }}>Score: {selectedDiagnostic.score}% [{selectedDiagnostic.status}]</span>
                                </div>
                            </div>
                            <div className={styles.diagContent}>
                                <p>{selectedDiagnostic.text}</p>
                            </div>
                            <button className={styles.applyFiltersBtn} onClick={() => setSelectedDiagnostic(null)}>
                                Got it
                            </button>
                        </div>
                    </div>
                </>
            )}

        </main>
    );
}
