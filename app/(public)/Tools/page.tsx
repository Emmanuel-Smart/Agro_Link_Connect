"use client";

import { useState } from "react";
import styles from "./Tools.module.css";
import Footer from "../../components/Footer/Footer";
import { Wrench, Clock, DollarSign, BookOpen } from "lucide-react";

const CROP_SHELF_LIFE: Record<string, number> = {
    "Tomatoes": 7, "Peppers": 10, "Leafy Greens": 5, "Bananas": 12,
    "Mangoes": 8, "Avocados": 7, "Carrots": 21, "Cabbage": 14,
    "Maize": 90, "Beans": 120, "Rice": 180, "Groundnuts": 90,
    "Cassava": 3, "Plantains": 10, "Potatoes": 30, "Onions": 45,
};

export default function ToolsPage() {
    const [selectedCrop, setSelectedCrop] = useState("");
    const [harvestDate, setHarvestDate] = useState("");
    const [priceEstimate, setPriceEstimate] = useState("");
    const [quantity, setQuantity] = useState("");

    const shelfLife = selectedCrop ? CROP_SHELF_LIFE[selectedCrop] || null : null;

    const getExpiryDate = () => {
        if (!harvestDate || !shelfLife) return null;
        const date = new Date(harvestDate);
        date.setDate(date.getDate() + shelfLife);
        return date.toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" });
    };

    const getDaysRemaining = () => {
        if (!harvestDate || !shelfLife) return null;
        const expiry = new Date(harvestDate);
        expiry.setDate(expiry.getDate() + shelfLife);
        const diff = expiry.getTime() - new Date().getTime();
        return Math.max(0, Math.ceil(diff / (1000 * 60 * 60 * 24)));
    };

    const totalRevenue = priceEstimate && quantity ? (Number(priceEstimate) * Number(quantity)).toLocaleString() : null;

    return (
        <div className={styles.container}>
            {/* HERO */}
            <section className={styles.hero}>
                <div className={styles.heroContent}>
                    <span className={styles.heroBadge} style={{ display: "inline-flex", alignItems: "center", gap: "6px" }}>
                        <Wrench size={14} /> AgroLink Tools
                    </span>
                    <h1>Smart <span>Agricultural</span> Tools</h1>
                    <p>Free tools designed to help farmers make better decisions about pricing, shelf life, and revenue forecasting.</p>
                </div>
            </section>

            {/* TOOLS GRID */}
            <section className={styles.toolsSection}>
                <div className={styles.toolsGrid}>
                    {/* Shelf Life Calculator */}
                    <div className={styles.toolCard}>
                        <div className={styles.toolHeader}>
                            <span className={styles.toolIcon} style={{ display: "flex", alignItems: "center" }}>
                                <Clock size={20} style={{ color: "#fbbf24" }} />
                            </span>
                            <h3>Shelf Life Calculator</h3>
                        </div>
                        <p className={styles.toolDesc}>Calculate how long your crop will stay fresh after harvest.</p>

                        <div className={styles.toolForm}>
                            <select value={selectedCrop} onChange={(e) => setSelectedCrop(e.target.value)}>
                                <option value="">Select a crop...</option>
                                {Object.keys(CROP_SHELF_LIFE).map(crop => (
                                    <option key={crop} value={crop}>{crop}</option>
                                ))}
                            </select>

                            <input type="date" value={harvestDate} onChange={(e) => setHarvestDate(e.target.value)} placeholder="Harvest Date" />
                        </div>

                        {shelfLife && (
                            <div className={styles.resultBox}>
                                <div className={styles.resultRow}>
                                    <span>Shelf Life</span>
                                    <strong>{shelfLife} days</strong>
                                </div>
                                {getExpiryDate() && (
                                    <>
                                        <div className={styles.resultRow}>
                                            <span>Best Before</span>
                                            <strong>{getExpiryDate()}</strong>
                                        </div>
                                        <div className={styles.resultRow}>
                                            <span>Days Remaining</span>
                                            <strong className={getDaysRemaining()! <= 3 ? styles.danger : styles.safe}>
                                                {getDaysRemaining()} days
                                            </strong>
                                        </div>
                                    </>
                                )}
                            </div>
                        )}
                    </div>

                    {/* Revenue Calculator */}
                    <div className={styles.toolCard}>
                        <div className={styles.toolHeader}>
                            <span className={styles.toolIcon} style={{ display: "flex", alignItems: "center" }}>
                                <DollarSign size={20} style={{ color: "#fbbf24" }} />
                            </span>
                            <h3>Revenue Calculator</h3>
                        </div>
                        <p className={styles.toolDesc}>Estimate your total revenue based on price and quantity.</p>

                        <div className={styles.toolForm}>
                            <input type="number" placeholder="Price per unit (FCFA)" value={priceEstimate} onChange={(e) => setPriceEstimate(e.target.value)} />
                            <input type="number" placeholder="Quantity (units)" value={quantity} onChange={(e) => setQuantity(e.target.value)} />
                        </div>

                        {totalRevenue && (
                            <div className={styles.resultBox}>
                                <div className={styles.resultRow}>
                                    <span>Total Revenue</span>
                                    <strong className={styles.revenue}>{totalRevenue} FCFA</strong>
                                </div>
                            </div>
                        )}
                    </div>

                    {/* Crop Calendar */}
                    <div className={styles.toolCard}>
                        <div className={styles.toolHeader}>
                            <span className={styles.toolIcon} style={{ display: "flex", alignItems: "center" }}>
                                <BookOpen size={20} style={{ color: "#fbbf24" }} />
                            </span>
                            <h3>Crop Shelf Life Reference</h3>
                        </div>
                        <p className={styles.toolDesc}>Quick reference guide for crop storage durations.</p>

                        <div className={styles.refTable}>
                            <div className={styles.refHeader}>
                                <span>Crop</span><span>Days</span><span>Type</span>
                            </div>
                            {Object.entries(CROP_SHELF_LIFE).map(([crop, days]) => (
                                <div key={crop} className={styles.refRow}>
                                    <span>{crop}</span>
                                    <span className={days <= 10 ? styles.danger : days <= 30 ? styles.warning : styles.safe}>{days}d</span>
                                    <span className={styles.refType}>{days <= 14 ? "Perishable" : "Durable"}</span>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>
            </section>

            <Footer />
        </div>
    );
}
