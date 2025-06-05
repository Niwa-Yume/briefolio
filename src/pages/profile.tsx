import { useEffect, useState } from "react";
import { Card, CardHeader, CardBody } from "@heroui/react";
import { Spinner } from "@heroui/spinner";
import { useAuth } from "@/contexts/AuthContext";
import { supabase } from "@/lib/supabase";
export default function ProfilePage() {
  const { user, loading } = useAuth();
  const [profile, setProfile] = useState<Record<string, any> | null>(null);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchProfile = async () => {
      if (!user) return;
      const { data, error } = await supabase
        .from("profiles")
        .select("*")
        .eq("id", user.id)
        .single();
      if (error) setError("Erreur lors du chargement du profil.");
      else setProfile(data);
    };
    fetchProfile();
  }, [user]);

  if (loading || !user) {
    return (
      <div className="flex items-center justify-center h-[60vh]">
        <Spinner />
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex items-center justify-center h-[60vh] text-red-500">
        {error}
      </div>
    );
  }

  if (!profile) {
    return (
      <div className="flex items-center justify-center h-[60vh]">
        <Spinner />
      </div>
    );
  }

  return (
    <div className="flex justify-center mt-10">
      <Card className="w-full max-w-md">
        <CardHeader>
          <h1 className="text-2xl font-bold">Mon profil</h1>
        </CardHeader>
        <CardBody>
          <ul className="space-y-2">
            {Object.entries(profile).map(([key, value]) => (
              <li key={key} className="flex justify-between">
                <span className="font-medium">{key}</span>
                <span>
                  {typeof value === "string" && value.startsWith("http") ? (
                    <a href={value} className="text-blue-600 underline" target="_blank" rel="noopener noreferrer">
                      {value}
                    </a>
                  ) : value === null ? (
                    <span className="italic text-gray-400">null</span>
                  ) : (
                    value.toString()
                  )}
                </span>
              </li>
            ))}
          </ul>
        </CardBody>
      </Card>
    </div>
  );
}