"use client";

import { useEffect, useState } from "react";
import { supabase } from "@/lib/supabaseClient";
import { useAuth } from "../../context/AuthContext";
import { useRouter } from "next/navigation";
import styles from "./Dashboard.module.css";
import Link from "next/link";
import Footer from "../Footer/Footer";

export default function Dashboard() {
    const { user } = useAuth();
    const router = useRouter();
    const [products, setProducts] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchLatestProducts = async () => {
            const { data } = await supabase
                .from("products")
                .select("*, profiles(whatsapp, phone)")
                .order("created_at", { ascending: false })
                .limit(12);
            
            if (data) setProducts(data);
            setLoading(false);
        };
        fetchLatestProducts();
    }, []);

    const handleContactGuard = (e: React.MouseEvent) => {
        if (!user) {
            e.preventDefault();
            alert("🔒 Access Restricted: Please Sign Up or Login to contact farmers and view full market details.");
            router.push("/register");
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
                                    <div className={styles.actions}>
                                        <button onClick={handleContactGuard} className={styles.btnAction}>💬 WhatsApp</button>
                                        <button onClick={handleContactGuard} className={styles.btnActionSecondary}>📞 Call Farmer</button>
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
