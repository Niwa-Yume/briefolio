import { title } from "@/components/primitives";
import DefaultLayout from "@/layouts/default";
import { useEffect, useState } from "react";
import { supabase } from "@/lib/supabase.ts";
import { Component as GlassIcons } from "@/components/ui/glass-icons";
import {
  LockClosedIcon,
  LightningBoltIcon,
  RocketIcon,
  FigmaLogoIcon, GlobeIcon
} from "@radix-ui/react-icons";

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
    switch (categoryName.trim().toLowerCase()) {
      case "sécurité":
        return <LockClosedIcon className="w-6 h-6" />;
      case "script":
        return <LightningBoltIcon className="w-6 h-6" />;
      case "webdesign":
        return <FigmaLogoIcon className="w-6 h-6" />;
      case "blockchain":
        return (
          <svg
            className="w-6 h-6"
            viewBox="0 0 122.88 122.88"
            xmlns="http://www.w3.org/2000/svg"
          >
            <g>
              <path
                className="st0"
                fill="#F7931A"
                d="M18.43,0h86.02c10.18,0,18.43,8.25,18.43,18.43v86.02c0,10.18-8.25,18.43-18.43,18.43H18.43 C8.25,122.88,0,114.63,0,104.45l0-86.02C0,8.25,8.25,0,18.43,0L18.43,0z"
              />
              <path
                className="st1"
                fill="#FFFFFF"
                d="M93.84,51.84c1.44-10.32-6-15.36-16.32-18.96l3.36-13.2l-8.16-2.16L69.6,30.48l-6.72-1.68l3.36-12.96 l-8.4-2.16l-3.12,13.44l-5.28-1.2l-11.28-2.88l-1.92,8.64L42,33.12c3.36,0.96,4.08,3.36,3.6,5.04L42,53.28l0.72,0.24L42,53.28 l-5.28,21.36c-0.48,1.2-1.44,2.64-3.84,1.92l-5.76-1.44l-4.08,9.36l16.32,4.08l-3.12,13.68l7.92,1.92l3.36-13.2l6.24,1.44 l-3.12,13.2l8.16,2.16l3.36-13.44c13.92,2.64,24.48,1.44,28.8-11.04c3.36-10.08-0.24-15.84-7.68-19.68 C88.56,62.4,92.64,58.8,93.84,51.84L93.84,51.84L93.84,51.84z M75.36,77.76c-2.64,9.84-19.68,4.8-25.2,3.36l4.56-18 C60.24,64.56,78,67.2,75.36,77.76L75.36,77.76L75.36,77.76z M77.52,51.36c-2.16,9.36-16.08,4.8-20.88,3.6l4.08-16.32 C65.52,39.84,80.16,42,77.52,51.36L77.52,51.36z"
              />
            </g>
          </svg>
        );
      case "web":
        return <GlobeIcon className="w-6 h-6" />;
      default:
        return <RocketIcon className="w-6 h-6" />;
    }
  }
  function getCategoryColor(categoryName: string) {
    switch (categoryName.trim().toLowerCase()) {
      case "sécurité":
        return "indigo";
      case "script":
        return "orange";
      case "webdesign":
        return "green";
      case "blockchain":
        return "purple";
      default:
        return "blue";
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