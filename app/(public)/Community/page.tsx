"use client";

import { useEffect, useState } from "react";
import { supabase } from "@/lib/supabaseClient";
import { useAuth } from "../../context/AuthContext";
import styles from "./Community.module.css";
import Footer from "../../components/Footer/Footer";
import { Globe, Sprout, ShoppingCart, ShieldCheck, MapPin, Handshake, Lock, Leaf } from "lucide-react";

export default function CommunityPage() {
    const { user } = useAuth();
    const [members, setMembers] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchMembers = async () => {
            const { data } = await supabase
                .from("profiles")
                .select("id, full_name, location, is_farmer, is_buyer, is_provider, is_approved_provider, avatar_url")
                .limit(20);

            if (data) setMembers(data);
            setLoading(false);
        };
        fetchMembers();
    }, []);

    return (
        <div className={styles.container}>
            {/* HERO */}
            <section className={styles.hero}>
                <div className={styles.heroContent}>
                    <span className={styles.heroBadge} style={{ display: "inline-flex", alignItems: "center", gap: "6px" }}>
                        <Globe size={14} /> AgroLink Community
                    </span>
                    <h1>Connect With <span>Farmers</span> & <span>Buyers</span></h1>
                    <p>Meet the growing network of verified producers, traders, and organizations building a better agricultural future in the North West Region.</p>
                </div>
            </section>

            {/* STATS */}
            <section className={styles.statsSection}>
                <div className={styles.statsGrid}>
                    <div className={styles.statCard}>
                        <span className={styles.statIcon} style={{ display: "flex", justifyContent: "center" }}>
                            <Sprout size={24} style={{ color: "#22c55e" }} />
                        </span>
                        <span className={styles.statNum}>{members.filter(m => m.is_farmer).length}</span>
                        <span className={styles.statLbl}>Farmers</span>
                    </div>
                    <div className={styles.statCard}>
                        <span className={styles.statIcon} style={{ display: "flex", justifyContent: "center" }}>
                            <ShoppingCart size={24} style={{ color: "#fbbf24" }} />
                        </span>
                        <span className={styles.statNum}>{members.filter(m => m.is_buyer).length}</span>
                        <span className={styles.statLbl}>Buyers</span>
                    </div>
                    <div className={styles.statCard}>
                        <span className={styles.statIcon} style={{ display: "flex", justifyContent: "center" }}>
                            <ShieldCheck size={24} style={{ color: "#4ade80" }} />
                        </span>
                        <span className={styles.statNum}>{members.filter(m => m.is_approved_provider).length}</span>
                        <span className={styles.statLbl}>Verified Providers</span>
                    </div>
                    <div className={styles.statCard}>
                        <span className={styles.statIcon} style={{ display: "flex", justifyContent: "center" }}>
                            <MapPin size={24} style={{ color: "#ef4444" }} />
                        </span>
                        <span className={styles.statNum}>{new Set(members.map(m => m.location).filter(Boolean)).size}</span>
                        <span className={styles.statLbl}>Neighborhoods</span>
                    </div>
                </div>
            </section>

            {/* MEMBERS */}
            <section className={styles.membersSection}>
                <div className={styles.membersHeader}>
                    <h2>Community Members</h2>
                    <p>Our growing network of verified agricultural stakeholders.</p>
                </div>

                {loading ? (
                    <div className={styles.loading}>Loading community...</div>
                ) : (
                    <div className={styles.membersGrid}>
                        {members.map((member) => (
                            <div key={member.id} className={styles.memberCard}>
                                <div className={styles.memberAvatar}>
                                    {member.avatar_url ? (
                                        <img src={supabase.storage.from("avatars").getPublicUrl(member.avatar_url).data.publicUrl} alt="" />
                                    ) : (
                                        <span>{(member.full_name || "U")[0].toUpperCase()}</span>
                                    )}
                                </div>
                                <h3>{member.full_name || "Anonymous"}</h3>
                                {member.location && (
                                    <p className={styles.memberLocation} style={{ display: "inline-flex", alignItems: "center", gap: "4px" }}>
                                        <MapPin size={12} /> {member.location}
                                    </p>
                                )}
                                <div className={styles.memberRoles}>
                                    {member.is_farmer && <span className={styles.roleFarmer} style={{ display: "inline-flex", alignItems: "center", gap: "4px" }}><Sprout size={11} /> Farmer</span>}
                                    {member.is_buyer && <span className={styles.roleBuyer} style={{ display: "inline-flex", alignItems: "center", gap: "4px" }}><ShoppingCart size={11} /> Buyer</span>}
                                    {member.is_approved_provider && <span className={styles.roleProvider} style={{ display: "inline-flex", alignItems: "center", gap: "4px" }}><ShieldCheck size={11} /> Provider</span>}
                                </div>
                            </div>
                        ))}
                    </div>
                )}
            </section>

            {/* VALUES */}
            <section className={styles.values}>
                <h2>Community Values</h2>
                <div className={styles.valuesGrid}>
                    <div className={styles.valueCard}>
                        <div className={styles.valueIcon} style={{ display: "flex", justifyContent: "center", marginBottom: "16px" }}>
                            <Handshake size={32} style={{ color: "#22c55e" }} />
                        </div>
                        <h3>Transparency</h3>
                        <p>All prices are visible. No hidden fees, no middleman markups.</p>
                    </div>
                    <div className={styles.valueCard}>
                        <div className={styles.valueIcon} style={{ display: "flex", justifyContent: "center", marginBottom: "16px" }}>
                            <Lock size={32} style={{ color: "#fbbf24" }} />
                        </div>
                        <h3>Trust</h3>
                        <p>Verified profiles and GPS-anchored locations ensure accountability.</p>
                    </div>
                    <div className={styles.valueCard}>
                        <div className={styles.valueIcon} style={{ display: "flex", justifyContent: "center", marginBottom: "16px" }}>
                            <Leaf size={32} style={{ color: "#4ade80" }} />
                        </div>
                        <h3>Sustainability</h3>
                        <p>Reducing waste through perishability tracking and demand signaling.</p>
                    </div>
                </div>
            </section>

            <Footer />
        </div>
    );
}
