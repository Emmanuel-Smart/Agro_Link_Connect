"use client";
import { supabase } from "@/lib/supabaseClient";
import { useState } from "react";
import styles from "./Register.module.css";
import { useRouter } from "next/navigation";
import { Eye, EyeOff, CheckCircle2, X } from "lucide-react";


export default function RegisterPage() {
    const router = useRouter();
    const [form, setForm] = useState({
        name: "",
        email: "",
        password: "",
    });
    const [showPassword, setShowPassword] = useState(false);
    const [modalState, setModalState] = useState<{show: boolean, type: 'success' | 'error', message: string}>({show: false, type: 'success', message: ''});

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setForm({ ...form, [e.target.name]: e.target.value });
    };

    // Email/password registration
    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        try {
            const { data, error } = await supabase.auth.signUp({
                email: form.email,
                password: form.password,
                options: {
                    data: {
                        full_name: form.name,
                    },
                },
            });

            if (error) throw error;
            console.log("User registered:", data);
            
            setModalState({ show: true, type: 'success', message: "Signup successful! You can now log into your account." });
            
            // We won't redirect immediately so the user can see the modal and click "Go to Login"
        } catch (error: any) {
            setModalState({ show: true, type: 'error', message: error.message });
        }
    };


    return (
        <div className={styles.pageBackground}>
            <div className={styles.container}>
                <h2 className={styles.title}>Create an AgroLink Account</h2>
                <p className={styles.subtitle}>
                    Join our marketplace for farmers, buyers, and logistics partners.
                </p>

                <form onSubmit={handleSubmit} className={styles.form}>
                    <div className={styles.formGroup}>
                        <label htmlFor="name">Full Name</label>
                        <input
                            type="text"
                            id="name"
                            name="name"
                            placeholder="Nsami"
                            value={form.name}
                            onChange={handleChange}
                            required
                        />
                    </div>

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
                    </div>

                    <button type="submit" className={styles.submitBtn}>
                        Register
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
                        <h3>{modalState.type === 'error' ? 'Registration Failed' : 'Success!'}</h3>
                        <p>{modalState.message}</p>
                        <div className={styles.authModalActions}>
                            {modalState.type === 'success' ? (
                                <button className={styles.btnModalPrimary} onClick={() => router.push("/login")}>
                                    Go to Login
                                </button>
                            ) : (
                                <button className={styles.btnModalPrimary} onClick={() => setModalState({...modalState, show: false})}>
                                    Try Again
                                </button>
                            )}
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}
