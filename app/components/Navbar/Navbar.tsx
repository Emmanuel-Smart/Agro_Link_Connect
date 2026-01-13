import Link from "next/link";
import styles from "./Navbar.module.css";

export default function Navbar() {
    return (
        <nav className={styles.navbar}>
            <h1 className={styles.logo}>AgroLink</h1>
            <ul className={styles.menu}>
                <li><Link href="/">Home</Link></li>
                <li><Link href="/register">Register</Link></li>
                <li><Link href="/login">Login</Link></li>
            </ul>
        </nav>
    );
}
