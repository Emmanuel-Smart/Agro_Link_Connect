"use client";

import { useState, useEffect } from "react";
import { supabase } from "@/lib/supabaseClient";
import { useAuth } from "../../context/AuthContext";
import { useRouter } from "next/navigation";
import styles from "./AddProduct.module.css";
import { Sparkles, Camera, Zap, CheckCircle2, AlertCircle } from "lucide-react";

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

/* ================= 4 DOMAIN MAPPING LOGIC ================= */
const getDomainFromCategory = (category: string) => {
    const cat = category.toLowerCase();
    if (cat.includes("livestock") || cat.includes("poultry") || cat.includes("animal")) return "husbandry";
    if (cat.includes("fish") || cat.includes("aquaculture") || cat.includes("seafood")) return "aquaculture";
    if (cat.includes("others") || cat.includes("processing") || cat.includes("processed")) return "processing";
    return "horticulture"; // Default for Cereals, Tubers, Vegetables, Fruits, Cash Crops
};

/* ================= COMPONENT ================= */
export default function AddProductPage() {
    const { user } = useAuth();
    const router = useRouter();

    const [profile, setProfile] = useState<any>(null);
    const [loading, setLoading] = useState(false);
    const [loadingText, setLoadingText] = useState("Publish & Alert Buyers");

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
    
    // Mobile Wizard State
    const [step, setStep] = useState(1);
    const nextStep = () => setStep(s => Math.min(s + 1, 4));
    const prevStep = () => setStep(s => Math.max(s - 1, 1));
    
    const [isMobile, setIsMobile] = useState(false);
    useEffect(() => {
        const handleResize = () => setIsMobile(window.innerWidth <= 768);
        handleResize();
        window.addEventListener('resize', handleResize);
        return () => window.removeEventListener('resize', handleResize);
    }, []);

    // Image Upload State
    const [imageFiles, setImageFiles] = useState<File[]>([]);
    const [imagePreviews, setImagePreviews] = useState<string[]>([]);
    
    // Price Intelligence States
    const [priceInsight, setPriceInsight] = useState<{min: number, avg: number, max: number} | null>(null);
    const [isPioneer, setIsPioneer] = useState(false);
    const [guidanceState, setGuidanceState] = useState<'none' | 'red' | 'green' | 'yellow'>('none');
    const [guidanceMsg, setGuidanceMsg] = useState("");
    const [modalState, setModalState] = useState<{show: boolean, type: 'success' | 'error', message: string, onConfirm?: () => void}>({show: false, type: 'success', message: ''});

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
        const files = Array.from(e.target.files as FileList);
        if (files.length > 0) {
            const newFiles = [...imageFiles, ...files].slice(0, 5); // Max 5 images
            setImageFiles(newFiles);
            
            const newPreviews = newFiles.map(file => URL.createObjectURL(file));
            setImagePreviews(newPreviews);
        }
    };

    const removeImage = (index: number) => {
        const newFiles = imageFiles.filter((_, i) => i !== index);
        setImageFiles(newFiles);
        const newPreviews = imagePreviews.filter((_, i) => i !== index);
        setImagePreviews(newPreviews);
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
            setModalState({ show: true, type: 'error', message: "Set your location in your profile first to access the localized market." });
            return;
        }
        setLoading(true);
        setLoadingText("Publishing Product...");

        const baseDate = form.harvest === "ready" ? new Date() : new Date(form.available_date);
        
        const galleryUrls: string[] = [];

        // Upload all images
        for (const file of imageFiles) {
            const fileExt = file.name.split('.').pop();
            const fileName = `${user.id}-${Date.now()}-${Math.random().toString(36).substring(7)}.${fileExt}`;
            const { error: uploadError } = await supabase.storage
                .from('products')
                .upload(fileName, file);

            if (!uploadError) {
                const { data } = supabase.storage.from('products').getPublicUrl(fileName);
                galleryUrls.push(data.publicUrl);
            } else {
                console.error("Upload error:", uploadError);
            }
        }

        const mainImageUrl = galleryUrls.length > 0 ? galleryUrls[0] : null;

        const domain = getDomainFromCategory(form.category);

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
                image_url: mainImageUrl,
                gallery_urls: galleryUrls,
                created_at: new Date().toISOString(),
                agricultural_domain: domain,
                // Override DB defaults so we don't show 85% before AI evaluates
                calculated_quality_score: null,
                quality_status_badge: null,
                quality_diagnostic_text: null
            },
        ]).select();

        if (error) {
            setLoading(false);
            setLoadingText("Publish & Alert Buyers");
            console.log(error);
            setModalState({ show: true, type: 'error', message: "Error adding product" });
            return;
        }

        /* ================= 7. INTELLIGENCE ENGINE: MATCHING ================= */
        try {
            setLoadingText("Matching with Buyers...");
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
                    title: "Fresh Match Found!",
                    message: `Great news! ${form.quantity} ${form.unit}(s) of ${form.crop} just arrived in ${profile.location}.`,
                    link: productId ? `/home?highlight=${productId}` : `/home?search=${form.crop}`,
                    type: "match"
                }));

                await supabase.from("notifications").insert(notificationPayloads);
            }
        } catch (matchError) {
            console.error("Match Engine Error:", matchError);
        }

        /* ================= 8. DYNAMIC GEO-ENVIRONMENTAL SCORING ENGINE ================= */
        // Execute synchronously so user sees rating immediately upon redirection
        const { data: { session } } = await supabase.auth.getSession();
        const token = session?.access_token;

        const productId = newProduct?.[0]?.id;
        if (productId) {
            setLoadingText("Running AI Quality Diagnostics...");
            try {
                await fetch('/api/listings/universal-evaluate', {
                    method: 'POST',
                    headers: { 
                        'Content-Type': 'application/json',
                        'Authorization': token ? `Bearer ${token}` : ''
                    },
                    body: JSON.stringify({
                        productId: productId,
                        imageUrl: mainImageUrl,
                        cropKey: form.crop,
                        location: profile.location,
                        agricultural_domain: domain
                    })
                });
            } catch (err) {
                console.error("Universal Evaluate API failed:", err);
            }
        }
        
        setLoading(false);
        setLoadingText("Publish & Alert Buyers");
        setModalState({ 
            show: true, 
            type: 'success', 
            message: `Listing Published! We've notified any buyers waiting for ${form.crop} in ${profile.location}.`,
            onConfirm: () => router.push("/home")
        });
    };

    /* ================= UI ================= */
    return (
        <div className={styles.container}>
            <div className={styles.card}>
                {isMobile ? (
                    <>
                        <div className={styles.wizardHeader}>
                            <h1 className={styles.title}>Add Product</h1>
                            <div className={styles.progressContainer}>
                                <div className={`${styles.progressStep} ${step >= 1 ? styles.activeStep : ''}`}>1</div>
                                <div className={`${styles.progressLine} ${step >= 2 ? styles.activeLine : ''}`}></div>
                                <div className={`${styles.progressStep} ${step >= 2 ? styles.activeStep : ''}`}>2</div>
                                <div className={`${styles.progressLine} ${step >= 3 ? styles.activeLine : ''}`}></div>
                                <div className={`${styles.progressStep} ${step >= 3 ? styles.activeStep : ''}`}>3</div>
                                <div className={`${styles.progressLine} ${step >= 4 ? styles.activeLine : ''}`}></div>
                                <div className={`${styles.progressStep} ${step >= 4 ? styles.activeStep : ''}`}>4</div>
                            </div>
                        </div>

                        <form className={styles.form} onSubmit={handleSubmit}>
                            {/* STEP 1: DOMAIN SELECTION */}
                            {step === 1 && (
                                <div className={styles.wizardStep}>
                                    <h2 className={styles.stepTitle}>Step 1: Classification</h2>
                                    <div className={styles.formGroup}>
                                        <label>Crop / Asset Name</label>
                                        <input 
                                            name="crop" 
                                            type="text"
                                            placeholder="e.g. Maize, Catfish, Tomatoes..." 
                                            value={form.crop} 
                                            onChange={handleChange} 
                                            required 
                                        />
                                    </div>
                                    
                                    {manualMode && form.crop && (
                                        <div className={styles.customCropHint}>
                                            <Sparkles size={16} style={{ color: "#fbbf24" }} /> <strong>Custom Asset:</strong> Please specify its category.
                                        </div>
                                    )}

                                    <div className={styles.formGroup}>
                                        <label>Agricultural Domain</label>
                                        <select name="category" value={form.category} onChange={handleChange} required className={styles.largeSelect}>
                                            <option value="">Select Domain Category</option>
                                            <option>Cereals</option>
                                            <option>Tubers</option>
                                            <option>Vegetables</option>
                                            <option>Fruits</option>
                                            <option>Livestock</option>
                                            <option>Aquaculture</option>
                                            <option>Cash Crops</option>
                                            <option>Others</option>
                                        </select>
                                    </div>

                                    {manualMode && (
                                        <div className={styles.manualFields}>
                                            <label className={styles.checkboxLabel}>
                                                <input type="checkbox" checked={form.is_perishable} onChange={(e) => setForm({ ...form, is_perishable: e.target.checked })} />
                                                <span>Highly Perishable?</span>
                                            </label>
                                        </div>
                                    )}

                                    <button type="button" className={styles.nextBtn} onClick={nextStep} disabled={!form.crop || !form.category}>
                                        Next Step
                                    </button>
                                </div>
                            )}

                            {/* STEP 2: GEO-LOCATION */}
                            {step === 2 && (
                                <div className={styles.wizardStep}>
                                    <h2 className={styles.stepTitle}>Step 2: Geo-Location</h2>
                                    <div className={styles.formGroup}>
                                        <label>Sourcing Location</label>
                                        <div className={styles.locationBlock}>
                                            <input 
                                                type="text" 
                                                value={profile?.location || ""} 
                                                disabled 
                                                className={styles.locInput}
                                                placeholder="Location loading..."
                                            />
                                        </div>
                                        <small className={styles.locHint}>Location is pulled securely from your verified profile.</small>
                                    </div>

                                    <div className={styles.btnRow}>
                                        <button type="button" className={styles.backBtn} onClick={prevStep}>Back</button>
                                        <button type="button" className={styles.nextBtn} onClick={nextStep}>Next Step</button>
                                    </div>
                                </div>
                            )}

                            {/* STEP 3: FINANCIALS */}
                            {step === 3 && (
                                <div className={styles.wizardStep}>
                                    <h2 className={styles.stepTitle}>Step 3: Financials & Metrics</h2>
                                    
                                    <div className={styles.row}>
                                        <div className={styles.formGroup} style={{ flex: 2 }}>
                                            <label>Quantity</label>
                                            <input name="quantity" type="number" placeholder="e.g. 50" onChange={handleChange} required className={styles.numInput} value={form.quantity}/>
                                        </div>
                                        <div className={styles.formGroup} style={{ flex: 1 }}>
                                            <label>Unit</label>
                                            <select name="unit" value={form.unit} onChange={handleChange} className={styles.numSelect}>
                                                <option>Bag</option>
                                                <option>Bucket</option>
                                                <option>Crate</option>
                                                <option>Kg</option>
                                                <option>Head</option>
                                                <option>Others</option>
                                            </select>
                                        </div>
                                    </div>

                                    <div className={styles.formGroup}>
                                        <label>Your Price (FCFA)</label>
                                        <input
                                            name="price"
                                            type="number"
                                            placeholder={`Price per ${form.unit}`}
                                            value={form.price}
                                            onChange={handleChange}
                                            required
                                            className={`${styles.priceInput} ${styles[`input_${guidanceState}`]} ${styles.numInput}`}
                                        />
                                    </div>

                                    {priceInsight && !isPioneer && (
                                        <div className={styles.intelBox}>
                                            <div className={styles.intelHeader}>Market Pulse ({profile?.location})</div>
                                            <div className={styles.intelGrid}>
                                                <div className={styles.intelStat}><span>Min</span><strong>{priceInsight.min.toLocaleString()}</strong></div>
                                                <div className={styles.intelStatAvg}><span>Avg</span><strong>{priceInsight.avg.toFixed(0).toLocaleString()}</strong></div>
                                                <div className={styles.intelStat}><span>Max</span><strong>{priceInsight.max.toLocaleString()}</strong></div>
                                            </div>
                                        </div>
                                    )}

                                    {guidanceState !== 'none' && (
                                        <div className={`${styles.guidanceAlert} ${styles[`alert_${guidanceState}`]}`}>
                                            {guidanceMsg}
                                        </div>
                                    )}

                                    <div className={styles.formGroup} style={{ marginTop: '16px' }}>
                                        <label>Availability</label>
                                        <div className={styles.radioGroup}>
                                            <label><input type="radio" name="harvest" value="ready" checked={form.harvest === "ready"} onChange={handleChange} /> Ready Now</label>
                                            <label><input type="radio" name="harvest" value="future" checked={form.harvest === "future"} onChange={handleChange} /> Future Harvest</label>
                                        </div>
                                        {form.harvest === "future" && (
                                            <input type="date" name="available_date" value={form.available_date} onChange={handleChange} required className={styles.dateInput} />
                                        )}
                                    </div>

                                    <div className={styles.btnRow}>
                                        <button type="button" className={styles.backBtn} onClick={prevStep}>Back</button>
                                        <button type="button" className={styles.nextBtn} onClick={nextStep} disabled={!form.price || !form.quantity}>Next Step</button>
                                    </div>
                                </div>
                            )}

                            {/* STEP 4: MEDIA & PUBLISH */}
                            {step === 4 && (
                                <div className={styles.wizardStep}>
                                    <h2 className={styles.stepTitle}>Step 4: Media & Details</h2>
                                    
                                    <div className={styles.imageUploadBox}>
                                        <label className={styles.imageLabel}>
                                            <div className={styles.imagePlaceholder}>
                                                <span className={styles.placeholderIcon} style={{ display: "flex", justifyContent: "center", marginBottom: "8px" }}>
                                                    <Camera size={32} style={{ color: "#64748b" }} />
                                                </span>
                                                <span className={styles.placeholderText}>Tap to Upload Images</span>
                                                <small>Max 5 photos</small>
                                            </div>
                                            <input type="file" accept="image/*" multiple onChange={handleImageChange} className={styles.hiddenInput} />
                                        </label>

                                        {imagePreviews.length > 0 && (
                                            <div className={styles.previewCarousel}>
                                                {imagePreviews.map((url, idx) => (
                                                    <div key={idx} className={styles.previewWrapper}>
                                                        <img src={url} alt={`Preview ${idx}`} className={styles.imagePreview} />
                                                        <button type="button" className={styles.removeBtn} onClick={() => removeImage(idx)}>✕</button>
                                                    </div>
                                                ))}
                                            </div>
                                        )}
                                    </div>

                                    <div className={styles.formGroup} style={{ marginTop: '16px' }}>
                                        <label>Additional Details</label>
                                        <textarea name="description" placeholder="Describe quality, strain, or logistics..." value={form.description} onChange={handleChange} className={styles.largeTextarea} />
                                    </div>

                                    <div className={styles.btnRow}>
                                        <button type="button" className={styles.backBtn} onClick={prevStep} disabled={loading}>Back</button>
                                        <button className={styles.publishBtn} type="submit" disabled={loading}>
                                            {loadingText}
                                        </button>
                                    </div>
                                </div>
                            )}
                        </form>
                    </>
                ) : (
                    <>
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
                                <div className={styles.customCropHint} style={{ display: "flex", alignItems: "center", gap: "6px" }}>
                                    <Sparkles size={16} style={{ color: "#fbbf24" }} /> <strong>Custom Crop Detected:</strong> You are adding a crop not currently in our catalog. Please specify its category below.
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

                            {/* MULTI-IMAGE UPLOAD */}
                            <div className={styles.imageUploadBox}>
                                <label className={styles.imageLabel}>
                                    <div className={styles.imagePlaceholder}>
                                        <span className={styles.placeholderIcon} style={{ display: "flex", justifyContent: "center", marginBottom: "8px" }}>
                                            <Camera size={32} style={{ color: "#64748b" }} />
                                        </span>
                                        <span className={styles.placeholderText}>Upload Product Images</span>
                                        <small>Add up to 5 photos for better visibility</small>
                                    </div>
                                    <input type="file" accept="image/*" multiple onChange={handleImageChange} className={styles.hiddenInput} />
                                </label>

                                {imagePreviews.length > 0 && (
                                    <div className={styles.previewGrid}>
                                        {imagePreviews.map((url, idx) => (
                                            <div key={idx} className={styles.previewWrapper}>
                                                <img src={url} alt={`Preview ${idx}`} className={styles.imagePreview} />
                                                <button type="button" className={styles.removeBtn} onClick={() => removeImage(idx)}>✕</button>
                                            </div>
                                        ))}
                                        {imagePreviews.length < 5 && (
                                            <label className={styles.addMoreBox}>
                                                <span>+</span>
                                                <input type="file" accept="image/*" multiple onChange={handleImageChange} className={styles.hiddenInput} />
                                            </label>
                                        )}
                                    </div>
                                )}
                            </div>

                            {/* QUANTITY & UNIT */}
                            <div className={styles.row}>
                                <input name="quantity" type="number" placeholder="Quantity" onChange={handleChange} required className={styles.flex2} />
                                <select name="unit" value={form.unit} onChange={handleChange} className={styles.flex1}>
                                    <option>Bag</option>
                                    <option>Bucket</option>
                                    <option>Crate</option>
                                    <option>Kg</option>
                                    <option>Others</option>
                                </select>
                            </div>

                            {/* THE PIONEER STATE */}
                            {isPioneer && form.crop && (
                                <div className={styles.pioneerState} style={{ display: "flex", alignItems: "center", gap: "8px" }}>
                                    <Zap size={18} style={{ color: "#fbbf24" }} /> <strong>Pioneer Alert:</strong> You are the first to price this crop in this neighborhood! You are setting the market pulse.
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
                                {loadingText}
                            </button>
                        </form>
                    </>
                )}
            </div>

            {/* Custom Modal */}
            {modalState.show && (
                <div className={styles.modalOverlay}>
                    <div className={styles.authModal}>
                        <div className={styles.authModalIcon} style={{ background: modalState.type === 'error' ? '#fef2f2' : '#f0fdf4', color: modalState.type === 'error' ? '#ef4444' : '#22c55e' }}>
                            {modalState.type === 'error' ? <AlertCircle size={32} /> : <CheckCircle2 size={32} />}
                        </div>
                        <h3>{modalState.type === 'error' ? 'Notice' : 'Success'}</h3>
                        <p>{modalState.message}</p>
                        <div className={styles.authModalActions}>
                            <button className={styles.btnModalPrimary} onClick={() => {
                                setModalState({...modalState, show: false});
                                if (modalState.onConfirm) modalState.onConfirm();
                            }}>
                                Continue
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}