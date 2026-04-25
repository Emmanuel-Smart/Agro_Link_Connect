"use client";

import { useEffect, useState, FormEvent } from "react";
import { supabase } from "@/lib/supabaseClient";
import { useAuth } from "../../context/AuthContext";
import { useRouter } from "next/navigation";
import styles from "./Profile.module.css";

// Fix Date Formatting to handle null/invalid dates
const formatExactDate = (dateString: string) => {
    if (!dateString) return "N/A";
    const date = new Date(dateString);
    if (isNaN(date.getTime())) return "N/A";
    return date.toLocaleDateString('en-US', {
        month: 'short', day: 'numeric', year: 'numeric',
        hour: 'numeric', minute: '2-digit'
    });
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
    const [editForm, setEditForm] = useState({ 
        crop: "", category: "", price: "", unit: "Bag", 
        quantity: "", description: "", harvest: "ready", 
        available_date: "", is_perishable: false 
    });

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
    const handleDeleteProduct = async (id: string) => {
        if (!confirm("Are you sure you want to permanently delete this listing?")) return;
        
        const { error } = await supabase.from("products").delete().eq("id", id);
        if (!error) {
            setProducts(products.filter(p => p.id !== id));
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
                                <div className={`${styles.roleTile} ${formData.is_farmer ? styles.roleTileActive : ''}`} onClick={() => setFormData({...formData, is_farmer: !formData.is_farmer})}>🚜 Farmer</div>
                                <div className={`${styles.roleTile} ${formData.is_buyer ? styles.roleTileActive : ''}`} onClick={() => setFormData({...formData, is_buyer: !formData.is_buyer})}>🛒 Buyer</div>
                                <div className={`${styles.roleTile} ${formData.is_provider ? styles.roleTileActive : ''}`} onClick={() => setFormData({...formData, is_provider: !formData.is_provider})}>🛡️ NGO / Provider</div>
                            </div>
                        </div>
                        <button type="submit" className={styles.unlockBtn}>Unlock Dashboard</button>
                    </form>
                </div>
            </div>
        );
    }

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
                            <p className={styles.profileEmail} style={{color: '#94a3b8', fontSize: '0.85rem', margin: '-5px 0 10px 0'}}>{user?.email}</p>
                            <p className={styles.profileFarm}>📍 {profile.location}</p>
                            <div className={styles.roles}>
                                {profile.is_farmer && <span className={styles.roleTag}>🚜 Farmer</span>}
                                {profile.is_buyer && <span className={styles.roleTag}>🛒 Buyer</span>}
                                {profile.is_provider && !profile.is_approved_provider && <span className={styles.roleTagPending}>⏳ Pending Provider</span>}
                                {profile.is_approved_provider && <span className={styles.roleTagAuthority}>🛡️ Official Provider</span>}
                            </div>
                        </div>
                        <div className={styles.actions}>
                            {profile.is_approved_provider && (
                                <button className={styles.btnDashboard} onClick={() => router.push("/provider-dashboard")}>🛡️ Provider Dashboard</button>
                            )}
                            <button className={styles.btnEditProfile} onClick={() => setIsEditingProfile(true)}>✏️ Edit Profile</button>
                            {profile.whatsapp && <a href={`https://wa.me/${profile.whatsapp}`} target="_blank" className={styles.btnWa}>💬 WhatsApp</a>}
                            {profile.phone && <a href={`tel:${profile.phone}`} className={styles.btnCall}>📞 Contact Call</a>}
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
                                <button type="button" onClick={handleGetLocation} className={styles.geoBtnSmall}>
                                    {formData.location ? `📍 ${formData.location} (Update)` : "Fetch GPS"}
                                </button>
                            </div>
                            <div className={styles.formGroup}>
                                <label>Roles</label>
                                <div className={styles.roleTilesSmall}>
                                    <div className={`${styles.roleTile} ${formData.is_farmer ? styles.roleTileActive : ''}`} onClick={() => setFormData({...formData, is_farmer: !formData.is_farmer})}>🚜 Farmer</div>
                                    <div className={`${styles.roleTile} ${formData.is_buyer ? styles.roleTileActive : ''}`} onClick={() => setFormData({...formData, is_buyer: !formData.is_buyer})}>🛒 Buyer</div>
                                    <div className={`${styles.roleTile} ${formData.is_provider ? styles.roleTileActive : ''}`} onClick={() => setFormData({...formData, is_provider: !formData.is_provider})}>🛡️ NGO / Provider</div>
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

                <div className={styles.grid}>
                    {products.map((item) => {
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
                                    {item.harvest === "future" && <span className={styles.blueprintBadge}>Future Harvest</span>}
                                </div>
                                
                                <h3>{item.crop}</h3>
                                
                                <p className={styles.priceLine}>
                                    💰 <strong>{item.price?.toLocaleString()} FCFA</strong> / {item.unit}
                                </p>

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

                                <div className={styles.cardFooter}>
                                    <div className={styles.metaRow}>
                                        <span>📦 Qty: {item.quantity}</span>
                                        <span>🕒 {formatExactDate(item.created_at)}</span>
                                    </div>
                                    
                                    {/* Direct P2P Actions */}
                                    <div className={styles.productP2PActions}>
                                        {profile.whatsapp ? (
                                            <a href={`https://wa.me/${profile.whatsapp}`} target="_blank" className={styles.btnWaSmall}>💬 WA</a>
                                        ) : null}
                                        {profile.phone ? (
                                            <a href={`tel:${profile.phone}`} className={styles.btnCallSmall}>📞 Call</a>
                                        ) : null}
                                    </div>

                                    {/* Product CRUD Actions */}
                                    <div className={styles.productActions}>
                                        <button className={styles.btnEdit} onClick={() => openEditModal(item)}>✏️ Edit</button>
                                        <button className={styles.btnDelete} onClick={() => handleDeleteProduct(item.id)}>🗑️ Delete</button>
                                    </div>
                                </div>
                            </div>
                        );
                    })}
                </div>
            </main>
        </div>
    );
}