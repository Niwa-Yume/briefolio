import { title } from "@/components/primitives";
import DefaultLayout from "@/layouts/default";
import { useEffect, useState } from "react";
import { supabase } from "@/lib/supabase.ts";

export default function CategoryPage() {
  const [categories, setCategories] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchCategories() {
      const { data, error } = await supabase
        .from("category") // ou "categories" selon ta table
        .select("*")
        .order("created_at", { ascending: false });

      if (!error && data) setCategories(data);
      setLoading(false);
    }
    fetchCategories();
  }, []);

  return (
    <DefaultLayout>
      <section className="flex flex-col items-center justify-center gap-4 py-8 md:py-10">
        <div className="inline-block max-w-lg text-center justify-center">
          <h1 className={title()}>Catégories de Brief</h1>
        </div>
        {loading ? (
          <div>Chargement…</div>
        ) : (
          <ul>
            {categories.map((cat, idx) => (
              <li key={cat.id ?? idx}>{cat.name_category}</li>
            ))}
          </ul>
        )}
      </section>
    </DefaultLayout>
  );
}