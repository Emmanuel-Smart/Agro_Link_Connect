"use client";

import { useEffect, useState, ChangeEvent, FormEvent } from "react";
import { supabase } from "@/lib/supabaseClient";
import { useAuth } from "../../context/AuthContext";
import { useRouter } from "next/navigation";
import styles from "./Profile.module.css";

type Profile = {
    id: string;
    name: string;
    phone: string;
    location: string;
    farm_name: string;
    bio: string;
    avatar_url?: string;
};

export default function ProfilePage() {
    const { user } = useAuth();
    const router = useRouter();

    const [profile, setProfile] = useState<Profile | null>(null);
    const [products, setProducts] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);
    const [isEditing, setIsEditing] = useState(false);

    const [avatarUrl, setAvatarUrl] = useState<string | null>(null);
    const [preview, setPreview] = useState<string | null>(null);

    const [formData, setFormData] = useState({
        name: "",
        phone: "",
        location: "",
        farm_name: "",
        bio: "",
    });

    // ================= FETCH PROFILE + PRODUCTS =================
    useEffect(() => {
        if (!user) return;

        const loadData = async () => {
            setLoading(true);

            // PROFILE
            const { data: profileData } = await supabase
                .from("profiles")
                .select("*")
                .eq("id", user.id)
                .maybeSingle();

            if (profileData) {
                setProfile(profileData);
                setFormData(profileData);

                if (profileData.avatar_url) {
                    const { data } = supabase.storage
                        .from("avatars")
                        .getPublicUrl(profileData.avatar_url);

                    setAvatarUrl(data.publicUrl);
                }
            }

            // PRODUCTS
            const { data: productData } = await supabase
                .from("products")
                .select("*")
                .eq("user_id", user.id);

            if (productData) {
                const mapped = productData.map((p) => {
                    const { data } = supabase.storage
                        .from("products")
                        .getPublicUrl(p.image_url);

                    return {
                        ...p,
                        image: data.publicUrl,
                    };
                });

                setProducts(mapped);
            }

            setLoading(false);
        };

        loadData();
    }, [user]);

    // ================= INPUT =================
    const handleChange = (
        e: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
    ) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    // ================= AVATAR =================
    const handleAvatarUpload = async (e: ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (!file || !user) return;

        setPreview(URL.createObjectURL(file));

        const ext = file.name.split(".").pop();
        const filePath = `${user.id}.${ext}`;

        await supabase.storage
            .from("avatars")
            .upload(filePath, file, { upsert: true });

        await supabase
            .from("profiles")
            .update({ avatar_url: filePath })
            .eq("id", user.id);

        const { data } = supabase.storage
            .from("avatars")
            .getPublicUrl(filePath);

        setAvatarUrl(data.publicUrl);

        setProfile((prev) =>
            prev ? { ...prev, avatar_url: filePath } : prev
        );
    };

    // ================= CREATE =================
    const handleSubmit = async (e: FormEvent) => {
        e.preventDefault();
        if (!user) return;

        const { data } = await supabase
            .from("profiles")
            .insert([
                {
                    id: user.id,
                    ...formData,
                    avatar_url: avatarUrl ? profile?.avatar_url : null,
                },
            ])
            .select()
            .single();

        if (data) setProfile(data);
    };

    // ================= UPDATE =================
    const handleUpdate = async (e: FormEvent) => {
        e.preventDefault();
        if (!user) return;

        const { data } = await supabase
            .from("profiles")
            .update({
                ...formData,
                avatar_url: profile?.avatar_url || null,
            })
            .eq("id", user.id)
            .select()
            .single();

        if (data) {
            setProfile(data);
            setIsEditing(false);
        }
    };

    // ================= DELETE =================
    const handleDelete = async () => {
        if (!user) return;
        if (!confirm("Delete profile?")) return;

        await supabase.from("profiles").delete().eq("id", user.id);
        setProfile(null);
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
                            <label className={styles.avatarWrapper}>
                                {preview ? (
                                    <img src={preview} className={styles.avatarImage} />
                                ) : avatarUrl ? (
                                    <img src={avatarUrl} className={styles.avatarImage} />
                                ) : (
                                    <div className={styles.avatarCircle}>
                                        {profile.name.charAt(0)}
                                    </div>
                                )}

                                <div className={styles.avatarOverlay}>
                                    Change Photo
                                </div>

                                <input
                                    type="file"
                                    accept="image/*"
                                    className={styles.fileInput}
                                    onChange={handleAvatarUpload}
                                />
                            </label>

                            <h2 className={styles.profileName}>{profile.name}</h2>

                            {profile.farm_name && (
                                <p className={styles.profileFarm}>
                                    🌿 {profile.farm_name}
                                </p>
                            )}
                        </div>

                        <div className={styles.profileDetails}>
                            <p>📞 {profile.phone}</p>
                            <p>📍 {profile.location}</p>
                        </div>

                        {profile.bio && (
                            <p className={styles.profileBio}>{profile.bio}</p>
                        )}

                        <div className={styles.actions}>
                            <a href={`tel:${profile.phone}`}>📞 Call</a>
                            <a href={`https://wa.me/${profile.phone}`}>💬 WhatsApp</a>

                            <button onClick={() => setIsEditing(true)}>
                                Edit
                            </button>

                            <button onClick={handleDelete}>
                                Delete
                            </button>
                        </div>
                    </>
                )}
            </aside>

            {/* ================= MAIN ================= */}
            <main className={styles.main}>
                {profile && !isEditing ? (
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
                            {products.length === 0 ? (
                                <p>No products yet</p>
                            ) : (
                                products.map((p) => (
                                    <div key={p.id} className={styles.card}>
                                        <img
                                            src={p.image}
                                            style={{
                                                width: "100%",
                                                height: 150,
                                                objectFit: "cover",
                                                borderRadius: 10,
                                            }}
                                        />
                                        <h3>{p.name}</h3>
                                        <p>{p.price}</p>
                                        <p>{p.location}</p>
                                    </div>
                                ))
                            )}
                        </div>
                    </>
                ) : (
                    <div className={styles.formCard}>
                        <h1 className={styles.formTitle}>
                            {profile ? "Edit Profile" : "Create Profile"}
                        </h1>

                        <form
                            className={styles.form}
                            onSubmit={profile ? handleUpdate : handleSubmit}
                        >
                            <input
                                name="name"
                                placeholder="Full Name"
                                value={formData.name}
                                onChange={handleChange}
                                required
                            />

                            <input
                                name="phone"
                                placeholder="Phone"
                                value={formData.phone}
                                onChange={handleChange}
                                required
                            />

                            <input
                                name="location"
                                placeholder="Location"
                                value={formData.location}
                                onChange={handleChange}
                            />

                            <input
                                name="farm_name"
                                placeholder="Farm Name"
                                value={formData.farm_name}
                                onChange={handleChange}
                            />

                            <textarea
                                name="bio"
                                placeholder="Bio"
                                value={formData.bio}
                                onChange={handleChange}
                            />

                            <button type="submit">
                                {profile ? "Update Profile" : "Create Profile"}
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