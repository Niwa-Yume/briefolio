import { useEffect, useState } from "react";
import { Card, CardHeader, CardBody } from "@heroui/react";

import { useAuth } from "@/contexts/AuthContext";
import { supabase } from "@/lib/supabase";
import DefaultLayout from "@/layouts/default";

export default function ProfilePage() {
  const { user } = useAuth();
  const [profile, setProfile] = useState<Record<string, any> | null>(null);

  useEffect(() => {
    const fetchProfile = async () => {
      if (!user) return;
      const { data } = await supabase
        .from("profiles")
        .select("*")
        .eq("id", user.id)
        .single();

      if (data) {
        setProfile(data);
      }
    };

    fetchProfile();
  }, [user]);

  if (!profile) {
    return null;
  }

  return (
    <DefaultLayout>
      <div className="flex justify-center mt-10">
        <Card className="w-full max-w-md">
          <CardHeader>
            <h1 className="text-2xl font-bold">Mon profil</h1>
          </CardHeader>
          <CardBody>
            {profile.avatar_url && (
              <div className="flex justify-center mb-4">
                <img
                  alt="Avatar"
                  className="w-24 h-24 rounded-full object-cover border"
                  src={profile.avatar_url}
                />
              </div>
            )}
            <div className="mb-2">
              <span className="font-medium">Nom d&rsquo;utilisateur :</span>{" "}
              <span>
                {profile.username || (
                  <span className="italic text-gray-400">Non renseigné</span>
                )}
              </span>
            </div>
            <div className="mb-2">
              <span className="font-medium">Bio :</span>{" "}
              <span>
                {profile.bio || (
                  <span className="italic text-gray-400">Non renseignée</span>
                )}
              </span>
            </div>
          </CardBody>
        </Card>
      </div>
    </DefaultLayout>
  );

}

