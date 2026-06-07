"use client";

import { createContext, useContext, useState, useEffect, ReactNode } from "react";
import { supabase } from "@/lib/supabaseClient";
import { User } from "@supabase/supabase-js";

interface AuthContextType {
    user: User | null;
    loading: boolean;
}

const AuthContext = createContext<AuthContextType>({ user: null, loading: true });

export const AuthProvider = ({ children }: { children: ReactNode }) => {
    const [user, setUser] = useState<User | null>(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        let mounted = true;

        const checkUser = async () => {
            try {
                const { data: { user }, error } = await supabase.auth.getUser();
                if (error) {
                    // Supabase already clears local session if the refresh token is truly invalid.
                    // We don't need to explicitly call signOut() which might trigger another API error.
                    if (mounted) setUser(null);
                } else {
                    if (mounted) setUser(user);
                }
            } catch (err) {
                // Ignore unexpected errors quietly
                if (mounted) setUser(null);
            } finally {
                if (mounted) setLoading(false);
            }
        };

        checkUser();

        const { data: listener } = supabase.auth.onAuthStateChange((_event, session) => {
            if (mounted) {
                setUser(session?.user || null);
                setLoading(false);
            }
        });

        return () => {
            mounted = false;
            listener.subscription.unsubscribe();
        };
    }, []);

    return (
        <AuthContext.Provider value={{ user, loading }}>
            {children}
        </AuthContext.Provider>
    );
};

export const useAuth = () => useContext(AuthContext);
