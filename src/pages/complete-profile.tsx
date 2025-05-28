import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Input } from "@heroui/input";
import {Textarea} from "@heroui/input";

import DefaultLayout from "@/layouts/default";
import { Button } from "@/components/ui/button";
import { supabase } from "@/lib/supabase";
import { upsertProfile } from "@/lib/profileService";

export default function CompleteProfilePage() {
  const [username, setUsername] = useState("");
  const [bio, setBio] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [userId, setUserId] = useState<string | null>(null);
  const navigate = useNavigate();

  // Check if user is authenticated
  useEffect(() => {
    const checkAuth = async () => {
      const { data: { session }, error } = await supabase.auth.getSession();

      if (error || !session?.user) {
        console.log("Non authentifié, redirection vers login");
        window.location.href = "/login";
        return;
      }

      setUserId(session.user.id);
      // ... reste du code
    };

    checkAuth();
  }, []);

  // Function to handle profile update
  const handleUpdateProfile = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!userId) return;
    
    setLoading(true);
    setError(null);

    try {
      const result = await upsertProfile(userId, username, bio);
      
      if (!result.success) {
        throw new Error(result.message || "Failed to update profile");
      }
      
      // Redirect to home page after successful update
      navigate("/");
    } catch (err: any) {
      setError(err.message || "An error occurred while updating your profile.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <DefaultLayout>
      <div className="flex flex-col items-center justify-center w-full max-w-md mx-auto mt-10">
        <h1 className="text-3xl font-bold mb-6">Complete Your Profile</h1>
        
        {error && (
          <div className="w-full p-3 mb-4 text-sm text-red-500 bg-red-100 rounded-md">
            {error}
          </div>
        )}
        
        <form onSubmit={handleUpdateProfile} className="w-full space-y-4">
          <div className="mb-4">
            <label htmlFor="username" className="block text-sm font-medium mb-1">
              Username
            </label>
            <Input
              id="username"
              type="text"
              aria-label="Username"
              placeholder="Choose a username"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              classNames={{
                inputWrapper: "w-full",
                input: "w-full"
              }}
              required
            />
          </div>

          <div className="mb-4">
            <label htmlFor="bio" className="block text-sm font-medium mb-1">
              Bio
            </label>
            <Textarea
              id="bio"
              aria-label="Bio"
              placeholder="Tell us about yourself..."
              value={bio}
              onChange={(e) => setBio(e.target.value)}
              className="w-full min-h-[100px]"
              required
            />
          </div>
          
          <Button 
            type="submit" 
            className="w-full"
            disabled={loading}
          >
            {loading ? "Saving..." : "Save Profile"}
          </Button>
        </form>
      </div>
    </DefaultLayout>
  );
}