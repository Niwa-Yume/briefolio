import { createContext, useContext, useEffect, useState } from "react";
import { supabase } from "@/lib/supabase";
import { User } from "@supabase/supabase-js";
import { useNavigate } from "react-router-dom";

type AuthContextType = {
  user: User | null;
  loading: boolean;
  error: string | null;
  login: (email: string, password: string) => Promise<void>;
  register: (email: string, password: string) => Promise<void>;
  loginWithProvider: (provider: "google" | "github") => Promise<void>;
  logout: () => Promise<void>;
  justSignedIn: boolean;
  setJustSignedIn: (v: boolean) => void;
};

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider = ({ children }: { children: React.ReactNode }) => {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [justSignedIn, setJustSignedIn] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    const getSession = async () => {
      const { data: { session } } = await supabase.auth.getSession();
      setUser(session?.user ?? null);
      setLoading(false);
    };
    getSession();

    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      async (event, session) => {
        if (event === "SIGNED_IN" && session?.user) {
          setUser(session.user);
          setJustSignedIn(true); // Marque qu'on vient de se connecter
        } else if (event === "SIGNED_OUT") {
          setUser(null);
          setJustSignedIn(false);
          navigate("/login");
        }
      }
    );
    return () => subscription.unsubscribe();
  }, [navigate]);

  // Inscription email/mot de passed
  const register = async (email: string, password: string): Promise<void> => {
    setLoading(true);
    setError(null);
    const { error } = await supabase.auth.signUp({
      email,
      password,
      options: {
        data: { needs_profile_completion: true }
      }
    });
    setLoading(false);
    if (error) throw error;
  };

  // Connexion email/mot de passe
  const login = async (email: string, password: string) => {
    setLoading(true);
    setError(null);
    const { error } = await supabase.auth.signInWithPassword({ email, password });
    setLoading(false);
    if (error) throw error;
  };

  // Connexion via Google ou GitHub
  const loginWithProvider = async (provider: "google" | "github") => {
    setLoading(true);
    setError(null);
    const { error } = await supabase.auth.signInWithOAuth({
      provider,
      options: {
        // On retire le redirectTo pour gérer la redirection nous-mêmes
        queryParams: {
          access_type: 'offline',
          prompt: 'consent',
        }
      }
    });
    setLoading(false);
    if (error) throw error;
  };

  // Déconnexion
  const logout = async () => {
    setLoading(true);
    setError(null);
    await supabase.auth.signOut();
    setLoading(false);
  };

  return (
    <AuthContext.Provider value={{
      user, loading, error, login, register, loginWithProvider, logout,
      justSignedIn, setJustSignedIn
    }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error("useAuth must be used within AuthProvider");
  return ctx;
};