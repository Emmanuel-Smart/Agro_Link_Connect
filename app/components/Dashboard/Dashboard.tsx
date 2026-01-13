"use client";

import styles from "./Dashboard.module.css";
import { useRouter } from "next/navigation";
// import Nav from "@/app/components/Nav";

export default function Dashboard() {
    const router = useRouter();

    // Sample crop data
    const crops = [
        { name: "Cocoa", price: "$2000/ton", region: "North" },
        { name: "Cotton", price: "$1500/ton", region: "East" },
        { name: "Rubber", price: "$1800/ton", region: "South" },
        { name: "Maize", price: "$1200/ton", region: "West" },
        { name: "Wheat", price: "$1100/ton", region: "Central" },
        { name: "Coffee", price: "$2500/ton", region: "North-East" },
        { name: "Rice", price: "$1400/ton", region: "South-West" },
        { name: "Soybeans", price: "$1300/ton", region: "North-West" },
        { name: "Banana", price: "$900/ton", region: "Central-East" },
        { name: "Palm Oil", price: "$1700/ton", region: "South-East" },
    ];

    const weather = [
        { region: "North", temp: "28°C", condition: "Sunny" },
        { region: "East", temp: "26°C", condition: "Rainy" },
        { region: "South", temp: "30°C", condition: "Sunny" },
        { region: "West", temp: "27°C", condition: "Cloudy" },
    ];

    return (
        <>
            <main className={styles.container}>
                {/* HERO SECTION */}
                <section className={styles.hero}>
                    <div className={styles.heroContent}>
                        <h1>Welcome to AgroLink 🌾</h1>
                        <p>Connecting Farmers, Buyers, and Logistics Partners Directly.</p>
                        <div className={styles.buttonGroup}>
                            <button
                                className={styles.registerBtn}
                                onClick={() => router.push("/register")}
                            >
                                Register
                            </button>
                            <button
                                className={styles.loginBtn}
                                onClick={() => router.push("/login")}
                            >
                                Login
                            </button>
                        </div>
                    </div>
                </section>

                {/* CROPS SECTION */}
                <section className={styles.cropsSection}>
                    <h2>Crop Rates Across 10 Regions</h2>
                    <div className={styles.cropsGrid}>
                        {crops.map((crop, idx) => (
                            <div key={idx} className={styles.cropCard}>
                                <h3>{crop.name}</h3>
                                <p>Region: {crop.region}</p>
                                <p>Price: {crop.price}</p>
                            </div>
                        ))}
                    </div>
                </section>

                {/* WEATHER SECTION */}
                <section className={styles.weatherSection}>
                    <h2>Weather Updates</h2>
                    <div className={styles.weatherGrid}>
                        {weather.map((w, idx) => (
                            <div key={idx} className={styles.weatherCard}>
                                <h3>{w.region}</h3>
                                <p>Temperature: {w.temp}</p>
                                <p>Condition: {w.condition}</p>
                            </div>
                        ))}
                    </div>
                </section>

                {/* COMMUNITY SECTION */}
                <section className={styles.communitySection}>
                    <h2>Farmers, Buyers & Logistics</h2>
                    <div className={styles.communityGrid}>
                        <div className={styles.communityCard}>
                            <h3>Farmers</h3>
                            <p>Connect with local farmers and share best practices.</p>
                            <button>Explore Farmers</button>
                        </div>
                        <div className={styles.communityCard}>
                            <h3>Buyers</h3>
                            <p>Find trusted buyers and manage orders efficiently.</p>
                            <button>Explore Buyers</button>
                        </div>
                        <div className={styles.communityCard}>
                            <h3>Logistics</h3>
                            <p>Access transportation and storage solutions for your crops.</p>
                            <button>Explore Logistics</button>
                        </div>
                    </div>
                </section>
            </main>
        </>
    );
}
