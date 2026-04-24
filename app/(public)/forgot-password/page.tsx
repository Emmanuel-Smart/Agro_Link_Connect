"use client";

import { useState } from "react";
import { supabase } from "@/lib/supabaseClient";
import styles from "../login/login.module.css";
import Link from "next/link";

export default function ForgotPasswordPage() {
    const [email, setEmail] = useState("");
    const [loading, setLoading] = useState(false);
    const [message, setMessage] = useState("");

    const handleResetRequest = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);
        setMessage("");

        try {
            const { error } = await supabase.auth.resetPasswordForEmail(email, {
                redirectTo: window.location.origin + "/reset-password",
            });

            if (error) throw error;
            setMessage("Check your email for the password reset link!");
        } catch (error: any) {
            alert(error.message);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className={styles.pageBackground}>
            <div className={styles.container}>
                <h2 className={styles.title}>Reset Your Password 🔑</h2>
                <p className={styles.subtitle}>
                    Enter your email address and we'll send you a link to reset your password.
                </p>

                {message ? (
                    <div style={{ textAlign: "center", color: "#16a34a", fontWeight: 700, padding: "20px" }}>
                        {message}
                        <br /><br />
                        <Link href="/login" style={{ color: "#0ea5e9" }}>Back to Login</Link>
                    </div>
                ) : (
                    <form onSubmit={handleResetRequest} className={styles.form}>
                        <div className={styles.formGroup}>
                            <label htmlFor="email">Email Address</label>
                            <input
                                type="email"
                                id="email"
                                placeholder="nsami@email.com"
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                                required
                            />
                        </div>

                        <button type="submit" className={styles.submitBtn} disabled={loading}>
                            {loading ? "Sending..." : "Send Reset Link"}
                        </button>

                        <div style={{ textAlign: "center", marginTop: "20px" }}>
                            <Link href="/login" style={{ fontSize: "0.9rem", color: "#64748b" }}>Back to Login</Link>
                        </div>
                    </form>
                )}
            </div>
        </div>
    );
}
