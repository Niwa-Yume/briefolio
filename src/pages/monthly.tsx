import { useEffect, useState } from "react";
import { supabase } from "@/lib/supabase";
import { title } from "@/components/primitives";
import DefaultLayout from "@/layouts/default";
import { AnimatedCard } from "@/components/ui/feature-block-animated-card";

export default function MonthlyPage() {
  const [brief, setBrief] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchBrief() {
      // Ici, on récupère le brief du mois (exemple : le plus récent ou avec un flag spécifique)
      const { data, error } = await supabase
        .from("briefs")
        .select("*")
        .order("created_at", { ascending: false })
        .limit(1)
        .single();

      if (!error) setBrief(data);
      setLoading(false);
    }
    fetchBrief();
  }, []);

  return (
    <DefaultLayout>
      <section className="flex flex-col items-center justify-center gap-4 md:py-10">
        <div className="inline-block max-w-lg text-center justify-center">
          <h1 className={title()}>Brief du mois</h1>
        </div>
      </section>
      {loading ? (
        <div>Chargement…</div>
      ) : brief ? (
        <AnimatedCard
          title={brief.title}
          description={brief.description}
          icons={[
            {
              icon: (
                <img
                  src={brief.image_url || "https://cdn.cosmos.so/2d774ea0-4b4f-4d9f-a634-6b6c5a130e91?format=jpeg"}
                  alt="Image du brief"
                  className="object-cover"
                />
              ),
              size: "xxl",
            },
          ]}
        />
      ) : (
        <div>Aucun brief trouvé.</div>
      )}
    </DefaultLayout>
  );
}