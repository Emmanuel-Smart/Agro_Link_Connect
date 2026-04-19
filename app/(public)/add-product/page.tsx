"use client";

import { useState, ChangeEvent, FormEvent } from "react";
import { supabase } from "@/lib/supabaseClient";
import { useAuth } from "../../context/AuthContext";
import { useRouter } from "next/navigation";

export default function AddProductPage() {
    const { user } = useAuth();
    const router = useRouter();

    const [formData, setFormData] = useState({
        name: "",
        price: "",
        location: "",
        description: "",
    });

    const [image, setImage] = useState<File | null>(null);
    const [preview, setPreview] = useState<string | null>(null);
    const [loading, setLoading] = useState(false);

    // HANDLE INPUT
    const handleChange = (e: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    // HANDLE IMAGE
    const handleImage = (e: ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (!file) return;

        setImage(file);
        setPreview(URL.createObjectURL(file));
    };

    // SUBMIT PRODUCT
    const handleSubmit = async (e: FormEvent) => {
        e.preventDefault();
        if (!user || !image) return alert("Please select image");

        setLoading(true);

        // 1. Upload image
        const fileExt = image.name.split(".").pop();
        const filePath = `${user.id}-${Date.now()}.${fileExt}`;

        const { error: uploadError } = await supabase.storage
            .from("products")
            .upload(filePath, image);

        if (uploadError) {
            alert("Image upload failed");
            setLoading(false);
            return;
        }

        // 2. Save product in DB
        const { error } = await supabase.from("products").insert([
            {
                user_id: user.id,
                name: formData.name,
                price: formData.price,
                location: formData.location,
                description: formData.description,
                image_url: filePath,
            },
        ]);

        setLoading(false);

        if (!error) {
            alert("Product added!");
            router.push("/profile");
        } else {
            alert("Error saving product");
        }
    };

    return (
        <div style={{ padding: 30 }}>
            <h1>Add Product</h1>

            <form onSubmit={handleSubmit} style={{ maxWidth: 400, display: "flex", flexDirection: "column", gap: 10 }}>

                <input
                    name="name"
                    placeholder="Product name (e.g Cocoa)"
                    value={formData.name}
                    onChange={handleChange}
                    required
                />

                <input
                    name="price"
                    placeholder="Price (e.g 5000 FCFA)"
                    value={formData.price}
                    onChange={handleChange}
                    required
                />

                <input
                    name="location"
                    placeholder="Location (e.g Bamenda)"
                    value={formData.location}
                    onChange={handleChange}
                />

                <textarea
                    name="description"
                    placeholder="Describe your product..."
                    value={formData.description}
                    onChange={handleChange}
                />

                <input type="file" accept="image/*" onChange={handleImage} />

                {preview && (
                    <img
                        src={preview}
                        style={{ width: "100%", borderRadius: 10 }}
                    />
                )}

                <button type="submit" disabled={loading}>
                    {loading ? "Uploading..." : "Add Product"}
                </button>
            </form>
        </div>
    );
}