import { useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";
import { supabase } from "@/lib/supabase";

export function ProfileCompletionGuard({ children }: { children: React.ReactNode }) {
  const { user, loading } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    if (!loading && user && location.pathname !== "/complete-profile") {
      supabase
        .from("profiles")
        .select("username")
        .eq("id", user.id)
        .single()
        .then(({ data }) => {
          if (!data?.username) {
            navigate("/complete-profile");
          }
        });
    }
  }, [user, loading, location.pathname, navigate]);

  return <>{children}</>;
}