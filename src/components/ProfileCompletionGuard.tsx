// src/components/ProfileCompletionGuard.tsx

import { useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";
import { supabase } from "@/lib/supabase";

export function ProfileCompletionGuard({ children }: { children: React.ReactNode }) {
  const { user, loading, justSignedIn, setJustSignedIn } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    if (!loading && user && justSignedIn && location.pathname !== "/complete-profile") {
      supabase
        .from("profiles")
        .select("username")
        .eq("id", user.id)
        .single()
        .then(({ data }) => {
          if (!data?.username) {
            navigate("/complete-profile");
          }
          setJustSignedIn(false); // On ne veut plus rediriger après
        });
    }
  }, [user, loading, justSignedIn, location.pathname, navigate, setJustSignedIn]);

  return <>{children}</>;
}