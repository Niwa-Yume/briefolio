import { useState } from "react";
import { Link } from "@heroui/link";
import { Input } from "@heroui/input";

import DefaultLayout from "@/layouts/default";
import { Button } from "@/components/ui/button";
import { GithubIcon } from "@/components/icons";
import { supabase } from "@/lib/supabase";

export default function RegisterPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);

  // Function to handle email/password registration
  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    try {
      const { data, error } = await supabase.auth.signUp({
        email,
        password,
      });

      if (error) throw error;

      setSuccess("Inscription réussie! Veuillez vérifier votre email pour confirmer votre compte.");
    } catch (err: any) {
      setError(err.message || "Une erreur s'est produite lors de l'inscription.");
    } finally {
      setLoading(false);
    }
  };

  // Function to handle GitHub authentication
  const handleGithubLogin = async () => {
    setLoading(true);
    setError(null);

    try {
      const { data, error } = await supabase.auth.signInWithOAuth({
        provider: 'github',
        options: {
          redirectTo: window.location.origin,
        },
      });

      if (error) throw error;
    } catch (err: any) {
      setError(err.message || "Une erreur s'est produite lors de la connexion avec GitHub.");
      setLoading(false);
    }
  };

  return (
    <DefaultLayout>
      <div className="flex flex-col items-center justify-center w-full max-w-md mx-auto mt-10">
        <h1 className="text-3xl font-bold mb-6">Créer un compte</h1>

        {error && (
          <div className="w-full p-3 mb-4 text-sm text-red-500 bg-red-100 rounded-md">
            {error}
          </div>
        )}

        {success && (
          <div className="w-full p-3 mb-4 text-sm text-green-500 bg-green-100 rounded-md">
            {success}
          </div>
        )}

        {/* GitHub Authentication Button */}
        <Button 
          onClick={handleGithubLogin}
          className="w-full mb-4 gap-2 bg-gray-800 hover:bg-gray-900"
          disabled={loading}
        >
          <GithubIcon className="h-5 w-5" />
          Continuer avec GitHub
        </Button>

        <div className="flex items-center w-full my-4">
          <div className="flex-grow h-px bg-gray-300"></div>
          <span className="px-3 text-sm text-gray-500">ou</span>
          <div className="flex-grow h-px bg-gray-300"></div>
        </div>

        {/* Email/Password Registration Form */}
        <form onSubmit={handleRegister} className="w-full space-y-4">
          <div className="mb-4">
            {/* eslint-disable-next-line jsx-a11y/label-has-associated-control */}
            <label className="block text-sm font-medium mb-1">Email</label>
            <Input
              type="email"
              aria-label="Email"
              placeholder="votre@email.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              classNames={{
                inputWrapper: "w-full",
                input: "w-full"
              }}
            />
          </div>

          <div className="mb-4">
            <label className="block text-sm font-medium mb-1">Mot de passe</label>
            <Input
              type="password"
              aria-label="Mot de passe"
              placeholder="********"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              classNames={{
                inputWrapper: "w-full",
                input: "w-full"
              }}
            />
          </div>

          <Button 
            type="submit" 
            className="w-full"
            disabled={loading}
          >
            {loading ? "Chargement..." : "S'inscrire"}
          </Button>
        </form>

        <p className="mt-6 text-sm text-center">
          Vous avez déjà un compte?{" "}
          <Link href="/login" color="primary">
            Se connecter
          </Link>
        </p>
      </div>
    </DefaultLayout>
  );
}
