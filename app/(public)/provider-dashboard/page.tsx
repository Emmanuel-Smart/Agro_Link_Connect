"use client";

import { useEffect, useState, FormEvent } from "react";
import { supabase } from "@/lib/supabaseClient";
import { useAuth } from "@/app/context/AuthContext";
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
    const [targetLocation, setTargetLocation] = useState("");
    const [message, setMessage] = useState("");
    const [isSubmitting, setIsSubmitting] = useState(false);

    // Edit state
    const [editingAlert, setEditingAlert] = useState<any>(null);
    const [editForm, setEditForm] = useState({ type: "", message: "", location: "" });

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
            setTargetLocation(profileData.location || "");

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
            location: targetLocation,
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

    const handleDelete = async (id: string) => {
        if (!confirm("Are you sure you want to delete this bulletin? It will disappear from all farmer feeds.")) return;
        
        const { error } = await supabase.from("alerts").delete().eq("id", id);
        if (!error) {
            setAlerts(alerts.filter(a => a.id !== id));
        } else {
            alert("Error deleting bulletin.");
        }
    };

    const openEdit = (alert: any) => {
        setEditingAlert(alert);
        setEditForm({ type: alert.type, message: alert.message, location: alert.location });
    };

    const handleUpdate = async (e: FormEvent) => {
        e.preventDefault();
        const { error } = await supabase
            .from("alerts")
            .update({ type: editForm.type, message: editForm.message, location: editForm.location })
            .eq("id", editingAlert.id);

        if (!error) {
            setAlerts(alerts.map(a => a.id === editingAlert.id ? { ...a, ...editForm } : a));
            setEditingAlert(null);
        } else {
            alert("Error updating bulletin.");
        }
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
                            <label>Target Location (Who should see this?)</label>
                            <div className={styles.locationInputGroup}>
                                <input 
                                    type="text" 
                                    value={targetLocation} 
                                    onChange={(e) => setTargetLocation(e.target.value)}
                                    placeholder="e.g. Bamenda, Mile 4, Yaounde..."
                                    required
                                />
                                <button 
                                    type="button" 
                                    className={styles.btnSmall}
                                    onClick={() => setTargetLocation(profile.location)}
                                >
                                    Reset to My Location
                                </button>
                            </div>
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
                                <div className={styles.alertMainInfo}>
                                    <span className={styles.alertBadge}>{alert.type}</span>
                                    <span className={styles.targetBadge}>📍 {alert.location}</span>
                                </div>
                                <span className={styles.alertDate}>{formatExactDate(alert.created_at)}</span>
                            </div>
                            <p>{alert.message}</p>
                            
                            <div className={styles.alertActions}>
                                <button className={styles.btnEdit} onClick={() => openEdit(alert)}>✏️ Edit</button>
                                <button className={styles.btnDelete} onClick={() => handleDelete(alert.id)}>🗑️ Delete</button>
                            </div>
                        </div>
                    ))}
                    
                    {alerts.length === 0 && (
                        <div className={styles.emptyState}>No bulletins broadcasted yet.</div>
                    )}
                </div>
            </div>

            {/* --- Edit Modal --- */}
            {editingAlert && (
                <div className={styles.modalOverlay}>
                    <div className={styles.modalContent}>
                        <h2>Update Official Bulletin</h2>
                        <form onSubmit={handleUpdate}>
                            <div className={styles.formGroup}>
                                <label>Bulletin Type</label>
                                <select value={editForm.type} onChange={(e) => setEditForm({...editForm, type: e.target.value})}>
                                    <option value="[WEATHER WARNING]">[WEATHER WARNING]</option>
                                    <option value="[AGRI-SUBSIDY]">[AGRI-SUBSIDY]</option>
                                    <option value="[PEST OUTBREAK]">[PEST OUTBREAK]</option>
                                    <option value="[NGO GRANT]">[NGO GRANT]</option>
                                    <option value="[MARKET UPDATE]">[MARKET UPDATE]</option>
                                </select>
                            </div>
                            <div className={styles.formGroup}>
                                <label>Target Location</label>
                                <input type="text" value={editForm.location} onChange={(e) => setEditForm({...editForm, location: e.target.value})} required />
                            </div>
                            <div className={styles.formGroup}>
                                <label>Message</label>
                                <textarea rows={4} value={editForm.message} onChange={(e) => setEditForm({...editForm, message: e.target.value})} required />
                            </div>
                            <div className={styles.modalActions}>
                                <button type="button" className={styles.btnCancel} onClick={() => setEditingAlert(null)}>Cancel</button>
                                <button type="submit" className={styles.btnSave}>Save Changes</button>
                            </div>
                        </form>
                    </div>
                </div>
            )}
        </div>
    );
}
