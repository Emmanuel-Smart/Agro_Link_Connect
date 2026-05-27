"use client";

import styles from "./About.module.css";
import Link from "next/link";
import Footer from "../../components/Footer/Footer";
import { ShieldCheck, Radio, Clock } from "lucide-react";

export default function AboutPage() {
    return (
        <div className={styles.container}>
            {/* HERO */}
            <section className={styles.hero}>
                <div className={styles.heroContent}>
                    <span className={styles.heroBadge}>About AgroLink</span>
                    <h1>Bridging the Gap Between <span>Farmers</span> & <span>Markets</span></h1>
                    <p>AgroLink is an intelligent agricultural marketplace designed to eliminate middlemen, reduce post-harvest losses, and empower Bamenda&apos;s farming communities with real-time market data.</p>
                </div>
            </section>

            {/* MISSION */}
            <section className={styles.mission}>
                <div className={styles.missionGrid}>
                    <div className={styles.missionText}>
                        <span className={styles.sectionBadge}>Our Mission</span>
                        <h2>Empowering Cameroon&apos;s Agricultural Economy</h2>
                        <p>AgroLink was born from a research project at the intersection of technology and agriculture. Our mission is to create a transparent, fair, and efficient marketplace where every farmer has access to real-time pricing intelligence and direct buyer connections.</p>
                        <p>We believe that information asymmetry is the root cause of exploitation in agricultural markets. By providing transparent market data and direct communication channels, we level the playing field for smallholder farmers.</p>
                    </div>
                    <div className={styles.missionStats}>
                        <div className={styles.stat}>
                            <span className={styles.statNumber}>3</span>
                            <span className={styles.statLabel}>Research Pillars</span>
                        </div>
                        <div className={styles.stat}>
                            <span className={styles.statNumber}>5</span>
                            <span className={styles.statLabel}>Core Phases</span>
                        </div>
                        <div className={styles.stat}>
                            <span className={styles.statNumber}>100%</span>
                            <span className={styles.statLabel}>Transparency</span>
                        </div>
                    </div>
                </div>
            </section>

            {/* THREE RESEARCH PILLARS */}
            <section className={styles.pillars}>
                <div className={styles.pillarsHeader}>
                    <span className={styles.sectionBadge}>Research Foundation</span>
                    <h2>The Three Pillars</h2>
                    <p>Our platform is built on three critical research pillars that address the core challenges facing agricultural communities in the North West Region of Cameroon.</p>
                </div>
                <div className={styles.pillarGrid}>
                    <div className={styles.pillarCard}>
                        <div className={styles.pillarIcon} style={{ display: "flex", justifyContent: "center", alignItems: "center" }}>
                            <ShieldCheck size={28} style={{ color: "#22c55e" }} />
                        </div>
                        <h3>Anti-Exploitation Engine</h3>
                        <p>Real-time price intelligence that protects farmers from predatory middlemen. Our system compares your asking price against neighborhood market data, alerting you if your price falls below fair market value.</p>
                        <div className={styles.pillarFeatures}>
                            <span>Min/Max Price Alerts</span>
                            <span>Red/Green/Yellow Guidance</span>
                            <span>Pioneer State Detection</span>
                        </div>
                    </div>
                    <div className={styles.pillarCard}>
                        <div className={styles.pillarIcon} style={{ display: "flex", justifyContent: "center", alignItems: "center" }}>
                            <Radio size={28} style={{ color: "#3b82f6" }} />
                        </div>
                        <h3>Spatial Intelligence</h3>
                        <p>GPS-verified neighborhood mapping ensures every price point and market signal is geographically accurate. Your location is your anchor — it connects you to hyper-local market data.</p>
                        <div className={styles.pillarFeatures}>
                            <span>GPS Verification</span>
                            <span>Neighborhood Mapping</span>
                            <span>Geofenced Broadcasts</span>
                        </div>
                    </div>
                    <div className={styles.pillarCard}>
                        <div className={styles.pillarIcon} style={{ display: "flex", justifyContent: "center", alignItems: "center" }}>
                            <Clock size={28} style={{ color: "#eab308" }} />
                        </div>
                        <h3>Perishability Management</h3>
                        <p>Crop-specific shelf-life tracking reduces post-harvest waste by alerting buyers and farmers about product freshness windows. Future harvest signaling connects buyers to crops before they are even ready.</p>
                        <div className={styles.pillarFeatures}>
                            <span>Shelf-Life Countdown</span>
                            <span>Future Harvest Signals</span>
                            <span>Demand Matching</span>
                        </div>
                    </div>
                </div>
            </section>

            {/* HOW IT WORKS */}
            <section className={styles.howItWorks}>
                <div className={styles.howHeader}>
                    <span className={styles.sectionBadge}>Platform Flow</span>
                    <h2>How AgroLink Works</h2>
                </div>
                <div className={styles.stepsGrid}>
                    <div className={styles.step}>
                        <div className={styles.stepNumber}>01</div>
                        <h3>Identity & Location Gate</h3>
                        <p>Sign up and verify your GPS location. This anchors you to your local market neighborhood.</p>
                    </div>
                    <div className={styles.step}>
                        <div className={styles.stepNumber}>02</div>
                        <h3>List Your Products</h3>
                        <p>Add your crops with real-time price guidance. The Intelligence Dashboard helps you set competitive prices.</p>
                    </div>
                    <div className={styles.step}>
                        <div className={styles.stepNumber}>03</div>
                        <h3>Direct Connection</h3>
                        <p>Buyers contact you directly via WhatsApp or phone. No middlemen, no exploitation.</p>
                    </div>
                    <div className={styles.step}>
                        <div className={styles.stepNumber}>04</div>
                        <h3>Official Broadcasts</h3>
                        <p>Verified NGOs and government agencies broadcast weather alerts, pest warnings, and grant opportunities to your area.</p>
                    </div>
                </div>
            </section>

            {/* CTA */}
            <section className={styles.cta}>
                <h2>Ready to Transform Your Farm Business?</h2>
                <p>Join AgroLink today and get access to real-time market intelligence, direct buyer connections, and verified official broadcasts.</p>
                <div className={styles.ctaButtons}>
                    <Link href="/register" className={styles.btnPrimary}>Create Free Account</Link>
                    <Link href="/home" className={styles.btnSecondary}>Browse Marketplace</Link>
                </div>
            </section>

            <Footer />
        </div>
    );
}
