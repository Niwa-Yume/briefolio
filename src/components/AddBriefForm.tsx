import axios from "axios";
import { useForm } from "react-hook-form";
import { Dialog, Transition } from "@headlessui/react";
import { Fragment, useEffect, useState } from "react";
import { supabase } from "@/lib/supabase.ts";
import { useDispatch } from "react-redux";
import { showNotification } from "@/store/notificationSlice";
import { Input } from "@heroui/react"; // Utilisation du composant Input HeroUI

type BriefFormValues = {
  title: string;
  description: string;
  category: string;
  image?: FileList;
};

type Category = {
  id: number;
  name: string;
};

export default function AddBriefForm({ onBriefAdded }: { onBriefAdded?: () => void }) {
  const [open, setOpen] = useState(false);
  const { register, handleSubmit, reset, formState: { errors, isSubmitting } } = useForm<BriefFormValues>();
  const [categories, setCategories] = useState<Category[]>([]);
  const [aiLoading, setAiLoading] = useState(false);
  const [aiBriefs, setAiBriefs] = useState<string[]>([]);
  const dispatch = useDispatch();

  useEffect(() => {
    async function fetchCategories() {
      const { data, error } = await supabase.from("category").select("*");
      if (!error && data) setCategories(data);
    }
    fetchCategories();
  }, []);

  const onSubmit = async (data: BriefFormValues) => {
    let image_url = "";
    if (data.image && data.image[0]) {
      const file = data.image[0];
      const fileExt = file.name.split(".").pop();
      const fileName = `${Date.now()}.${fileExt}`;
      const { error: uploadError } = await supabase
        .storage
        .from("brief-images")
        .upload(fileName, file);

      if (uploadError) {
        dispatch(showNotification({ type: "error", message: "Erreur lors de l'upload de l'image." }));
        return;
      }
      image_url = supabase.storage.from("brief-images").getPublicUrl(fileName).data.publicUrl;
    }

    const { error } = await supabase.from("briefs").insert([{
      title: data.title,
      description: data.description,
      category: data.category,
      image_url,
    }]);
    if (!error) {
      reset();
      setOpen(false);
      onBriefAdded?.();
      dispatch(showNotification({
        type: "success",
        message: "Brief ajouté avec succès !"
      }));
    } else {
      dispatch(showNotification({
        type: "error",
        message: "Erreur lors de l'ajout du brief."
      }));
    }
  };

  const fetchAIBriefs = async () => {
    setAiLoading(true);
    setAiBriefs([]);
    try {
      const response = await axios.post(
        "https://briefolio.vercel.app/api/generate-brief",
        {
          messages: [
            {
              role: "system",
              content: "Tu es un expert en découverte de Product-Market Fit pour des projets web simples mais pérennes (stratégie “chameau” : frugal, rentable tôt, zéro burn-rate).",
            },
            {
              role: "user",
              content: "## Mission\n\nPropose **5 idées de projets web codables** (SaaS, jeu, outil, plateforme…) qui :\n\n1. ciblent **≥ 1** des thèmes : AI · Tech · Webtoon/Manga · Esport · Blockchain · Fun étudiants tech 2025 · Apprentissage du japonais · mini-jeux Three.js., sécurité, F1, Script, Webdesign, Web, Blockchain\n"
            }
          ]
        }
      );
      const text = response.data.choices[0].message.content;
      setAiBriefs(text.split(/\n{2,}/).filter(Boolean));
    } catch (e) {
      dispatch(showNotification({ type: "error", message: "Erreur lors de la génération IA." }));
      console.error("Erreur lors de la génération IA:", e);
    }
    setAiLoading(false);
  };

  return (
    <>
      <div className="flex justify-center mb-4 mt-5">
        <button
          className="px-4 py-2 bg-indigo-600 text-white rounded hover:bg-indigo-700"
          onClick={() => setOpen(true)}
          aria-label="Ajouter un brief"
        >
          Ajouter un brief
        </button>
      </div>
      <Transition appear show={open} as={Fragment}>
        <Dialog as="div" className="relative z-10" onClose={() => setOpen(false)}>
          <Transition.Child
            as={Fragment}
            enter="ease-out duration-300"
            enterFrom="opacity-0"
            enterTo="opacity-100"
            leave="ease-in duration-200"
            leaveFrom="opacity-100"
            leaveTo="opacity-0"
          >
            <div className="fixed inset-0 bg-black bg-opacity-25" />
          </Transition.Child>
          <div className="fixed inset-0 overflow-y-auto">
            <div className="flex min-h-full items-center justify-center p-4">
              <Transition.Child
                as={Fragment}
                enter="ease-out duration-300"
                enterFrom="opacity-0 scale-95"
                enterTo="opacity-100 scale-100"
                leave="ease-in duration-200"
                leaveFrom="opacity-100 scale-100"
                leaveTo="opacity-0 scale-95"
              >
                <Dialog.Panel className="w-full max-w-md transform rounded-2xl bg-white dark:bg-gray-900 p-6 shadow-xl transition-all">
                  <h2 className="text-lg font-bold mb-4 text-gray-900 dark:text-gray-100" id="add-brief-title">
                    Nouveau Brief
                  </h2>
                  <form
                    onSubmit={handleSubmit(onSubmit)}
                    className="space-y-4"
                    aria-labelledby="add-brief-title"
                  >
                    <div>
                      <label htmlFor="brief-title" className="block text-sm font-medium text-gray-900 dark:text-gray-100">
                        Titre
                      </label>
                      <Input
                        id="brief-title"
                        type="text"
                        placeholder="Entrez le titre du brief"
                        className="mt-1 block w-full"
                        {...register("title", { required: "Titre requis" })}
                        aria-required="true"
                      />
                      {errors.title && <span className="text-red-500 text-xs">{errors.title.message}</span>}
                    </div>
                    <div>
                      <label htmlFor="brief-description" className="block text-sm font-medium text-gray-900 dark:text-gray-100">
                        Description
                      </label>
                      <Input
                        as="textarea"
                        id="brief-description"
                        className="mt-1 w-full"
                        rows={3}
                        {...register("description", { required: "Description requise" })}
                        aria-required="true"
                      />
                      {errors.description && <span className="text-red-500 text-xs">{errors.description.message}</span>}
                    </div>
                    <div>
                      <label htmlFor="brief-category" className="block text-sm font-medium text-gray-900 dark:text-gray-100">
                        Catégorie
                      </label>
                      <select
                        id="brief-category"
                        className="mt-1 w-full rounded border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100 focus:ring-indigo-500 focus:border-indigo-500"
                        {...register("category", { required: "Catégorie requise" })}
                        aria-required="true"
                      >
                        <option value="">Choisir une catégorie</option>
                        {categories.map((cat) => (
                          <option key={cat.id} value={cat.name}>{cat.name}</option>
                        ))}
                      </select>
                      {errors.category && <span className="text-red-500 text-xs">{errors.category.message}</span>}
                    </div>
                    <div>
                      <label htmlFor="brief-image" className="block text-sm font-medium text-gray-900 dark:text-gray-100">
                        Image
                      </label>
                      <Input
                        id="brief-image"
                        type="file"
                        accept="image/*"
                        className="mt-1 block w-full"
                        {...register("image")}
                        aria-label="Ajouter une image pour le brief"
                      />
                    </div>
                    <div className="flex items-center gap-2">
                      <button
                        type="button"
                        className="px-3 py-1 bg-emerald-600 text-white rounded hover:bg-emerald-700"
                        onClick={fetchAIBriefs}
                        disabled={aiLoading}
                        aria-label="Générer un brief avec l’IA"
                      >
                        {aiLoading ? "Génération..." : "Générer avec l’IA un nouveau brief"}
                      </button>
                    </div>
                    {aiBriefs.length > 0 && (
                      <div className="mt-3 space-y-2">
                        {aiBriefs.map((brief, idx) => (
                          <button
                            key={idx}
                            type="button"
                            className="w-full text-left p-2 border rounded cursor-pointer hover:bg-gray-100 dark:hover:bg-gray-800 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                            onClick={() => {
                              const [title, ...desc] = brief.split(":");
                              reset({
                                title: title?.replace(/^\d+\.\s*/, "") || "",
                                description: desc.join(":").trim(),
                                category: "",
                              });
                            }}
                          >
                            {brief}
                          </button>
                        ))}
                      </div>
                    )}
                    <div className="flex justify-end gap-2">
                      <button
                        type="button"
                        className="px-4 py-2 bg-gray-200 dark:bg-gray-700 text-gray-900 dark:text-gray-100 rounded"
                        onClick={() => setOpen(false)}
                        disabled={isSubmitting}
                      >
                        Annuler
                      </button>
                      <button
                        type="submit"
                        className="px-4 py-2 bg-indigo-600 text-white rounded hover:bg-indigo-700"
                        disabled={isSubmitting}
                      >
                        Ajouter
                      </button>
                    </div>
                  </form>
                </Dialog.Panel>
              </Transition.Child>
            </div>
          </div>
        </Dialog>
      </Transition>
    </>
  );
}