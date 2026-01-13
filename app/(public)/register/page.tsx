"use client";
import { supabase } from "@/lib/supabaseClient";
import { useState } from "react";
import styles from "./Register.module.css";
import { useRouter } from "next/navigation";


export default function RegisterPage() {
    const router = useRouter();
    const [form, setForm] = useState({
        name: "",
        email: "",
        password: "",
    });

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
            alert("Signup successful! Please login.");

            // <-- REDIRECT TO LOGIN PAGE
            router.push("/login");
        } catch (error: any) {
            alert(error.message);
        }
    };

    // Google OAuth registration/sign-in
    const handleGoogleSignIn = async () => {
        try {
            const { data, error } = await supabase.auth.signInWithOAuth({
                provider: "google",
            });
            if (error) throw error;
            console.log("Redirecting to Google OAuth...");
        } catch (error: any) {
            alert(error.message);
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
                        <input
                            type="password"
                            id="password"
                            name="password"
                            placeholder="••••••••"
                            value={form.password}
                            onChange={handleChange}
                            required
                        />
                    </div>

                    <button type="submit" className={styles.submitBtn}>
                        Register
                    </button>
                </form>

                <div className={styles.divider}>
                    <span>OR</span>
                </div>

                <button onClick={handleGoogleSignIn} className={styles.googleBtn}>
                    <img
                        src="/google-icon.svg"
                        alt="Google"
                        className={styles.googleIcon}
                    />
                    Sign in with Google
                </button>
            </div>
        </div>
    );
}
