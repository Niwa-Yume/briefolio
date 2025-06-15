import { useParams, useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import { supabase } from "@/lib/supabase";
import DefaultLayout from "@/layouts/default";
import { motion } from "framer-motion";

const badgeColors: Record<string, string> = {
  sécurité: "bg-indigo-100 text-indigo-700",
  ai: "bg-purple-100 text-purple-700",
  webdesign: "bg-green-100 text-green-700",
  blockchain: "bg-orange-100 text-orange-700",
  web: "bg-blue-100 text-blue-700",
  default: "bg-gray-100 text-gray-700",
};

export default function BriefDetailsPage() {
  const { id } = useParams();
  const [brief, setBrief] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    async function fetchBrief() {
      const { data, error } = await supabase
        .from("briefs")
        .select("*")
        .eq("id", id)
        .single();
      if (!error) setBrief(data);
      setLoading(false);
    }
    fetchBrief();
  }, [id]);

  if (loading) {
    return (
      <DefaultLayout>
        <div className="text-center text-lg text-gray-500">Chargement…</div>
      </DefaultLayout>
    );
  }

  if (!brief) {
    return (
      <DefaultLayout>
        <div className="text-center text-gray-400">Brief introuvable.</div>
      </DefaultLayout>
    );
  }

  const badgeClass =
    badgeColors[brief.category?.toLowerCase() || ""] || badgeColors.default;

  return (
    <DefaultLayout>
      <div className="max-w-2xl mx-auto py-10 px-4">
        <button
          onClick={() => navigate(-1)}
          className="mb-6 text-indigo-600 hover:underline flex items-center gap-1"
        >
          <span className="text-lg">&#8592;</span> Retour
        </button>
        <motion.div
          initial={{ opacity: 0, y: 40 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, type: "spring" }}
          className="bg-white rounded-3xl shadow-2xl overflow-hidden"
        >
          <div className="relative h-64 md:h-80 overflow-hidden group">
            <img
              src={
                brief.image_url ||
                "https://cdn.cosmos.so/2d774ea0-4b4f-4d9f-a634-6b6c5a130e91?format=jpeg"
              }
              alt={brief.title}
              className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
            />
            {brief.category && (
              <span
                className={`absolute top-5 left-5 px-4 py-2 rounded-full text-sm font-semibold shadow ${badgeClass} backdrop-blur-md`}
              >
                {brief.category}
              </span>
            )}
          </div>
          <div className="p-8 flex flex-col gap-4">
            <motion.h1
              className="text-3xl md:text-4xl font-extrabold text-gray-900 mb-2"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2, duration: 0.6, type: "spring" }}
            >
              {brief.title}
            </motion.h1>
            <motion.p
              className="text-lg text-gray-700 leading-relaxed bg-gray-50 rounded-xl p-5 shadow-inner"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3, duration: 0.6 }}
            >
              {brief.description}
            </motion.p>
          </div>
        </motion.div>
      </div>
    </DefaultLayout>
  );
}