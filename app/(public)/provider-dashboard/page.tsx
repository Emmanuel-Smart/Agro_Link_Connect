"use client";

import { useEffect, useState, FormEvent } from "react";
import { supabase } from "@/lib/supabaseClient";
import { useAuth } from "../../../context/AuthContext";
import { useRouter } from "next/navigation";
import styles from "./ProviderDashboard.module.css";

const formatExactDate = (dateString: string) => {
    if (!dateString) return "N/A";
    const date = new Date(dateString);
    if (isNaN(date.getTime())) return "N/A";
    return date.toLocaleDateString('en-US', {
        month: 'short', day: 'numeric', year: 'numeric',
        hour: 'numeric', minute: '2-digit'
    });
};

export default function ProviderDashboardPage() {
    const { user } = useAuth();
    const router = useRouter();
    const [profile, setProfile] = useState<any>(null);
    const [loading, setLoading] = useState(true);
    const [alerts, setAlerts] = useState<any[]>([]);
    
    // Form state
    const [type, setType] = useState("[WEATHER WARNING]");
    const [message, setMessage] = useState("");
    const [isSubmitting, setIsSubmitting] = useState(false);

    useEffect(() => {
        if (!user) {
            router.push("/login");
            return;
        }

        const fetchData = async () => {
            const { data: profileData } = await supabase
                .from("profiles")
                .select("*")
                .eq("id", user.id)
                .single();

            if (!profileData?.is_approved_provider) {
                alert("Unauthorized. Only Approved Providers can access this dashboard.");
                router.push("/profile");
                return;
            }

            setProfile(profileData);

            const { data: alertData } = await supabase
                .from("alerts")
                .select("*")
                .eq("provider_id", user.id)
                .order("created_at", { ascending: false });

            if (alertData) setAlerts(alertData);
            setLoading(false);
        };

        fetchData();
    }, [user, router]);

    const handleSubmit = async (e: FormEvent) => {
        e.preventDefault();
        if (!message.trim()) return;
        setIsSubmitting(true);

        const newAlert = {
            provider_id: user?.id,
            location: profile.location,
            type: type,
            message: message,
            created_at: new Date().toISOString()
        };

        const { data, error } = await supabase
            .from("alerts")
            .insert([newAlert])
            .select();

        if (error) {
            alert("Error broadcasting alert.");
        } else if (data) {
            setAlerts([data[0], ...alerts]);
            setMessage("");
            alert("Bulletin Broadcasted to " + profile.location + "!");
        }
        
        setIsSubmitting(false);
    };

    if (loading) return <div className={styles.loading}>Authenticating Provider Gateway...</div>;

    return (
        <div className={styles.container}>
            <div className={styles.dashboard}>
                <div className={styles.header}>
                    <h1>🛡️ Provider Operations Hub</h1>
                    <p>Broadcasting Official Bulletins to <strong>{profile?.location}</strong></p>
                </div>

                <div className={styles.formCard}>
                    <h2>Create New Bulletin</h2>
                    <form onSubmit={handleSubmit}>
                        <div className={styles.formGroup}>
                            <label>Bulletin Type</label>
                            <select value={type} onChange={(e) => setType(e.target.value)}>
                                <option value="[WEATHER WARNING]">[WEATHER WARNING]</option>
                                <option value="[AGRI-SUBSIDY]">[AGRI-SUBSIDY]</option>
                                <option value="[PEST OUTBREAK]">[PEST OUTBREAK]</option>
                                <option value="[NGO GRANT]">[NGO GRANT]</option>
                                <option value="[MARKET UPDATE]">[MARKET UPDATE]</option>
                            </select>
                        </div>
                        <div className={styles.formGroup}>
                            <label>Message Payload</label>
                            <textarea 
                                rows={4} 
                                value={message} 
                                onChange={(e) => setMessage(e.target.value)} 
                                placeholder="Type your official announcement here..."
                                required
                            />
                        </div>
                        <button type="submit" className={styles.btnSubmit} disabled={isSubmitting}>
                            {isSubmitting ? "Broadcasting..." : "Broadcast to Region"}
                        </button>
                    </form>
                </div>

                <h2 className={styles.sectionTitle}>Broadcast History</h2>
                <div className={styles.grid}>
                    {alerts.map(alert => (
                        <div key={alert.id} className={styles.alertCard}>
                            <div className={styles.alertHeader}>
                                <span className={styles.alertBadge}>{alert.type}</span>
                                <span className={styles.alertDate}>{formatExactDate(alert.created_at)}</span>
                            </div>
                            <p>{alert.message}</p>
                        </div>
                    ))}
                    
                    {alerts.length === 0 && (
                        <div className={styles.emptyState}>No bulletins broadcasted yet.</div>
                    )}
                </div>
            </div>
        </div>
    );
}
