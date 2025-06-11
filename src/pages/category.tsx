import { title } from "@/components/primitives";
import DefaultLayout from "@/layouts/default";
import { useEffect, useState } from "react";
import { supabase } from "@/lib/supabase.ts";
import { Component as GlassIcons } from "@/components/ui/glass-icons";
import { LockClosedIcon, LightningBoltIcon, RocketIcon } from "@radix-ui/react-icons";

export default function CategoryPage() {
  const [categories, setCategories] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchCategories() {
      const { data, error } = await supabase
        .from("category")
        .select("*")
        .order("created_at", { ascending: false });

      if (!error && data) setCategories(data);
      setLoading(false);
    }
    fetchCategories();
  }, []);

  function getCategoryIcon(categoryName: string) {
    switch (categoryName.toLowerCase()) {
      case "sécurité":
        return <LockClosedIcon className="w-6 h-6" />;
      case "script":
        return <LightningBoltIcon className="w-6 h-6" />;
      case "design":
        return
      default:
        return <RocketIcon className="w-6 h-6" />;
    }
  }
  function getCategoryColor(categoryName: string) {
    switch (categoryName.toLowerCase()) {
      case "sécurité":
        return "indigo";
      case "script":
        return "orange";
      case "design":
        return "green";
      case "développement":
        return "purple";
    }
  }

  return (
    <DefaultLayout>
      <section className="flex flex-col items-center justify-center gap-4 py-8 md:py-10">
        <div className="inline-block max-w-lg text-center justify-center">
          <h1 className={title()}>Catégories de Brief</h1>
        </div>
        {!loading && (
          <GlassIcons
            items={categories.map((cat) => ({
              icon: getCategoryIcon(cat.name_category),
              color: getCategoryColor(cat.name_category),
              label: cat.name_category,
            }))}
          />
        )}
      </section>
    </DefaultLayout>
  );
}