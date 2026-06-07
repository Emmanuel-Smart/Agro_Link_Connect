"use client";

import { useEffect, useState, FormEvent } from "react";
import { supabase } from "@/lib/supabaseClient";
import { useAuth } from "../../context/AuthContext";
import { useRouter } from "next/navigation";
import Link from "next/link";
import styles from "./Profile.module.css";
import { 
    Sprout, 
    ShoppingCart, 
    ShieldAlert, 
    ShieldCheck,
    MapPin, 
    Clock, 
    Edit, 
    Trash2, 
    MessageCircle, 
    Phone, 
    Search, 
    Package,
    Egg,
    Leaf,
    Apple,
    CircleDot,
    Calendar,
    Tag
} from "lucide-react";

// Removed formatExactDate in favor of inline explicit rendering

const getCountdown = (targetDate: string) => {
    if (!targetDate) return null;
    const target = new Date(targetDate);
    const now = new Date();
    const diffMs = target.getTime() - now.getTime();
    
    if (diffMs <= 0) return "AVAILABLE NOW";
    
    const diffDays = Math.floor(diffMs / (1000 * 60 * 60 * 24));
    const diffHours = Math.floor((diffMs % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
    
    if (diffDays > 0) return `${diffDays}d ${diffHours}h left`;
    return `${diffHours}h left`;
};

export default function ProfilePage() {
    const { user } = useAuth();
    const router = useRouter();

    const [profile, setProfile] = useState<any>(null);
    const [products, setProducts] = useState<any[]>([]);
    const [marketPulse, setMarketPulse] = useState<Record<string, {min: number, avg: number, max: number}>>({});
    const [loading, setLoading] = useState(true);
    const [isEditingProfile, setIsEditingProfile] = useState(false);
    const [avatarUrl, setAvatarUrl] = useState<string | null>(null);
    const [preview, setPreview] = useState<string | null>(null);
    
    // Gatekeeping states
    const [isInitialized, setIsInitialized] = useState(false);
    const [geoLoading, setGeoLoading] = useState(false);

    // Profile Form
    const [formData, setFormData] = useState({
        full_name: "", phone: "", whatsapp: "", location: "",
        crops: "", bio: "", is_farmer: false, is_buyer: false, is_provider: false,
    });

    // Edit Product State - Expanded to edit everything
    const [editingProduct, setEditingProduct] = useState<any>(null);
    const [productToDelete, setProductToDelete] = useState<any>(null);
    const [editForm, setEditForm] = useState({ 
        crop: "", category: "", price: "", unit: "Bag", 
        quantity: "", description: "", harvest: "ready", 
        available_date: "", is_perishable: false 
    });

    // Category Expand State
    const [expandedCategories, setExpandedCategories] = useState<Record<string, boolean>>({});
    const [isMobile, setIsMobile] = useState(false);

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
        if (!user) return;
        const fetchData = async () => {
            setLoading(true);
            const { data: profileData } = await supabase.from("profiles").select("*").eq("id", user.id).single();
            if (profileData) {
                setProfile(profileData);
                setFormData(profileData);
                if (profileData.avatar_url) {
                    const { data } = supabase.storage.from("avatars").getPublicUrl(profileData.avatar_url);
                    setAvatarUrl(data.publicUrl);
                }
                
                // Gatekeeping check
                if (profileData.location && profileData.whatsapp && (profileData.is_farmer || profileData.is_buyer || profileData.is_provider)) {
                    setIsInitialized(true);
                }
            }
            
            // Fetch all products to calculate market pulse
            const { data: productData } = await supabase.from("products").select("*").order("created_at", { ascending: false });
            if (productData) {
                setProducts(productData.filter(p => p.user_id === user.id));

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
            
            setLoading(false);
        };
        fetchData();
    }, [user]);

    // ---------------- PROFILE ACTIONS ----------------
    const handleGetLocation = () => {
        if (!navigator.geolocation) {
            alert("Geolocation is not supported by your browser");
            return;
        }
        setGeoLoading(true);
        navigator.geolocation.getCurrentPosition(
            async (position) => {
                const { latitude, longitude } = position.coords;
                try {
                    // Deep Granularity Reverse Geocoding
                    const apiKey = process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY;
                    if (!apiKey) {
                        // Free Fallback if no API key is provided
                        const response = await fetch(`https://nominatim.openstreetmap.org/reverse?format=json&lat=${latitude}&lon=${longitude}&zoom=18&addressdetails=1`);
                        const data = await response.json();
                        const address = data.address || {};
                        const specificLocation = address.neighbourhood || address.suburb || address.village || address.hamlet || address.town || address.city || "Unknown Location";
                        setFormData(prev => ({ ...prev, location: specificLocation }));
                    } else {
                        // Google Maps API implementation
                        const response = await fetch(`https://maps.googleapis.com/maps/api/geocode/json?latlng=${latitude},${longitude}&key=${apiKey}`);
                        const data = await response.json();
                        
                        let specificLocation = "Unknown Location";
                        if (data.results && data.results.length > 0) {
                            const addressComponents = data.results[0].address_components;
                            const getComponent = (type: string) => addressComponents.find((comp: any) => comp.types.includes(type))?.long_name;

                            const neighborhood = getComponent('neighborhood');
                            const sublocality1 = getComponent('sublocality_level_1');
                            const sublocality2 = getComponent('sublocality_level_2');
                            const subvillage = getComponent('subpremise') || getComponent('administrative_area_level_3');
                            const locality = getComponent('locality');
                            
                            specificLocation = neighborhood || sublocality1 || sublocality2 || subvillage || locality || "Unknown Location";
                        }
                        setFormData(prev => ({ ...prev, location: specificLocation }));
                    }
                } catch (error) {
                    console.error("Geocoding failed:", error);
                    alert("Failed to reverse geocode. Check your connection.");
                } finally {
                    setGeoLoading(false);
                }
            },
            () => {
                alert("Unable to retrieve your location. Please allow location access.");
                setGeoLoading(false);
            },
            { enableHighAccuracy: true }
        );
    };

    const handleProfileSubmit = async (e: FormEvent) => {
        e.preventDefault();
        if (!formData.location || !formData.whatsapp || (!formData.is_farmer && !formData.is_buyer && !formData.is_provider)) {
            alert("Please complete all required fields (Location, WhatsApp, Role).");
            return;
        }
        setLoading(true);
        const { error } = await supabase.from("profiles").upsert({
            id: user?.id,
            ...formData,
            updated_at: new Date().toISOString()
        });
        if (error) {
            console.error("Profile Upsert Error:", error);
            if (error.code === '23505') {
                alert("Conflict: This Phone or WhatsApp number is already linked to another account.");
            } else {
                alert("Error updating profile. Please try again.");
            }
        } else {
            setProfile(formData);
            setIsInitialized(true);
            setIsEditingProfile(false);
        }
        setLoading(false);
    };

    // ---------------- PRODUCT CRUD ACTIONS ----------------
    const confirmDeleteListing = (product: any) => {
        setProductToDelete(product);
    };

    const executeDeleteProduct = async () => {
        if (!productToDelete) return;
        const id = productToDelete.id;
        
        const { error } = await supabase.from("products").delete().eq("id", id);
        if (!error) {
            setProducts(products.filter(p => p.id !== id));
            setProductToDelete(null);
        } else {
            alert("Error deleting product.");
        }
    };

    const openEditModal = (product: any) => {
        setEditingProduct(product);
        setEditForm({ 
            crop: product.crop, 
            category: product.category, 
            price: product.price, 
            unit: product.unit,
            quantity: product.quantity, 
            description: product.description,
            harvest: product.harvest || "ready",
            available_date: product.available_date || "",
            is_perishable: product.is_perishable || false
        });
    };

    const handleEditProductSubmit = async (e: FormEvent) => {
        e.preventDefault();
        
        const baseDate = editForm.harvest === "ready" ? new Date() : new Date(editForm.available_date);
        
        const { error } = await supabase.from("products").update({
            crop: editForm.crop,
            category: editForm.category,
            price: editForm.price,
            unit: editForm.unit,
            quantity: editForm.quantity,
            description: editForm.description,
            harvest: editForm.harvest,
            available_date: baseDate,
            is_perishable: editForm.is_perishable
        }).eq("id", editingProduct.id);

        if (!error) {
            setProducts(products.map(p => p.id === editingProduct.id ? { ...p, ...editForm, available_date: baseDate } : p));
            setEditingProduct(null);
        } else {
            alert("Error updating product.");
        }
    };

    // ---------------- RENDER GATEWAY ----------------
    if (loading && !products.length) return <div className={styles.loading}>Synchronizing Identity...</div>;
    if (!user) return <p>Please login to view profile.</p>;

    if (!isInitialized) {
        return (
            <div className={styles.gateContainer}>
                <div className={styles.gateCard}>
                    <div className={styles.gateHeader}>
                        <h2>Initialize Spatial Anchor</h2>
                        <p>To prevent market fragmentation, you must verify your location and setup your P2P contact.</p>
                    </div>
                    <form onSubmit={handleProfileSubmit} className={styles.gateForm}>
                        <div className={styles.formGroup}>
                            <label>GPS Handshake</label>
                            <div className={styles.geoBox}>
                                <button type="button" onClick={handleGetLocation} disabled={geoLoading} className={`${styles.geoBtn} ${formData.location ? styles.geoBtnSuccess : ''}`}>
                                    {geoLoading ? "Acquiring Coordinates..." : formData.location ? `Verified: ${formData.location}` : "Verify Location"}
                                </button>
                            </div>
                        </div>
                        <div className={styles.formGroup}>
                            <label>Primary P2P Channel (WhatsApp)</label>
                            <input type="tel" value={formData.whatsapp || ""} onChange={e => setFormData({...formData, whatsapp: e.target.value})} required placeholder="+237..." />
                        </div>
                        <div className={styles.formGroup}>
                            <label>Alternative Phone (Calls)</label>
                            <input type="tel" value={formData.phone || ""} onChange={e => setFormData({...formData, phone: e.target.value})} placeholder="Optional: +237..." />
                        </div>
                        <div className={styles.formGroup}>
                            <label>Role Setup (Select Identity)</label>
                            <div className={styles.roleTiles}>
                                <div className={`${styles.roleTile} ${formData.is_farmer ? styles.roleTileActive : ''}`} onClick={() => setFormData({...formData, is_farmer: !formData.is_farmer})} style={{ display: "inline-flex", alignItems: "center", gap: "6px" }}><Sprout size={15} /> Farmer</div>
                                <div className={`${styles.roleTile} ${formData.is_buyer ? styles.roleTileActive : ''}`} onClick={() => setFormData({...formData, is_buyer: !formData.is_buyer})} style={{ display: "inline-flex", alignItems: "center", gap: "6px" }}><ShoppingCart size={15} /> Buyer</div>
                                <div className={`${styles.roleTile} ${formData.is_provider ? styles.roleTileActive : ''}`} onClick={() => setFormData({...formData, is_provider: !formData.is_provider})} style={{ display: "inline-flex", alignItems: "center", gap: "6px" }}><ShieldAlert size={15} /> Provider</div>
                            </div>
                        </div>
                        <button type="submit" className={styles.unlockBtn}>Unlock Dashboard</button>
                    </form>
                </div>
            </div>
        );
    }

    const groupedProducts = products.reduce((acc, product) => {
        const cat = product.category || "Others";
        if (!acc[cat]) acc[cat] = [];
        acc[cat].push(product);
        return acc;
    }, {} as Record<string, any[]>);

    const categoryIcons: Record<string, React.ComponentType<any>> = {
        "Cereals": Sprout,
        "Tubers": CircleDot,
        "Vegetables": Leaf,
        "Fruits": Apple,
        "Livestock": Egg,
        "Cash Crops": Tag,
        "Others": Package
    };

    const sortedCategories: [string, any[]][] = (Object.entries(groupedProducts) as [string, any[]][]).sort(([_catA, itemsA], [_catB, itemsB]) => {
        return itemsB.length - itemsA.length;
    });

    return (
        <div className={styles.container}>
            {/* ---------------- EDIT PRODUCT MODAL (Expanded) ---------------- */}
            {editingProduct && (
                <div className={styles.modalOverlay}>
                    <div className={styles.modalContent}>
                        <h2>Edit {editingProduct.crop}</h2>
                        <form onSubmit={handleEditProductSubmit} className={styles.modalForm}>
                            
                            <div className={styles.formRow}>
                                <div className={styles.formGroup}>
                                    <label>Crop</label>
                                    <input type="text" required value={editForm.crop} onChange={e => setEditForm({...editForm, crop: e.target.value})} />
                                </div>
                                <div className={styles.formGroup}>
                                    <label>Category</label>
                                    <select value={editForm.category} onChange={e => setEditForm({...editForm, category: e.target.value})}>
                                        <option>Cereals</option>
                                        <option>Tubers</option>
                                        <option>Vegetables</option>
                                        <option>Fruits</option>
                                        <option>Cash Crops</option>
                                        <option>Others</option>
                                    </select>
                                </div>
                            </div>

                            <div className={styles.formRow}>
                                <div className={styles.formGroup}>
                                    <label>Price</label>
                                    <input type="number" required value={editForm.price} onChange={e => setEditForm({...editForm, price: e.target.value})} />
                                </div>
                                <div className={styles.formGroup}>
                                    <label>Unit</label>
                                    <select value={editForm.unit} onChange={e => setEditForm({...editForm, unit: e.target.value})}>
                                        <option>Bag</option>
                                        <option>Bucket</option>
                                        <option>Crate</option>
                                        <option>Kg</option>
                                        <option>Others</option>
                                    </select>
                                </div>
                                <div className={styles.formGroup}>
                                    <label>Quantity</label>
                                    <input type="number" required value={editForm.quantity} onChange={e => setEditForm({...editForm, quantity: e.target.value})} />
                                </div>
                            </div>

                            <div className={styles.formGroup}>
                                <label className={styles.checkboxLabel}>
                                    <input type="checkbox" checked={editForm.is_perishable} onChange={e => setEditForm({...editForm, is_perishable: e.target.checked})} />
                                    <span>Is Perishable?</span>
                                </label>
                            </div>

                            <div className={styles.radioGroupSmall}>
                                <label><input type="radio" name="editHarvest" value="ready" checked={editForm.harvest === "ready"} onChange={e => setEditForm({...editForm, harvest: e.target.value})} /> Ready Now</label>
                                <label><input type="radio" name="editHarvest" value="future" checked={editForm.harvest === "future"} onChange={e => setEditForm({...editForm, harvest: e.target.value})} /> Future Date</label>
                            </div>

                            {editForm.harvest === "future" && (
                                <div className={styles.formGroup}>
                                    <label>Available Date</label>
                                    <input type="date" required value={editForm.available_date} onChange={e => setEditForm({...editForm, available_date: e.target.value})} />
                                </div>
                            )}

                            <div className={styles.formGroup}>
                                <label>Description</label>
                                <textarea rows={2} value={editForm.description} onChange={e => setEditForm({...editForm, description: e.target.value})} />
                            </div>

                            <div className={styles.modalActions}>
                                <button type="button" className={styles.btnCancel} onClick={() => setEditingProduct(null)}>Cancel</button>
                                <button type="submit" className={styles.btnSave}>Save Changes</button>
                            </div>
                        </form>
                    </div>
                </div>
            )}

            {/* ---------------- DELETE PRODUCT CONFIRMATION MODAL ---------------- */}
            {productToDelete && (
                <div className={styles.modalOverlay}>
                    <div className={styles.modalContent} style={{ maxWidth: '400px', textAlign: 'center' }}>
                        <div style={{ display: 'flex', justifyContent: 'center', marginBottom: '16px' }}>
                            <div style={{ background: 'rgba(239, 68, 68, 0.1)', padding: '16px', borderRadius: '50%' }}>
                                <Trash2 size={32} style={{ color: '#ef4444' }} />
                            </div>
                        </div>
                        <h2>Delete Listing</h2>
                        <p style={{ color: '#94a3b8', marginBottom: '24px', lineHeight: '1.5' }}>
                            Are you sure you want to permanently delete <strong>{productToDelete.crop}</strong>? This action cannot be undone.
                        </p>
                        <div className={styles.modalActions}>
                            <button type="button" className={styles.btnCancel} onClick={() => setProductToDelete(null)}>Cancel</button>
                            <button type="button" className={styles.btnSave} onClick={executeDeleteProduct} style={{ background: 'linear-gradient(135deg, #dc2626, #ef4444)', boxShadow: '0 4px 14px rgba(239, 68, 68, 0.3)' }}>Delete</button>
                        </div>
                    </div>
                </div>
            )}

            {/* ---------------- SIDEBAR ---------------- */}
            <aside className={styles.sidebar}>
                {profile && !isEditingProfile ? (
                    <>
                        <div className={styles.profileHeader}>
                            <label className={styles.avatarWrapper}>
                                {preview ? <img src={preview} className={styles.avatarImage} alt="Preview" /> :
                                    avatarUrl ? <img src={avatarUrl} className={styles.avatarImage} alt="Profile" /> :
                                        <div className={styles.avatarCircle}>{profile.full_name?.charAt(0)}</div>}
                                <input type="file" className={styles.fileInput} onChange={async (e) => {
                                    const file = e.target.files?.[0];
                                    if (!file || !user) return;
                                    setPreview(URL.createObjectURL(file));
                                    const path = `${user.id}-${Date.now()}`;
                                    await supabase.storage.from("avatars").upload(path, file);
                                    await supabase.from("profiles").update({ avatar_url: path }).eq("id", user.id);
                                    const { data } = supabase.storage.from("avatars").getPublicUrl(path);
                                    setAvatarUrl(data.publicUrl);
                                }} />
                            </label>
                            <h2 className={styles.profileName}>{profile.full_name}</h2>
                            <p className={styles.profileEmail}>{user?.email}</p>
                            <p className={styles.profileFarm} style={{ display: "inline-flex", alignItems: "center", gap: "6px" }}><MapPin size={14} style={{ color: "#fbbf24" }} /> {profile.location}</p>
                            <div className={styles.roles}>
                                {profile.is_farmer && <span className={styles.roleTag} style={{ display: "inline-flex", alignItems: "center", gap: "4px" }}><Sprout size={12} /> Farmer</span>}
                                {profile.is_buyer && <span className={styles.roleTag} style={{ display: "inline-flex", alignItems: "center", gap: "4px" }}><ShoppingCart size={12} /> Buyer</span>}
                                {profile.is_provider && !profile.is_approved_provider && <span className={styles.roleTagPending} style={{ display: "inline-flex", alignItems: "center", gap: "4px" }}><Clock size={12} /> Pending Provider</span>}
                                {profile.is_approved_provider && <span className={styles.roleTagAuthority} style={{ display: "inline-flex", alignItems: "center", gap: "4px" }}><ShieldCheck size={12} /> Official Provider</span>}
                            </div>
                        </div>
                        <div className={styles.actions}>
                            {profile.is_approved_provider && (
                                <button className={styles.btnDashboard} onClick={() => router.push("/provider-dashboard")} style={{ display: "inline-flex", alignItems: "center", justifyContent: "center", gap: "6px" }}><ShieldCheck size={14} /> Provider Dashboard</button>
                            )}
                            <button className={styles.btnEditProfile} onClick={() => setIsEditingProfile(true)} style={{ display: "inline-flex", alignItems: "center", justifyContent: "center", gap: "6px" }}><Edit size={14} /> Edit Profile</button>
                            {profile.whatsapp && <a href={`https://wa.me/${profile.whatsapp}`} target="_blank" className={styles.btnWa} style={{ display: "inline-flex", alignItems: "center", justifyContent: "center", gap: "6px" }}><MessageCircle size={14} /> WhatsApp</a>}
                            {profile.phone && <a href={`tel:${profile.phone}`} className={styles.btnCall} style={{ display: "inline-flex", alignItems: "center", justifyContent: "center", gap: "6px" }}><Phone size={14} /> Contact Call</a>}
                        </div>
                    </>
                ) : (
                    // PROFILE EDIT INLINE FORM
                    <div className={styles.profileEditForm}>
                        <h3>Edit Profile</h3>
                        <form onSubmit={handleProfileSubmit}>
                            <div className={styles.formGroup}>
                                <label>Full Name</label>
                                <input type="text" required value={formData.full_name || ""} onChange={e => setFormData({...formData, full_name: e.target.value})} />
                            </div>
                            <div className={styles.formGroup}>
                                <label>WhatsApp</label>
                                <input type="tel" required value={formData.whatsapp || ""} onChange={e => setFormData({...formData, whatsapp: e.target.value})} />
                            </div>
                            <div className={styles.formGroup}>
                                <label>Phone (Calls)</label>
                                <input type="tel" value={formData.phone || ""} onChange={e => setFormData({...formData, phone: e.target.value})} placeholder="+237..." />
                            </div>
                            <div className={styles.formGroup}>
                                <label>Location</label>
                                <button type="button" onClick={handleGetLocation} className={styles.geoBtnSmall} style={{ display: "inline-flex", alignItems: "center", gap: "6px" }}>
                                    {formData.location ? <><MapPin size={12} /> {formData.location} (Update)</> : "Fetch GPS"}
                                </button>
                            </div>
                            <div className={styles.formGroup}>
                                <label>Roles</label>
                                <div className={styles.roleTilesSmall}>
                                    <div className={`${styles.roleTile} ${formData.is_farmer ? styles.roleTileActive : ''}`} onClick={() => setFormData({...formData, is_farmer: !formData.is_farmer})} style={{ display: "inline-flex", alignItems: "center", gap: "4px" }}><Sprout size={13} /> Farmer</div>
                                    <div className={`${styles.roleTile} ${formData.is_buyer ? styles.roleTileActive : ''}`} onClick={() => setFormData({...formData, is_buyer: !formData.is_buyer})} style={{ display: "inline-flex", alignItems: "center", gap: "4px" }}><ShoppingCart size={13} /> Buyer</div>
                                    <div className={`${styles.roleTile} ${formData.is_provider ? styles.roleTileActive : ''}`} onClick={() => setFormData({...formData, is_provider: !formData.is_provider})} style={{ display: "inline-flex", alignItems: "center", gap: "4px" }}><ShieldCheck size={13} /> Provider</div>
                                </div>
                            </div>
                            <div className={styles.modalActions}>
                                <button type="button" className={styles.btnCancel} onClick={() => {
                                    setFormData(profile);
                                    setIsEditingProfile(false);
                                }}>Cancel</button>
                                <button type="submit" className={styles.btnSave}>Save</button>
                            </div>
                        </form>
                    </div>
                )}
            </aside>

            {/* ---------------- MAIN CONTENT ---------------- */}
            <main className={styles.main}>
                <div className={styles.header}>
                    <h1>My Listings</h1>
                    <button className={styles.addBtn} onClick={() => router.push("/add-product")}>+ Add Product</button>
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
                                    {visibleProducts.map((item) => {
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
                                    <span className={styles.categoryTag}>{item.category || "Crop"}</span>
                                    {item.harvest === "future" && (
                                        <span className={styles.futureCountdown} style={{ display: "inline-flex", alignItems: "center", gap: "4px" }}>
                                            <Clock size={11} /> READY IN: {getCountdown(item.available_date)}
                                        </span>
                                    )}
                                </div>
                                
                                <h3>{item.crop}</h3>
                                
                                <div className={styles.priceRow} style={{ display: "inline-flex", alignItems: "center", gap: "4px" }}>
                                    <Tag size={14} style={{ color: "#4ade80" }} /> 
                                    <strong>{item.price?.toLocaleString()} FCFA</strong> / {item.unit}
                                </div>

                                {/* Market Pulse (Transparency Badge) */}
                                {pulse && (
                                    <div className={styles.transparencyBadge}>
                                        <div className={styles.transTitle}>Market Pulse ({item.location})</div>
                                        <div className={styles.transStats}>
                                            <span>Min <strong>{pulse.min}</strong></span>
                                            <span>Max <strong>{pulse.max}</strong></span>
                                        </div>
                                    </div>
                                )}

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

                                <div className={styles.cardFooter} style={{ paddingTop: '10px' }}>
                                    <div style={{ padding: '12px 14px', background: '#f8fafc', borderRadius: '12px', border: '1px solid #e2e8f0', display: 'flex', justifyContent: 'space-between', alignItems: 'center', width: '100%', color: '#64748b', fontSize: '0.75rem', fontWeight: 700, marginBottom: '16px' }}>
                                        <span style={{ display: "inline-flex", alignItems: "center", gap: "4px" }}><Package size={12} style={{color: '#94a3b8'}}/> {item.quantity}</span>
                                        <span style={{ display: "inline-flex", alignItems: "center", gap: "4px" }}><Calendar size={12} style={{color: '#94a3b8'}}/> {new Date(item.created_at).toLocaleDateString()}</span>
                                        <span style={{ display: "inline-flex", alignItems: "center", gap: "4px" }}><Clock size={12} style={{color: '#94a3b8'}}/> {new Date(item.created_at).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</span>
                                    </div>
                                    
                                    {/* Direct P2P Actions */}
                                    <div className={styles.productP2PActions}>
                                        {item.id ? (
                                            <Link href={`/product/${item.id}`} className={styles.btnWaSmall} style={{ display: "inline-flex", alignItems: "center", gap: "4px" }}><Search size={11} /> View Details</Link>
                                        ) : null}
                                        {profile.whatsapp ? (
                                            <a href={`https://wa.me/${profile.whatsapp}`} target="_blank" className={styles.btnCallSmall} style={{ display: "inline-flex", alignItems: "center", gap: "4px" }}><MessageCircle size={11} /> WA</a>
                                        ) : null}
                                    </div>

                                    {/* Product CRUD Actions */}
                                    <div className={styles.productActions}>
                                        <button className={styles.btnEdit} onClick={() => openEditModal(item)} style={{ display: "inline-flex", alignItems: "center", gap: "4px" }}><Edit size={11} /> Edit</button>
                                        <button className={styles.btnDelete} onClick={() => confirmDeleteListing(item)} style={{ display: "inline-flex", alignItems: "center", gap: "4px" }}><Trash2 size={11} /> Delete</button>
                                    </div>
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
            </main>
        </div>
    );
}