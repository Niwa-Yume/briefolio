import DefaultLayout from "@/layouts/default";
import { useEffect } from "react";

export default function CompleteProfilePage() {
  useEffect(() => {
    // Si l’URL contient un hash, on le retire et on recharge la page
    if (window.location.hash) {
      const cleanUrl = window.location.pathname + window.location.search;
      window.history.replaceState(null, "", cleanUrl);
      // Optionnel : tu peux recharger la page si besoin
      // window.location.reload();
    }
  }, []);

  return (
    <DefaultLayout>
      <div className="flex items-center justify-center w-full h-[60vh]">
        <h1 className="text-5xl font-extrabold">Complete Profile</h1>
      </div>
    </DefaultLayout>
  );
}