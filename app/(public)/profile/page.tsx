"use client";

import { useEffect, useState, ChangeEvent, FormEvent } from "react";
import { supabase } from "@/lib/supabaseClient";
import { useAuth } from "../../context/AuthContext";
import { useRouter } from "next/navigation";
import styles from "./Profile.module.css";

export default function ProfilePage() {
    const { user } = useAuth();
    const router = useRouter();

    const [profile, setProfile] = useState<any>(null);
    const [loading, setLoading] = useState(true);
    const [isEditing, setIsEditing] = useState(false);

    const [avatarUrl, setAvatarUrl] = useState<string | null>(null);
    const [preview, setPreview] = useState<string | null>(null);

    const [formData, setFormData] = useState({
        full_name: "",
        phone: "",
        whatsapp: "",
        location: "",
        crops: "",
        is_farmer: false,
        is_buyer: false,
        is_provider: false,
    });

    // ================= FETCH PROFILE =================
    useEffect(() => {
        if (!user) return;

        const fetchProfile = async () => {
            const { data } = await supabase
                .from("profiles")
                .select("*")
                .eq("id", user.id)
                .single();

            if (data) {
                setProfile(data);
                setFormData(data);

                if (data.avatar_url) {
                    const { data: img } = supabase.storage
                        .from("avatars")
                        .getPublicUrl(data.avatar_url);

                    setAvatarUrl(img.publicUrl);
                }
            }

            setLoading(false);
        };

        fetchProfile();
    }, [user]);

    // ================= INPUT =================
    const handleChange = (e: any) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleCheckbox = (e: any) => {
        setFormData({ ...formData, [e.target.name]: e.target.checked });
    };

    // ================= AVATAR =================
    const handleAvatarUpload = async (e: ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (!file || !user) return;

        setPreview(URL.createObjectURL(file));

        const path = `${user.id}-${Date.now()}`;

        await supabase.storage
            .from("avatars")
            .upload(path, file, { upsert: true });

        await supabase
            .from("profiles")
            .update({ avatar_url: path })
            .eq("id", user.id);

        const { data } = supabase.storage
            .from("avatars")
            .getPublicUrl(path);

        setAvatarUrl(data.publicUrl);
    };

    // ================= SAVE PROFILE =================
    const handleSubmit = async (e: FormEvent) => {
        e.preventDefault();
        if (!user) return;

        const { data, error } = await supabase
            .from("profiles")
            .upsert({
                id: user.id,
                full_name: formData.full_name,
                phone: formData.phone,
                whatsapp: formData.whatsapp,
                location: formData.location,
                crops: formData.crops,
                is_farmer: formData.is_farmer,
                is_buyer: formData.is_buyer,
                is_provider: formData.is_provider,
                avatar_url: profile?.avatar_url || null,
            })
            .select()
            .single();

        if (!error) {
            setProfile(data);
            setIsEditing(false);
        } else {
            console.log(error);
            alert("Error saving profile");
        }
    };

    if (loading) return <p className={styles.loading}>Loading...</p>;
    if (!user) return <p className={styles.loading}>Login first</p>;

    return (
        <div className={styles.container}>

            {/* ================= SIDEBAR ================= */}
            <aside className={styles.sidebar}>
                {profile && (
                    <>
                        <div className={styles.profileHeader}>

                            {/* AVATAR */}
                            <label className={styles.avatarWrapper}>
                                {preview ? (
                                    <img src={preview} className={styles.avatarImage} />
                                ) : avatarUrl ? (
                                    <img src={avatarUrl} className={styles.avatarImage} />
                                ) : (
                                    <div className={styles.avatarCircle}>
                                        {profile.full_name?.charAt(0)}
                                    </div>
                                )}

                                <div className={styles.avatarOverlay}>Change</div>

                                <input
                                    type="file"
                                    className={styles.fileInput}
                                    onChange={handleAvatarUpload}
                                />
                            </label>

                            <h2 className={styles.profileName}>
                                {profile.full_name}
                            </h2>

                            <p>📍 {profile.location}</p>

                            <p>
                                {profile.is_farmer && "🚜 Farmer "}
                                {profile.is_buyer && "🛒 Buyer "}
                                {profile.is_provider && "📢 Provider"}
                            </p>

                            <p>{profile.crops}</p>
                        </div>

                        {/* ACTIONS */}
                        <div className={styles.actions}>
                            {profile.phone && (
                                <a href={`tel:${profile.phone}`}>📞 Call</a>
                            )}

                            {profile.whatsapp && (
                                <a href={`https://wa.me/${profile.whatsapp}`}>
                                    💬 WhatsApp
                                </a>
                            )}

                            <button onClick={() => setIsEditing(true)}>
                                Edit
                            </button>
                        </div>
                    </>
                )}
            </aside>

            {/* ================= MAIN ================= */}
            <main className={styles.main}>

                {/* PRODUCT DASHBOARD */}
                {profile && !isEditing && (
                    <>
                        <div className={styles.header}>
                            <h1>My Products</h1>

                            <button
                                className={styles.addBtn}
                                onClick={() => router.push("/add-product")}
                            >
                                + Add Product
                            </button>
                        </div>

                        <div className={styles.grid}>
                            <p>No products yet</p>
                        </div>
                    </>
                )}

                {/* PROFILE FORM */}
                {(!profile || isEditing) && (
                    <div className={styles.formCard}>
                        <h1>Create / Edit Profile</h1>

                        <form className={styles.form} onSubmit={handleSubmit}>

                            <input
                                name="full_name"
                                placeholder="Full Name (Nsami Emmanuel)"
                                value={formData.full_name}
                                onChange={handleChange}
                                required
                            />

                            <input
                                name="phone"
                                placeholder="Contact Number"
                                value={formData.phone}
                                onChange={handleChange}
                            />

                            <input
                                name="whatsapp"
                                placeholder="WhatsApp Number"
                                value={formData.whatsapp}
                                onChange={handleChange}
                            />

                            <input
                                name="location"
                                placeholder="Location (Mile 8, Mankon)"
                                value={formData.location}
                                onChange={handleChange}
                            />

                            <input
                                name="crops"
                                placeholder="Crops (Maize, Beans)"
                                value={formData.crops}
                                onChange={handleChange}
                            />

                            {/* ROLES */}
                            <label>
                                <input
                                    type="checkbox"
                                    name="is_farmer"
                                    checked={formData.is_farmer}
                                    onChange={handleCheckbox}
                                />
                                Farmer
                            </label>

                            <label>
                                <input
                                    type="checkbox"
                                    name="is_buyer"
                                    checked={formData.is_buyer}
                                    onChange={handleCheckbox}
                                />
                                Buyer
                            </label>

                            <label>
                                <input
                                    type="checkbox"
                                    name="is_provider"
                                    checked={formData.is_provider}
                                    onChange={handleCheckbox}
                                />
                                Provider
                            </label>

                            <button type="submit">
                                Save Profile
                            </button>

                            {profile && (
                                <button
                                    type="button"
                                    onClick={() => setIsEditing(false)}
                                >
                                    Cancel
                                </button>
                            )}
                        </form>
                    </div>
                )}
            </main>
        </div>
    );
}