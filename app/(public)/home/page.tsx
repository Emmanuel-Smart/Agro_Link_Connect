// import Nav from "@/app/components/Nav";
import styles from "./Home.module.css";

export default function HomePage() {
    return (
        <>
            <main className={styles.container}>
                {/* HERO */}
                <section className={styles.hero}>
                    <div className={styles.heroContent}>
                        <h1>Welcome Back To AgroLink</h1>
                        <p>Your agricultural community & tools platform.</p>
                        <button className={styles.heroButton}>Get Started</button>
                    </div>
                </section>
            </main>
        </>
    );
}
