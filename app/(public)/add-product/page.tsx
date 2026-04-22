"use client";

import { useState, ChangeEvent, FormEvent } from "react";
import { supabase } from "@/lib/supabaseClient";
import { useAuth } from "../../context/AuthContext";
import { useRouter } from "next/navigation";
import styles from "./AddProduct.module.css";

export default function AddProductPage() {
    const { user } = useAuth();
    const router = useRouter();

    const [loading, setLoading] = useState(false);

    const [formData, setFormData] = useState({
        crop_type: "",
        price: "",
        quantity: "",
        unit: "Bag",
        location: "",
        description: "",
        harvest_status: "ready",
        is_perishable: false,
    });

    const [imageFile, setImageFile] = useState<File | null>(null);
    const [preview, setPreview] = useState<string | null>(null);

    // INPUT CHANGE
    const handleChange = (
        e: ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>
    ) => {
        const { name, value, type } = e.target;

        if (type === "checkbox") {
            setFormData({
                ...formData,
                [name]: (e.target as HTMLInputElement).checked,
            });
        } else {
            setFormData({ ...formData, [name]: value });
        }
    };

    // IMAGE
    const handleImageChange = (e: ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (!file) return;

        setImageFile(file);
        setPreview(URL.createObjectURL(file));
    };

    const removeImage = () => {
        setImageFile(null);
        setPreview(null);
    };

    // SUBMIT
    const handleSubmit = async (e: FormEvent) => {
        e.preventDefault();
        if (!user) return alert("Login first");

        setLoading(true);

        let imagePath = null;

        // UPLOAD IMAGE
        if (imageFile) {
            const fileExt = imageFile.name.split(".").pop();
            const fileName = `${user.id}-${Date.now()}.${fileExt}`;

            const { error: uploadError } = await supabase.storage
                .from("products")
                .upload(fileName, imageFile, { upsert: true });

            if (uploadError) {
                alert("Image upload failed");
                setLoading(false);
                return;
            }

            imagePath = fileName;
        }

        // INSERT DATA
        const { error } = await supabase.from("products").insert([
            {
                user_id: user.id,
                crop_type: formData.crop_type,
                price: Number(formData.price),
                quantity: Number(formData.quantity),
                unit: formData.unit,
                location: formData.location,
                description: formData.description,
                harvest_status: formData.harvest_status,
                is_perishable: formData.is_perishable,
                image_url: imagePath,
            },
        ]);

        setLoading(false);

        if (error) {
            console.error(error);
            alert("Error adding product");
        } else {
            alert("Product added successfully");
            router.push("/profile");
        }
    };

    return (
        <div className={styles.container}>
            <h1>Add Product</h1>

            <form className={styles.form} onSubmit={handleSubmit}>

                {/* CROP */}
                <select name="crop_type" onChange={handleChange} required>
                    <option value="">Select Crop</option>
                    <option>Maize</option>
                    <option>Beans</option>
                    <option>Potatoes</option>
                    <option>Vegetables</option>
                </select>

                {/* PRICE */}
                <input
                    name="price"
                    type="number"
                    placeholder="Price (FCFA)"
                    onChange={handleChange}
                    required
                />

                {/* QUANTITY */}
                <input
                    name="quantity"
                    type="number"
                    placeholder="Quantity (e.g 10)"
                    onChange={handleChange}
                    required
                />

                {/* UNIT */}
                <select name="unit" onChange={handleChange}>
                    <option>Bag</option>
                    <option>Bucket</option>
                    <option>Kg</option>
                    <option>Crate</option>
                </select>

                {/* LOCATION */}
                <input
                    name="location"
                    placeholder="Location (e.g Mile 8)"
                    onChange={handleChange}
                />

                {/* HARVEST STATUS */}
                <select name="harvest_status" onChange={handleChange}>
                    <option value="ready">Ready Now</option>
                    <option value="pre">Pre-Harvest</option>
                </select>

                {/* PERISHABLE */}
                <label>
                    <input
                        type="checkbox"
                        name="is_perishable"
                        onChange={handleChange}
                    />
                    Perishable (e.g Tomatoes)
                </label>

                {/* DESCRIPTION */}
                <textarea
                    name="description"
                    placeholder="Describe your product..."
                    onChange={handleChange}
                />

                {/* IMAGE */}
                <input type="file" accept="image/*" onChange={handleImageChange} />

                {preview && (
                    <div>
                        <img src={preview} className={styles.preview} />
                        <button type="button" onClick={removeImage}>
                            Remove Image
                        </button>
                    </div>
                )}

                {/* SUBMIT */}
                <button type="submit" disabled={loading}>
                    {loading ? "Adding..." : "Add Product"}
                </button>
            </form>
        </div>
    );
}