import { useEffect, useState } from "react";
import DefaultLayout from "@/layouts/default";
import { useAuth } from "@/contexts/AuthContext";
import { supabase } from "@/lib/supabase";
import { Spinner } from "@heroui/spinner";

type Profile = {
  username: string;
  bio: string;
  avatar_url: string;
};

export default function ProfilePage() {
  const { user, loading } = useAuth();
  const [profile, setProfile] = useState<Profile | null>(null);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchProfile = async () => {
      if (!user) return;
      const { data, error } = await supabase
        .from("profiles")
        .select("username, bio, avatar_url")
        .eq("id", user.id)
        .single();
      if (error) setError("Erreur lors du chargement du profil.");
      else setProfile(data);
    };
    fetchProfile();
  }, [user]);

  if (loading || !user) {
    return (
      <DefaultLayout>
        <div className="flex items-center justify-center h-[60vh]">
          <Spinner />
        </div>
      </DefaultLayout>
    );
  }

  if (error) {
    return (
      <DefaultLayout>
        <div className="flex items-center justify-center h-[60vh] text-red-500">
          {error}
        </div>
      </DefaultLayout>
    );
  }

  if (!profile) {
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
      <div className="flex flex-col items-center justify-center w-full max-w-md mx-auto mt-10">
        <h1 className="text-3xl font-bold mb-6">Mon profil</h1>
        {profile.avatar_url && (
          <img
            src={profile.avatar_url}
            alt="Avatar"
            className="w-24 h-24 rounded-full mb-4 object-cover"
          />
        )}
        <div className="text-lg font-semibold mb-2">{profile.username}</div>
        <div className="text-gray-600 mb-4">{profile.bio}</div>
        <div className="text-sm text-gray-400">Email: {user.email}</div>
      </div>
    </DefaultLayout>
  );
}