"use client";

import { useState } from "react";
import styles from "./login.module.css";
import { useRouter } from "next/navigation";
import { supabase } from "@/lib/supabaseClient";



export default function LoginPage() {

    const router = useRouter();

    const [form, setForm] = useState({
        email: "",
        password: "",
    });

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

            // Redirect to dashboard/home page
            router.push("/home"); // or "/home" if your file is pages/home/page.tsx
        } catch (error: any) {
            alert(error.message);
        }
    };


    const handleGoogleSignIn = async () => {
        try {
            const { data, error } = await supabase.auth.signInWithOAuth({
                provider: "google",
            });
            if (error) throw error;

            // The user will be redirected to Supabase's OAuth callback URL
            // After callback, you can also redirect them to dashboard if needed
        } catch (error: any) {
            alert(error.message);
        }
    };


    return (
        <div className={styles.pageBackground}>
            <div className={styles.container}>
                <h2 className={styles.title}>Welcome Back to AgroLink 🌾</h2>
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
                        Login
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
