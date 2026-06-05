"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { Home, PlusCircle, Bell, User } from "lucide-react";
import styles from "./BottomNav.module.css";
import { useAuth } from "@/app/context/AuthContext";

export default function BottomNav() {
    const pathname = usePathname();
    const { user } = useAuth();

    // Do not show on unauthenticated or specific pages where it might conflict
    if (!user || pathname === "/login" || pathname === "/register" || pathname === "/") return null;

    const navItems = [
        { path: "/home", label: "Home", icon: Home },
        { path: "/add-product", label: "Sell", icon: PlusCircle },
        { path: "/news", label: "News", icon: Bell },
        { path: "/profile", label: "Profile", icon: User }
    ];

    return (
        <nav className={styles.bottomNav}>
            {navItems.map((item) => {
                const Icon = item.icon;
                const isActive = pathname === item.path || pathname.startsWith(item.path + "/");
                
                return (
                    <Link 
                        href={item.path} 
                        key={item.path}
                        className={`${styles.navItem} ${isActive ? styles.active : ""}`}
                    >
                        <div className={styles.iconWrapper}>
                            <Icon size={24} strokeWidth={isActive ? 2.5 : 2} />
                            {isActive && <div className={styles.activeDot} />}
                        </div>
                        <span className={styles.label}>{item.label}</span>
                    </Link>
                );
            })}
        </nav>
    );
}
