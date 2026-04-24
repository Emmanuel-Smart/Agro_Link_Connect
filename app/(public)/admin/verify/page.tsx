"use client";

import { useEffect, useState } from "react";
import { supabase } from "@/lib/supabaseClient";
import { useAuth } from "@/app/context/AuthContext";
import { useRouter } from "next/navigation";
import styles from "./Admin.module.css";

const ADMIN_EMAIL = "nsamiemmanuelkongnyu@gmail.com";

export default function AdminVerifyPage() {
    const { user } = useAuth();
    const router = useRouter();
    const [providers, setProviders] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        if (!user) return;
        
        // --- SECURITY GATE ---
        if (!user.email || user.email.toLowerCase().trim() !== ADMIN_EMAIL.toLowerCase().trim()) {
            alert("Unauthorized Access. Only System Admins can view this page.");
            router.push("/home");
            return;
        }
        // ---------------------

        const fetchProviders = async () => {
            const { data, error } = await supabase
                .from("profiles")
                .select("*")
                .eq("is_provider", true);
                
            if (error) {
                console.error("Error fetching providers:", error);
            }
                
            if (data) setProviders(data);
            setLoading(false);
        };
        
        fetchProviders();
    }, [user, router]);

    const handleApprove = async (id: string, currentStatus: boolean) => {
        const { error } = await supabase
            .from("profiles")
            .update({ is_approved_provider: !currentStatus })
            .eq("id", id);
            
        if (!error) {
            setProviders(providers.map(p => p.id === id ? { ...p, is_approved_provider: !currentStatus } : p));
        } else {
            alert("Error updating provider status.");
        }
    };

    if (loading) return <div className={styles.loading}>Authenticating Admin Gateway...</div>;

    return (
        <div className={styles.container}>
            <div className={styles.dashboard}>
                <div className={styles.header}>
                    <h1>🛡️ Central Authority Hub</h1>
                    <p>Vetting & Approval of Official Information Providers</p>
                </div>

                <div className={styles.grid}>
                    {providers.map(provider => (
                        <div key={provider.id} className={`${styles.card} ${provider.is_approved_provider ? styles.cardApproved : ''}`}>
                            <div className={styles.cardHeader}>
                                <h2>{provider.full_name}</h2>
                                <span className={styles.badge}>{provider.location}</span>
                            </div>
                            <p><strong>Contact:</strong> {provider.whatsapp}</p>
                            
                            <div className={styles.actionArea}>
                                <div className={styles.status}>
                                    Status: {provider.is_approved_provider ? <span className={styles.statusActive}>Verified Source</span> : <span className={styles.statusPending}>Pending Review</span>}
                                </div>
                                <button 
                                    className={`${styles.btn} ${provider.is_approved_provider ? styles.btnRevoke : styles.btnApprove}`}
                                    onClick={() => handleApprove(provider.id, provider.is_approved_provider)}
                                >
                                    {provider.is_approved_provider ? "Revoke Access" : "Approve Provider"}
                                </button>
                            </div>
                        </div>
                    ))}
                    
                    {providers.length === 0 && (
                        <div className={styles.emptyState}>No providers pending verification.</div>
                    )}
                </div>
            </div>
        </div>
    );
}
