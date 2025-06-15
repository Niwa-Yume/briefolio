import { useParams } from "react-router-dom";
import { useEffect, useState } from "react";
import { supabase } from "@/lib/supabase";
import DefaultLayout from "@/layouts/default";
import { motion } from "framer-motion";
import { useNavigate } from "react-router-dom";

function BriefCard({
 id,
 title,
 description,
 image_url,
 index,
 category,
}: {
  id: string;
  title: string;
  description: string;
  image_url?: string;
  index: number;
  category?: string;
}) {
  const badgeColors: Record<string, string> = {
    sécurité: "bg-indigo-100 text-indigo-700",
    ai: "bg-purple-100 text-purple-700",
    webdesign: "bg-green-100 text-green-700",
    blockchain: "bg-orange-100 text-orange-700",
    web: "bg-blue-100 text-blue-700",
    default: "bg-gray-100 text-gray-700",
  };
  const badgeClass =
    badgeColors[category?.toLowerCase() || ""] || badgeColors.default;
  const navigate = useNavigate();
  return (
    <motion.div
      className="bg-white rounded-2xl shadow-md overflow-hidden flex flex-col group transition-all duration-300 hover:shadow-2xl border border-gray-100"
      initial={{ opacity: 0, y: 40 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.08 * index, duration: 0.5, type: "spring" }}
      whileHover={{ scale: 1.035 }}
      onClick={() => navigate(`/brief/${id}`)}
    >
      <div className="relative w-full h-48 overflow-hidden">
        <img
          src={
            image_url ||
            "https://cdn.cosmos.so/2d774ea0-4b4f-4d9f-a634-6b6c5a130e91?format=jpeg"
          }
          alt={title}
          className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
        />
        {category && (
          <span
            className={`absolute top-3 left-3 px-3 py-1 rounded-full text-xs font-semibold shadow ${badgeClass}`}
          >

            {category}
          </span>
        )}
      </div>
      <div className="p-6 flex flex-col flex-1">
        <h2 className="text-lg font-bold text-gray-900 mb-2 line-clamp-1">{title}</h2>
        <div className="bg-gray-50 rounded-md px-3 py-2 mb-4 text-gray-700 text-sm leading-relaxed shadow-inner max-h-32 overflow-auto">
          {description}
        </div>
        <button
          className="mt-auto px-4 py-2 bg-indigo-600 text-white rounded-lg font-medium shadow hover:bg-indigo-700 transition"
          onClick={() => navigate(`/brief/${id}`)}
        >
          Voir le brief
        </button>
      </div>
    </motion.div>
  );
}

export default function CategoryDetailsPage() {
  const { categoryName } = useParams();
  const [briefs, setBriefs] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchBriefs() {
      const { data, error } = await supabase
        .from("briefs")
        .select("*")
        .eq("category", categoryName);

      if (!error && data) setBriefs(data);
      setLoading(false);
    }
    fetchBriefs();
  }, [categoryName]);

  return (
    <DefaultLayout>
      <motion.h1
        className="text-3xl font-extrabold text-center mb-8"
        initial={{ opacity: 0, y: -30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, type: "spring" }}
      >
        Briefs pour la catégorie&nbsp;
        <span className="text-indigo-600">{categoryName}</span>
      </motion.h1>
      {loading ? (
        <div className="text-center text-lg text-gray-500">Chargement…</div>
      ) : briefs.length === 0 ? (
        <motion.div
          className="text-center text-gray-400"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
        >
          Aucun brief trouvé.
        </motion.div>
      ) : (
        <motion.div
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8"
          initial="hidden"
          animate="visible"
          variants={{
            hidden: {},
            visible: {
              transition: {
                staggerChildren: 0.08,
              },
            },
          }}
        >
          {briefs.map((brief, idx) => (
            <BriefCard
              key={brief.id}
              id={brief.id} // Ajoute cette ligne
              title={brief.title}
              description={brief.description}
              image_url={brief.image_url}
              index={idx}
              category={brief.category}
            />
          ))}
        </motion.div>
      )}
    </DefaultLayout>
  );
}