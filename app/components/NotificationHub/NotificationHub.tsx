"use client";

import { useEffect, useState } from "react";
import { supabase } from "@/lib/supabaseClient";
import { useAuth } from "../../context/AuthContext";
import styles from "./NotificationHub.module.css";

export default function NotificationHub() {
    const { user } = useAuth();
    const [notifications, setNotifications] = useState<any[]>([]);
    const [isOpen, setIsOpen] = useState(false);
    const [unreadCount, setUnreadCount] = useState(0);
    const [activeTab, setActiveTab] = useState<"match" | "report">("match");

    useEffect(() => {
        if (!user) return;

        const fetchNotifications = async () => {
            const now = new Date().toISOString();
            
            // 1. Fetch active alert IDs
            const { data: activeAlerts } = await supabase
                .from("alerts")
                .select("id")
                .or(`expires_at.is.null,expires_at.gt.${now}`);
            
            const activeAlertIds = new Set(activeAlerts?.map(a => a.id) || []);

            // 2. Fetch notifications
            const { data } = await supabase
                .from("notifications")
                .select("*")
                .eq("user_id", user.id)
                .order("created_at", { ascending: false });
            
            if (data) {
                // 3. Filter notifications: if it's a report, it must point to an active alert
                const filteredData = data.filter(n => {
                    if (n.type !== 'report') return true;
                    // Extract ID from link "/news?id=..."
                    const alertId = n.link.split("id=")[1];
                    if (!alertId) return true; // fallback if no ID in link
                    return activeAlertIds.has(alertId);
                });

                setNotifications(filteredData);
                setUnreadCount(filteredData.filter(n => !n.is_read).length);
            }
        };

        fetchNotifications();

        // Subscribe to real-time changes
        const channel = supabase
            .channel(`public:notifications:hub`)
            .on('postgres_changes', { event: 'INSERT', schema: 'public', table: 'notifications' }, (payload) => {
                if (payload.new.user_id === user.id) {
                    setNotifications(prev => [payload.new, ...prev]);
                    setUnreadCount(prev => prev + 1);
                }
            })
            .subscribe();

        return () => {
            supabase.removeChannel(channel);
        };
    }, [user]);

    const markAllAsRead = async () => {
        if (!user) return;
        await supabase
            .from("notifications")
            .update({ is_read: true })
            .eq("user_id", user.id);
        
        setNotifications(notifications.map(n => ({ ...n, is_read: true })));
        setUnreadCount(0);
    };

    const filtered = notifications.filter(n => {
        if (activeTab === "match") return n.type === "match";
        return n.type === "report";
    });

    return (
        <div className={styles.wrapper}>
            <button className={styles.bellBtn} onClick={() => { setIsOpen(!isOpen); if (!isOpen) markAllAsRead(); }}>
                🔔 {unreadCount > 0 && <span className={styles.badge}>{unreadCount}</span>}
            </button>

            {isOpen && (
                <div className={styles.dropdown}>
                    <div className={styles.header}>
                        <h4>Intelligence Feed</h4>
                        <div className={styles.tabs}>
                            <button 
                                className={`${styles.tabBtn} ${activeTab === 'match' ? styles.tabActive : ''}`}
                                onClick={() => setActiveTab('match')}
                            >
                                🛒 Market Matches
                            </button>
                            <button 
                                className={`${styles.tabBtn} ${activeTab === 'report' ? styles.tabActive : ''}`}
                                onClick={() => setActiveTab('report')}
                            >
                                🛡️ Official Reports
                            </button>
                        </div>
                    </div>
                    <div className={styles.list}>
                        {filtered.length === 0 ? (
                            <p className={styles.empty}>
                                {activeTab === 'match' 
                                    ? "No new crop matches yet. We'll alert you when supply arrives!" 
                                    : "No official reports for your area at this time."}
                            </p>
                        ) : (
                            filtered.map(n => (
                                <div key={n.id} className={`${styles.item} ${!n.is_read ? styles.unread : ""}`}>
                                    <div className={styles.itemTitle}>{n.title}</div>
                                    <div className={styles.itemMsg}>{n.message}</div>
                                    <div className={styles.itemMeta}>
                                        <div className={styles.itemTime}>{new Date(n.created_at).toLocaleTimeString()}</div>
                                        {n.link && (
                                            <a href={n.link} className={styles.contactBtn}>
                                                {activeTab === 'match' ? "👀 View Listing" : "📖 Read Report"}
                                            </a>
                                        )}
                                    </div>
                                </div>
                            ))
                        )}
                    </div>
                </div>
            )}
        </div>
    );
}
