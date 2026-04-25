"use client";

import { useState, useEffect } from "react";
import { supabase } from "@/lib/supabaseClient";
import { useAuth } from "../../context/AuthContext";
import { useRouter } from "next/navigation";
import styles from "./AddProduct.module.css";

/* ================= CROP MAP & SHELF-LIFE LOGIC (Phase 5) ================= */
// Shelf-life is calculated in days.
const CROP_MAP = [
    { name: "Maize", category: "Cereals", perishable: false, shelf_life: 90 },
    { name: "Corn", category: "Cereals", perishable: false, shelf_life: 90 },
    { name: "Beans", category: "Cereals", perishable: false, shelf_life: 180 },
    { name: "Rice", category: "Cereals", perishable: false, shelf_life: 365 },
    { name: "Irish Potatoes", category: "Tubers", perishable: false, shelf_life: 30 },
    { name: "Cassava", category: "Tubers", perishable: false, shelf_life: 14 },
    { name: "Tomatoes", category: "Vegetables", perishable: true, shelf_life: 7 },
    { name: "Cabbage", category: "Vegetables", perishable: true, shelf_life: 10 },
    { name: "Onions", category: "Vegetables", perishable: true, shelf_life: 30 },
    { name: "Plantains", category: "Fruits", perishable: true, shelf_life: 14 },
    { name: "Bananas", category: "Fruits", perishable: true, shelf_life: 7 },
    { name: "Cocoa", category: "Cash Crops", perishable: false, shelf_life: 365 },
];

