import { useState } from "react";
import { Link } from "@heroui/link";
import { Button } from "@/components/ui/button";
import { GithubIcon, GoogleIcon } from "@/components/icons";
import { useAuth } from "@/contexts/AuthContext";
import DefaultLayout from "@/layouts/default";

export default function RegisterPage() {
  const { loginWithProvider, loading } = useAuth();
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);

  // OAuth GitHub
  const handleGithubLogin = async () => {
    setError(null);
    setSuccess(null);
    try {
      await loginWithProvider("github");
      // La redirection sera gérée par le useEffect dans CompleteProfilePage
    } catch (err: any) {
      setError(err.message || "Une erreur s'est produite lors de la connexion avec GitHub.");
    }
  };

  // OAuth Google
  const handleGoogleLogin = async () => {
    setError(null);
    setSuccess(null);
    try {
      await loginWithProvider("google");
      // La redirection sera gérée par le useEffect dans CompleteProfilePage
    } catch (err: any) {
      setError(err.message || "Une erreur s'est produite lors de la connexion avec Google.");
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

        <Button
          onClick={handleGithubLogin}
          className="w-full mb-4 gap-2 bg-gray-800 hover:bg-gray-900"
          disabled={loading}
        >
          <GithubIcon className="h-5 w-5" />
          Continuer avec GitHub
        </Button>

        <Button
          onClick={handleGoogleLogin}
          className="w-full mb-4 gap-2 bg-white text-gray-800 border border-gray-300 hover:bg-gray-100"
          disabled={loading}
        >
          <GoogleIcon className="h-5 w-5" />
          Continuer avec Google
        </Button>

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