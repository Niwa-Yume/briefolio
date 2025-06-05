import { useState } from "react";
import { Input } from "@heroui/input";
import { Spinner } from "@heroui/spinner";
import { useEffect } from "react";

import { supabase } from "@/lib/supabase";
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
  const [avatarFile, setAvatarFile] = useState<File | null>(null);

  useEffect(() => {
    // Nettoyer l'URL dès que possible
    if (window.location.hash) {
      // Supprime le hash et ses paramètres
      window.history.replaceState(null, "", window.location.pathname);
    }
  }, []);

  const handleAvatarChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setAvatarFile(e.target.files[0]);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setSuccess(null);
    if (!user) {
      setError("Utilisateur non connecté.");

      return;
    }

    let avatarUrl = null;

    if (avatarFile) {
      if (!avatarFile.type.startsWith("image/")) {
        setError("Le fichier doit être une image.");
        return;
      }
      if (avatarFile.size > 5 * 1024 * 1024) { // 5 Mo
        setError("L'image est trop volumineuse (max 5 Mo).");
        return;
      }

      const fileName = `${crypto.randomUUID()}-${avatarFile.name}`;
      const { error: uploadError } = await supabase.storage
        .from("avatars")
        .upload(fileName, avatarFile, { upsert: true });

      if (uploadError) {
        setError("Erreur lors de l'upload de l'avatar.");
        return;
      }
      const { data } = supabase.storage.from("avatars").getPublicUrl(fileName);
      avatarUrl = data.publicUrl;
    }

    const { success, error } = await upsertProfile(
      user.id,
      username,
      bio,
      avatarUrl,
    );

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
          <Input
            accept="image/*"
            label="Avatar"
            type="file"
            onChange={handleAvatarChange}
          />
          <Button type="submit">Enregistrer</Button>
        </form>
      </div>
    </DefaultLayout>
  );
}
