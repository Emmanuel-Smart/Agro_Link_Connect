"use client";

import { usePathname } from "next/navigation";
import PublicNavbar from "../Navbar/Navbar";
import PrivateNavbar from "../PrivateNavbar/privateNavbar";
import { useAuth } from "@/app/context/AuthContext";

export default function NavManager() {
    const auth = useAuth();
    const user = auth?.user;
    const loading = auth?.loading ?? true;
    const pathname = usePathname();

    if (loading) return <div style={{ height: "64px" }} />;

    // Always show PublicNavbar on login/register pages
    if (pathname === "/login" || pathname === "/register") return <PublicNavbar />;

    return user ? <PrivateNavbar /> : <PublicNavbar />;
}
