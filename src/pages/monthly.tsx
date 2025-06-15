import { useEffect, useState } from "react";
import { supabase } from "@/lib/supabase";
import { title } from "@/components/primitives";
import DefaultLayout from "@/layouts/default";
import { AnimatedCard } from "@/components/ui/feature-block-animated-card";
import AddBriefForm from "@/components/AddBriefForm.tsx";
import { useAuth } from "@/contexts/AuthContext";
import { useNavigate } from "react-router-dom";


export default function MonthlyPage() {
  const [brief, setBrief] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [isModerator, setIsModerator] = useState(false);
  const { user, loading: authLoading } = useAuth();

  useEffect(() => {
    if (authLoading) return;

    async function fetchBriefAndCheckRole() {
      const { data, error } = await supabase
        .from("briefs")
        .select("*")
        .order("created_at", { ascending: false })
        .limit(1)
        .single();

      if (!error) setBrief(data);

      if (user) {
        const { data: rolesData, error: rolesError } = await supabase
          .from("user_roles")
          .select("role_id")
          .eq("user_id", user.id);

        if (!rolesError && Array.isArray(rolesData)) {
          const isMod = rolesData.some((ur) => ur.role_id === 2);
          setIsModerator(isMod);
        } else {
          setIsModerator(false);
        }
      } else {
        setIsModerator(false);
      }
      setLoading(false);
    }

    void fetchBriefAndCheckRole();
  }, [user, authLoading]);

  const navigate = useNavigate();

  return (
    <DefaultLayout>
      <section className="flex flex-col items-center justify-center gap-4 md:py-10">
        <div className="inline-block max-w-lg text-center justify-center">
          <h1 className={title()}>Brief du mois</h1>
        </div>
      </section>
      {isModerator && (
        <div className="mb-4">
          <AddBriefForm />
        </div>
      )}
      {loading ? (
        <div>Chargement…</div>
      ) : brief ? (
        <div
          className="cursor-pointer"
          onClick={() => navigate(`/brief/${brief.id}`)}
          role="button"
          tabIndex={0}
        >
          <AnimatedCard
            title={brief.title}
            description={brief.description}
            icons={[
              {
                icon: (
                  <img
                    src={
                      brief.image_url ||
                      "https://cdn.cosmos.so/2d774ea0-4b4f-4d9f-a634-6b6c5a130e91?format=jpeg"
                    }
                    alt="Brief"
                    className="object-cover"
                  />
                ),
                size: "xxl",
              },
            ]}
          />
        </div>
      ) : (
        <div>Aucun brief trouvé.</div>
      )}
    </DefaultLayout>
  );
}