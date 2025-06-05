import { useState } from "react";
import { Input } from "@heroui/input";
import { Spinner } from "@heroui/spinner";

import DefaultLayout from "@/layouts/default";
import { useAuth } from "@/contexts/AuthContext";
import { upsertProfile } from "@/lib/profileService";
import { Button } from "@/components/ui/button";

export default function CompleteProfilePage() {
  const { user, loading } = useAuth();
  const [username, setUsername] = useState("");
  const [bio, setBio] = useState("");
  const [success, setSuccess] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (window.location.hash && (user || !loading)) {
      window.history.replaceState(
        null,
        "",
        window.location.pathname + window.location.search
      );
    }
  }, [user, loading]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setSuccess(null);
    if (!user) {
      setError("Utilisateur non connecté.");

      return;
    }
    const { success, error } = await upsertProfile(user.id, username, bio);

    if (success) {
      setSuccess("Profil mis à jour !");
    } else {
      setError(error?.message || "Erreur lors de la mise à jour du profil.");
    }
  };

  if (loading || !user) {
    return (
      <DefaultLayout>
        <div className="flex items-center justify-center h-[60vh]">
          <Spinner /> {/* ou un simple texte "Chargement..." */}
        </div>
      </DefaultLayout>
    );
  }

  return (
    <DefaultLayout>
      <div className="flex items-center justify-center w-full h-[60vh]">
        <form className="space-y-4 w-full max-w-md" onSubmit={handleSubmit}>
          <h1 className="text-3xl font-bold mb-6">Compléter le profil</h1>
          {error && <div className="text-red-500">{error}</div>}
          {success && <div className="text-green-500">{success}</div>}
          <Input
            label="Nom d'utilisateur"
            placeholder="Votre pseudo"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
          />
          <Input
            label="Bio"
            placeholder="Quelques mots sur vous"
            value={bio}
            onChange={(e) => setBio(e.target.value)}
          />
          <Button type="submit">Enregistrer</Button>
        </form>
      </div>
    </DefaultLayout>
  );
}
