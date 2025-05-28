import DefaultLayout from "@/layouts/default";
import { useEffect } from "react";

export default function CompleteProfilePage() {
  useEffect(() => {
    if (window.location.hash) {
      const cleanUrl = window.location.pathname + window.location.search;
      window.history.replaceState(null, "", cleanUrl);
      // Recharge uniquement si le hash était présent
      window.location.reload();
    }
    // Sinon, ne rien faire : la session Supabase sera bien lue
  }, []);

  return (
    <DefaultLayout>
      <div className="flex items-center justify-center w-full h-[60vh]">
        <h1 className="text-5xl font-extrabold">Complete Profile</h1>
      </div>
    </DefaultLayout>
  );
}