/* ================= COMPONENT ================= */
export default function AddProductPage() {
    const { user } = useAuth();
    const router = useRouter();

    const [profile, setProfile] = useState<any>(null);
    const [loading, setLoading] = useState(false);

    /* FORM */
    const [form, setForm] = useState({
        crop: "",
        category: "",
        price: "",
        unit: "Bag",
        quantity: "",
        description: "",
        harvest: "ready",
        available_date: "",
        is_perishable: false,
        shelf_life: 0,
    });

    const [manualMode, setManualMode] = useState(false);
    
    // Image Upload State
    const [imageFile, setImageFile] = useState<File | null>(null);
    const [imagePreview, setImagePreview] = useState<string | null>(null);
    
    // Price Intelligence States
    const [priceInsight, setPriceInsight] = useState<{min: number, avg: number, max: number} | null>(null);
    const [isPioneer, setIsPioneer] = useState(false);
    const [guidanceState, setGuidanceState] = useState<'none' | 'red' | 'green' | 'yellow'>('none');
    const [guidanceMsg, setGuidanceMsg] = useState("");

    /* ================= 1. THE TRIGGER: SPATIAL CONTEXT ================= */
    useEffect(() => {
        if (!user) return;
        const fetchProfile = async () => {
            const { data } = await supabase.from("profiles").select("location, whatsapp").eq("id", user.id).single();
            setProfile(data);
        };
        fetchProfile();
    }, [user]);

    /* ================= INPUT HANDLING & GUIDANCE GUARD ================= */
    const handleChange = (e: any) => {
        const { name, value } = e.target;
        setForm({ ...form, [name]: value });

        /* ===== 2. THE SELECTION: HYBRID CROP LOGIC ===== */
        if (name === "crop") {
            const found = CROP_MAP.find((c) => c.name.toLowerCase() === value.toLowerCase());
            if (found) {
                setManualMode(false);
                setForm((prev) => ({ 
                    ...prev, 
                    crop: value, 
                    category: found.category, 
                    is_perishable: found.perishable,
                    shelf_life: found.shelf_life
                }));
            } else {
                setManualMode(true);
                // Default shelf-life if manual
                setForm((prev) => ({ ...prev, crop: value, shelf_life: 7 })); 
            }
        }
        
        // 4. THE REAL-TIME GUIDANCE UI (Red/Green/Yellow)
        if (name === "price" && priceInsight) {
            const numPrice = Number(value);
            if (!value) {
                setGuidanceState('none');
                setGuidanceMsg("");
                return;
            }

            if (numPrice < priceInsight.min) {
                setGuidanceState('red');
                setGuidanceMsg("Caution: You are pricing below the local minimum. Ensure you aren't being undervalued!");
            } else if (numPrice > priceInsight.max) {
                setGuidanceState('yellow');
                setGuidanceMsg("Premium Pricing: You are above the neighborhood max. High quality or rare variety expected.");
            } else {
                setGuidanceState('green');
                setGuidanceMsg(`Great! Your price is competitive for the ${profile?.location} neighborhood.`);
            }
        }
    };

    const handleImageChange = (e: any) => {
        const file = e.target.files?.[0];
        if (file) {
            setImageFile(file);
            setImagePreview(URL.createObjectURL(file));
        }
    };

    /* ================= 3. THE PRICE INTELLIGENCE CALCULATION ================= */
    useEffect(() => {
        if (!form.crop || !form.unit || !profile?.location) return;

        const fetchPrices = async () => {
            // Query last 10-20 verified sales in user's specific neighborhood
            const { data } = await supabase
                .from("products")
                .select("price")
                .eq("crop", form.crop)
                .eq("unit", form.unit)
                .eq("location", profile.location)
                .order("created_at", { ascending: false })
                .limit(20);

            if (data && data.length > 0) {
                setIsPioneer(false);
                const prices = data.map((p: any) => Number(p.price));
                const min = Math.min(...prices);
                const max = Math.max(...prices);
                const avg = prices.reduce((a, b) => a + b, 0) / prices.length;
                setPriceInsight({ min, max, avg });
                
                // Trigger guidance check immediately if price is already set
                if (form.price) {
                    const numPrice = Number(form.price);
                    if (numPrice < min) {
                        setGuidanceState('red');
                        setGuidanceMsg("Caution: You are pricing below the local minimum. Ensure you aren't being undervalued!");
                    } else if (numPrice > max) {
                        setGuidanceState('yellow');
                        setGuidanceMsg("Premium Pricing: You are above the neighborhood max. High quality or rare variety expected.");
                    } else {
                        setGuidanceState('green');
                        setGuidanceMsg(`Great! Your price is competitive for the ${profile.location} neighborhood.`);
                    }
                }
            } else {
                setPriceInsight(null);
                setGuidanceState('none');
                setIsPioneer(true);
            }
        };

        // Debounce slightly to avoid aggressive querying
        const timeoutId = setTimeout(() => fetchPrices(), 500);
        return () => clearTimeout(timeoutId);
    }, [form.crop, form.unit, profile]);

    /* ================= 6. THE FINAL "PUSH" (MATCHMAKING) ================= */
    const handleSubmit = async (e: any) => {
        e.preventDefault();
        if (!user || !profile?.location) {
            alert("Set your location in your profile first to access the localized market.");
            return;
        }
        setLoading(true);

        const baseDate = form.harvest === "ready" ? new Date() : new Date(form.available_date);
        
        let imageUrl = null;

        if (imageFile) {
            const fileExt = imageFile.name.split('.').pop();
            const fileName = `${user.id}-${Date.now()}.${fileExt}`;
            const { error: uploadError } = await supabase.storage
                .from('products')
                .upload(fileName, imageFile);

            if (uploadError) {
                console.error("Image upload error:", uploadError);
                alert("Error uploading image. Proceeding without image.");
            } else {
                const { data } = supabase.storage.from('products').getPublicUrl(fileName);
                imageUrl = data.publicUrl;
            }
        }

        const { data: newProduct, error } = await supabase.from("products").insert([
            {
                user_id: user.id,
                crop: form.crop,
                category: form.category,
                price: form.price,
                unit: form.unit,
                quantity: form.quantity,
                description: form.description,
                harvest: form.harvest,
                available_date: baseDate,
                is_perishable: form.is_perishable,
                location: profile.location,
                image_url: imageUrl,
                created_at: new Date().toISOString(),
            },
        ]).select();

        if (error) {
            setLoading(false);
            console.log(error);
            alert("Error adding product");
            return;
        }

        /* ================= 7. INTELLIGENCE ENGINE: MATCHING ================= */
        try {
            // Find buyers interested in this crop + location
            const { data: matches } = await supabase
                .from("demand_signals")
                .select("user_id")
                .eq("crop", form.crop)
                .eq("location", profile.location);

            if (matches && matches.length > 0) {
                const uniqueBuyers = Array.from(new Set(matches.map(m => m.user_id)));
                const productId = newProduct?.[0]?.id;
                
                // Create notifications for each unique buyer
                const notificationPayloads = uniqueBuyers.map(buyerId => ({
                    user_id: buyerId,
                    title: "💎 Fresh Match Found!",
                    message: `Great news! ${form.quantity} ${form.unit}(s) of ${form.crop} just arrived in ${profile.location}.`,
                    link: productId ? `/home?highlight=${productId}` : `/home?search=${form.crop}`,
                    type: "match"
                }));

                await supabase.from("notifications").insert(notificationPayloads);
                console.log(`[Intelligence] Notified ${uniqueBuyers.length} buyers about ${form.crop}`);
            }
        } catch (matchError) {
            console.error("Match Engine Error:", matchError);
        }
        
        alert(`Listing Published! We've notified any buyers waiting for ${form.crop} in ${profile.location}.`);
        setLoading(false);
        router.push("/home");
    };

    /* ================= UI ================= */
    return (
        <div className={styles.container}>
            <div className={styles.card}>
                <h1 className={styles.title}>Add Product</h1>

                <form className={styles.form} onSubmit={handleSubmit}>
                    {/* 2. HYBRID CROP LOGIC */}
                    <div className={styles.formGroup}>
                        <label>Crop Name</label>
                        <input 
                            name="crop" 
                            type="text"
                            placeholder="Type crop name (e.g. Maize, Beans...)" 
                            value={form.crop} 
                            onChange={handleChange} 
                            required 
                        />
                    </div>
                    
                    {manualMode && form.crop && (
                        <div className={styles.customCropHint}>
                            ✨ <strong>Custom Crop Detected:</strong> You are adding a crop not currently in our catalog. Please specify its category below.
                        </div>
                    )}

                    <div className={styles.formGroup}>
                        <label>Crop Category</label>
                        <select name="category" value={form.category} onChange={handleChange} required>
                            <option value="">Select Category</option>
                            <option>Cereals</option>
                            <option>Tubers</option>
                            <option>Vegetables</option>
                            <option>Fruits</option>
                            <option>Livestock</option>
                            <option>Cash Crops</option>
                            <option>Others</option>
                        </select>
                    </div>

                    {/* MANUAL FIELDS */}
                    {manualMode && (
                        <div className={styles.manualFields}>
                            <label className={styles.checkboxLabel}>
                                <input type="checkbox" checked={form.is_perishable} onChange={(e) => setForm({ ...form, is_perishable: e.target.checked })} />
                                <span>Perishable Crop</span>
                            </label>
                        </div>
                    )}

                    {/* IMAGE UPLOAD */}
                    <div className={styles.imageUploadBox}>
                        <label className={styles.imageLabel}>
                            {imagePreview ? (
                                <img src={imagePreview} alt="Preview" className={styles.imagePreview} />
                            ) : (
                                <div className={styles.imagePlaceholder}>
                                    <span className={styles.placeholderIcon}>📸</span>
                                    <span className={styles.placeholderText}>Upload Product Image</span>
                                    <small>Optional but recommended for faster sales</small>
                                </div>
                            )}
                            <input type="file" accept="image/*" onChange={handleImageChange} className={styles.hiddenInput} />
                        </label>
                    </div>

                    {/* QUANTITY & UNIT */}
                    <div className={styles.row}>
                        <input name="quantity" type="number" placeholder="Quantity" onChange={handleChange} required className={styles.flex2} />
                        <select name="unit" value={form.unit} onChange={handleChange} className={styles.flex1}>
                            <option>Bag</option>
                            <option>Bucket</option>
                            <option>Crate</option>
                            <option>Kg</option>
                        </select>
                    </div>

                    {/* THE PIONEER STATE */}
                    {isPioneer && form.crop && (
                        <div className={styles.pioneerState}>
                            🚀 <strong>Pioneer Alert:</strong> You are the first to price this crop in this neighborhood! You are setting the market pulse.
                        </div>
                    )}

                    {/* 3. PRICE INTELLIGENCE CALCULATION */}
                    {priceInsight && !isPioneer && (
                        <div className={styles.intelBox}>
                            <div className={styles.intelHeader}>Market Pulse ({profile?.location})</div>
                            <div className={styles.intelGrid}>
                                <div className={styles.intelStat}><span>Min (Quick Sale)</span><strong>{priceInsight.min.toLocaleString()}</strong></div>
                                <div className={styles.intelStatAvg}><span>Avg (Fair Market)</span><strong>{priceInsight.avg.toFixed(0).toLocaleString()}</strong></div>
                                <div className={styles.intelStat}><span>Max (Premium)</span><strong>{priceInsight.max.toLocaleString()}</strong></div>
                            </div>
                        </div>
                    )}

                    {/* 4. REAL-TIME GUIDANCE UI */}
                    <div className={styles.priceInputWrapper}>
                        <input
                            name="price"
                            type="number"
                            placeholder={`Your Price per ${form.unit} (FCFA)`}
                            value={form.price}
                            onChange={handleChange}
                            required
                            className={`${styles.priceInput} ${styles[`input_${guidanceState}`]}`}
                        />
                    </div>

                    {/* GUIDANCE MESSAGE */}
                    {guidanceState !== 'none' && (
                        <div className={`${styles.guidanceAlert} ${styles[`alert_${guidanceState}`]}`}>
                            {guidanceMsg}
                        </div>
                    )}

                    {/* 5. TEMPORAL SIGNALING */}
                    <div className={styles.radioGroup}>
                        <label><input type="radio" name="harvest" value="ready" checked={form.harvest === "ready"} onChange={handleChange} /> Ready Now</label>
                        <label><input type="radio" name="harvest" value="future" checked={form.harvest === "future"} onChange={handleChange} /> Future Harvest Date</label>
                    </div>

                    {form.harvest === "future" && (
                        <input type="date" name="available_date" value={form.available_date} onChange={handleChange} required />
                    )}

                    {/* DESCRIPTION */}
                    <textarea name="description" placeholder="Describe quality, strain, or logistics..." value={form.description} onChange={handleChange} />

                    <button className={styles.button} type="submit" disabled={loading}>
                        {loading ? "Matching with Buyers..." : "Publish & Alert Buyers"}
                    </button>
                </form>
            </div>
        </div>
    );
}