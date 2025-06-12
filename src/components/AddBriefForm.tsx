// src/components/AddBriefForm.tsx
import { useForm } from "react-hook-form";
import { Dialog, Transition } from "@headlessui/react";
import { Fragment, useState } from "react";
import { supabase } from "@/lib/supabase.ts";

type BriefFormValues = {
  title: string;
  description: string;
  category: string;
};

export default function AddBriefForm({ onBriefAdded }: { onBriefAdded?: () => void }) {
  const [open, setOpen] = useState(false);
  const { register, handleSubmit, reset, formState: { errors, isSubmitting } } = useForm<BriefFormValues>();

  const onSubmit = async (data: BriefFormValues) => {
    const { error } = await supabase.from("briefs").insert([data]);
    if (!error) {
      reset();
      setOpen(false);
      onBriefAdded?.();
    } else {
      alert("Erreur lors de l'ajout du brief");
    }
  };

  return (
    <>
      <div className="flex justify-center mb-4 mt-5">
        <button
          className="px-4 py-2 bg-indigo-600 text-white rounded hover:bg-indigo-700"
          onClick={() => setOpen(true)}
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
                <Dialog.Panel className="w-full max-w-md transform rounded-2xl bg-white p-6 shadow-xl transition-all">
                  <Dialog.Title className="text-lg font-bold mb-4">Nouveau Brief</Dialog.Title>
                  <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
                    <div>
                      <label className="block text-sm font-medium">Titre</label>
                      <input
                        className="mt-1 w-full rounded border-gray-300 focus:ring-indigo-500 focus:border-indigo-500"
                        {...register("title", { required: "Titre requis" })}
                      />
                      {errors.title && <span className="text-red-500 text-xs">{errors.title.message}</span>}
                    </div>
                    <div>
                      <label className="block text-sm font-medium">Description</label>
                      <textarea
                        className="mt-1 w-full rounded border-gray-300 focus:ring-indigo-500 focus:border-indigo-500"
                        rows={3}
                        {...register("description", { required: "Description requise" })}
                      />
                      {errors.description && <span className="text-red-500 text-xs">{errors.description.message}</span>}
                    </div>
                    <div>
                      <label className="block text-sm font-medium">Catégorie</label>
                      <select
                        className="mt-1 w-full rounded border-gray-300 focus:ring-indigo-500 focus:border-indigo-500"
                        {...register("category", { required: "Catégorie requise" })}
                      >
                        <option value="">Choisir une catégorie</option>
                        <option value="sécurité">Sécurité</option>
                        <option value="script">Script</option>
                        <option value="webdesign">Webdesign</option>
                        <option value="blockchain">Blockchain</option>
                        <option value="web">Web</option>
                      </select>
                      {errors.category && <span className="text-red-500 text-xs">{errors.category.message}</span>}
                    </div>
                    <div className="flex justify-end gap-2">
                      <button
                        type="button"
                        className="px-4 py-2 bg-gray-200 rounded"
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