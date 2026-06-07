"use client";

import { useState } from "react";
import styles from "./login.module.css";
import { useRouter } from "next/navigation";
import { supabase } from "@/lib/supabaseClient";
import Link from "next/link";
import { Sprout, Eye, EyeOff, CheckCircle2, X } from "lucide-react";

export default function LoginPage() {

    const router = useRouter();

    const [form, setForm] = useState({
        email: "",
        password: "",
    });
    const [showPassword, setShowPassword] = useState(false);
    const [modalState, setModalState] = useState<{show: boolean, type: 'success' | 'error', message: string}>({show: false, type: 'success', message: ''});

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setForm({ ...form, [e.target.name]: e.target.value });
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        try {
            const { data, error } = await supabase.auth.signInWithPassword({
                email: form.email,
                password: form.password,
            });

            if (error) throw error;

            console.log("Login successful:", data);
            router.push("/home");
        } catch (error: any) {
            setModalState({ show: true, type: 'error', message: error.message });
        }
    };





    return (
        <div className={styles.pageBackground}>
            <div className={styles.container}>
                <h2 className={styles.title} style={{ display: "flex", alignItems: "center", justifyContent: "center", gap: "8px" }}>
                    Welcome Back to AgroLink <Sprout size={24} style={{ color: "#22c55e" }} />
                </h2>
                <p className={styles.subtitle}>
                    Log in to access your dashboard and manage your farm marketplace.
                </p>

                <form onSubmit={handleSubmit} className={styles.form}>
                    <div className={styles.formGroup}>
                        <label htmlFor="email">Email Address</label>
                        <input
                            type="email"
                            id="email"
                            name="email"
                            placeholder="nsami@email.com"
                            value={form.email}
                            onChange={handleChange}
                            required
                        />
                    </div>

                    <div className={styles.formGroup}>
                        <label htmlFor="password">Password</label>
                        <div className={styles.passwordInputWrapper}>
                            <input
                                type={showPassword ? "text" : "password"}
                                id="password"
                                name="password"
                                placeholder="••••••••"
                                className={styles.passwordInput}
                                value={form.password}
                                onChange={handleChange}
                                required
                            />
                            <button 
                                type="button" 
                                className={styles.passwordToggleBtn}
                                onClick={() => setShowPassword(!showPassword)}
                                tabIndex={-1}
                            >
                                {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                            </button>
                        </div>
                        <Link href="/forgot-password" className={styles.forgotLink}>Forgot Password?</Link>
                    </div>

                    <button type="submit" className={styles.submitBtn}>
                        Login
                    </button>
                </form>
            </div>

            {/* Custom Modal */}
            {modalState.show && (
                <div className={styles.modalOverlay}>
                    <div className={styles.authModal}>
                        <div className={`${styles.authModalIcon} ${modalState.type === 'error' ? styles.authModalIconError : ''}`}>
                            {modalState.type === 'error' ? <X size={32} /> : <CheckCircle2 size={32} />}
                        </div>
                        <h3>{modalState.type === 'error' ? 'Login Failed' : 'Success!'}</h3>
                        <p>{modalState.message}</p>
                        <div className={styles.authModalActions}>
                            <button className={styles.btnModalPrimary} onClick={() => setModalState({...modalState, show: false})}>
                                Try Again
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}
