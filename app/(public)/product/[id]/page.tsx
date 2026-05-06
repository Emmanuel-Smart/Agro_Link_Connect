
"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { supabase } from "@/lib/supabaseClient";
import Link from "next/link";
import styles from "./ProductDetails.module.css";
import Footer from "../../../components/Footer/Footer";

export default function ProductDetailsPage() {
    const { id } = useParams();
    const router = useRouter();
    const [product, setProduct] = useState<any>(null);
    const [seller, setSeller] = useState<any>(null);
    const [moreProducts, setMoreProducts] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);
    const [activeImage, setActiveImage] = useState<string | null>(null);

    useEffect(() => {
        if (!id) return;

        const fetchProductData = async () => {
            setLoading(true);
            
            // 1. Fetch Product
            const { data: productData, error: productError } = await supabase
                .from("products")
                .select("*")
                .eq("id", id)
                .single();

            if (productError || !productData) {
                console.error("Error fetching product:", productError);
                setLoading(false);
                return;
            }

            setProduct(productData);
            setActiveImage(productData.image_url);

            // 2. Fetch Seller Profile
            const { data: sellerData, error: sellerError } = await supabase
                .from("profiles")
                .select("*")
                .eq("id", productData.user_id)
                .single();

            if (sellerData) {
                setSeller(sellerData);
            }

            // 3. Fetch More from this Seller
            const { data: moreData } = await supabase
                .from("products")
                .select("*")
                .eq("user_id", productData.user_id)
                .neq("id", id) // exclude current
                .limit(4);

            if (moreData) {
                setMoreProducts(moreData);
            }

            setLoading(false);
        };

        fetchProductData();
    }, [id]);

    if (loading) return <div className={styles.loading}>🔍 Securing Harvest Data...</div>;
    if (!product) return <div className={styles.container}><h1>Product not found</h1><Link href="/home">Return to Marketplace</Link></div>;

    return (
        <main className={styles.container}>
            <Link href="/home" className={styles.backBtn}>
                ← Back to Marketplace
            </Link>

            <div className={styles.productLayout}>
                {/* LEFT COLUMN */}
                <div className={styles.mainContent}>
                    <div className={styles.imageSection}>
                        <img 
                            src={activeImage || "https://images.unsplash.com/photo-1500382017468-9049fed747ef?auto=format&fit=crop&w=800&q=80"} 
                            alt={product.crop} 
                            className={styles.mainImage} 
                        />
                        
                        {product.gallery_urls && product.gallery_urls.length > 1 && (
                            <div className={styles.thumbnailGallery}>
                                {product.gallery_urls.map((url: string, idx: number) => (
                                    <div 
                                        key={idx} 
                                        className={`${styles.thumbnail} ${activeImage === url ? styles.activeThumbnail : ''}`}
                                        onClick={() => setActiveImage(url)}
                                    >
                                        <img src={url} alt={`View ${idx}`} />
                                    </div>
                                ))}
                            </div>
                        )}
                    </div>

                    <div className={styles.productHeader}>
                        <h1>{product.crop}</h1>
                        <div className={styles.badges}>
                            <span className={`${styles.badge} ${styles.categoryBadge}`}>{product.category}</span>
                            <span className={`${styles.badge} ${styles.locationBadge}`}>📍 {product.location}</span>
                        </div>
                    </div>

                    <div className={styles.description}>
                        <h2>Product Description</h2>
                        <p>{product.description || "No detailed description provided for this listing."}</p>
                    </div>
                </div>

                {/* RIGHT COLUMN */}
                <aside className={styles.sidebar}>
                    <div className={styles.priceCard}>
                        <div className={styles.priceLabel}>Current Market Listing</div>
                        <div className={styles.priceValue}>
                            {Number(product.price).toLocaleString()} <span>FCFA / {product.unit}</span>
                        </div>

                        <div className={styles.statsGrid}>
                            <div className={styles.statItem}>
                                <span className={styles.statLabel}>Available</span>
                                <span className={styles.statValue}>{product.quantity} Units</span>
                            </div>
                            <div className={styles.statItem}>
                                <span className={styles.statLabel}>Quality</span>
                                <span className={styles.statValue}>{product.is_perishable ? "Perishable" : "Storable"}</span>
                            </div>
                        </div>

                        <div className={styles.actionButtons}>
                            {seller?.whatsapp && (
                                <a 
                                    href={`https://wa.me/${seller.whatsapp}`} 
                                    target="_blank" 
                                    className={styles.btnWa}
                                >
                                    💬 Contact via WhatsApp
                                </a>
                            )}
                            {seller?.phone && (
                                <a 
                                    href={`tel:${seller.phone}`} 
                                    className={styles.btnCall}
                                >
                                    📞 Call Farmer Direct
                                </a>
                            )}
                        </div>
                    </div>

                    {seller && (
                        <div className={styles.sellerCard}>
                            <div className={styles.sellerInfo}>
                                <div className={styles.sellerAvatar}>
                                    {seller.full_name?.charAt(0)}
                                </div>
                                <div className={styles.sellerMeta}>
                                    <h3>{seller.full_name}</h3>
                                    <div className={styles.sellerLocation}>📍 Based in {seller.location}</div>
                                    {seller.is_approved_provider && (
                                        <div className={styles.verifiedBadge}>🛡️ Verified Source</div>
                                    )}
                                </div>
                            </div>
                            <p style={{fontSize: '0.85rem', color: '#64748b', lineHeight: 1.6}}>
                                Trusted member of the AgroLink community. View their full catalog below.
                            </p>
                        </div>
                    )}
                </aside>
            </div>

            {/* MORE FROM SELLER */}
            {moreProducts.length > 0 && (
                <section className={styles.moreSection}>
                    <h2>More from this Farmer</h2>
                    <div className={styles.moreGrid}>
                        {moreProducts.map(item => (
                            <Link href={`/product/${item.id}`} key={item.id} style={{textDecoration: 'none'}}>
                                <div className={styles.miniCard} style={{background: '#fff', borderRadius: '16px', overflow: 'hidden', border: '1px solid #f1f5f9'}}>
                                    <img 
                                        src={item.image_url || "https://images.unsplash.com/photo-1500382017468-9049fed747ef?auto=format&fit=crop&w=400&q=80"} 
                                        style={{width: '100%', height: '150px', objectFit: 'cover'}} 
                                        alt={item.crop}
                                    />
                                    <div style={{padding: '12px'}}>
                                        <h4 style={{margin: '0 0 4px', color: '#0f172a'}}>{item.crop}</h4>
                                        <div style={{color: '#15803d', fontWeight: 800, fontSize: '0.9rem'}}>
                                            {Number(item.price).toLocaleString()} FCFA
                                        </div>
                                    </div>
                                </div>
                            </Link>
                        ))}
                    </div>
                </section>
            )}

            <Footer />
        </main>
    );
}
