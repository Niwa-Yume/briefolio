import { useState, useEffect } from "react";
import { Form, Input, Button } from "@heroui/react";
import { Spinner } from "@heroui/spinner";
import { useNavigate } from "react-router-dom";

import DefaultLayout from "@/layouts/default";
import { useAuth } from "@/contexts/AuthContext";
import { upsertProfile } from "@/lib/profileService";
import { supabase } from "@/lib/supabase";

export default function CompleteProfilePage() {
  const { user, loading } = useAuth();
  const [success, setSuccess] = useState<string | null>(null);
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [avatarFile, setAvatarFile] = useState<File | null>(null);
  const navigate = useNavigate();

  useEffect(() => {
    if (window.location.hash) {
      window.history.replaceState(null, "", window.location.pathname);
    }
  }, []);

  const handleAvatarChange = (fileList: FileList | null) => {
    if (fileList && fileList[0]) {
      setAvatarFile(fileList[0]);
    }
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setSuccess(null);
    setErrors({});
    if (!user) {
      setErrors({ form: "Utilisateur non connecté." });

      return;
    }

    const formData = new FormData(e.currentTarget);
    const username = formData.get("username") as string;
    const bio = formData.get("bio") as string;

    const newErrors: Record<string, string> = {};

    if (!username) newErrors.username = "Le nom d'utilisateur est requis.";
    if (avatarFile) {
      if (!avatarFile.type.startsWith("image/")) {
        newErrors.avatar = "Le fichier doit être une image.";
      }
      if (avatarFile.size > 5 * 1024 * 1024) {
        newErrors.avatar = "L'image est trop volumineuse (max 5 Mo).";
      }
    }
    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);

      return;
    }

    let avatarUrl = null;

    if (avatarFile) {
      const fileName = `${crypto.randomUUID()}-${avatarFile.name}`;
      const { error: uploadError } = await supabase.storage
        .from("avatars")
        .upload(fileName, avatarFile, { upsert: true });

      if (uploadError) {
        setErrors({ avatar: "Erreur lors de l'upload de l'avatar." });

        return;
      }
      const { data } = supabase.storage.from("avatars").getPublicUrl(fileName);

      avatarUrl = data.publicUrl;
    }

    const { success: ok, error } = await upsertProfile(
      user.id,
      username,
      bio,
      avatarUrl,
    );

    if (ok) {
      setSuccess("Profil mis à jour !");
      navigate("/profile"); // Redirige vers la page profil
    } else {
      setErrors({
        form: error?.message || "Erreur lors de la mise à jour du profil.",
      });
    }
  };

  if (loading || !user) {
    return (
      <DefaultLayout>
        <div className="flex items-center justify-center h-[60vh]">
          <Spinner />
        </div>
      </DefaultLayout>
    );
  }

  return (
    <DefaultLayout>
      <div className="flex items-center justify-center w-full h-[60vh]">
        <Form
          className="space-y-4 w-full max-w-md"
          validationErrors={errors}
          onSubmit={handleSubmit}
        >
          <h1 className="text-3xl font-bold mb-6">Compléter le profil</h1>
          {errors.form && <div className="text-red-500">{errors.form}</div>}
          {success && <div className="text-green-500">{success}</div>}
          <Input
            isRequired
            errorMessage={errors.username}
            label="Nom d'utilisateur"
            name="username"
            placeholder="Votre pseudo"
          />
          <Input
            errorMessage={errors.bio}
            label="Bio"
            name="bio"
            placeholder="Quelques mots sur vous"
          />
          <Input
            accept="image/*"
            errorMessage={errors.avatar}
            label="Avatar"
            name="avatar"
            type="file"
            onChange={(e) => handleAvatarChange(e.target.files)}
          />
          <Button type="submit">Enregistrer</Button>
        </Form>
      </div>
    </DefaultLayout>
  );
}
