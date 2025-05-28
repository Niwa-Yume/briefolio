import { Kbd } from "@heroui/kbd";
import { Link } from "@heroui/link";
import { Input } from "@heroui/input";
import {
  Navbar as HeroUINavbar,
  NavbarBrand,
  NavbarContent,
  NavbarItem,
  NavbarMenuToggle,
  NavbarMenu,
  NavbarMenuItem
} from "@heroui/navbar";
import { link as linkStyles } from "@heroui/theme";
import clsx from "clsx";
import { useEffect, useState } from "react";
import { User } from "@supabase/supabase-js";

import { siteConfig } from "@/config/site";
import { ThemeSwitch } from "@/components/theme-switch";
import {
  GithubIcon,
  SearchIcon
} from "@/components/icons";
import { Logo } from "@/components/icons";
import { supabase } from "@/lib/supabase";
import { createDefaultProfile } from "@/lib/profileService";
import { Button } from "@/components/ui/button";

// Composant principal de la barre de navigation
export const Navbar = () => {
  // États séparés pour une meilleure gestion
  const [user, setUser] = useState<User | null>(null);
  const [isInitializing, setIsInitializing] = useState(true);
  const [isLoggingOut, setIsLoggingOut] = useState(false);

  // Vérifier l'état d'authentification au chargement du composant
  useEffect(() => {
    const getSession = async () => {
      console.log("🔄 Début de getSession()");
      try {
        const { data, error } = await supabase.auth.getSession();
        if (error) {
          console.error("❌ Erreur lors de la récupération de la session:", error);
          throw error;
        }

        const currentUser = data.session?.user || null;
        setUser(currentUser);

        // Créer le profil par défaut si l'utilisateur est connecté
        if (currentUser) {
          try {
            await createDefaultProfile(currentUser.id);
          } catch (profileError) {
            console.error("❌ Erreur lors de la création du profil:", profileError);
            // Ne pas bloquer l'authentification si la création du profil échoue
          }
        }
      } catch (error) {
        console.error("❌ Erreur lors de l'initialisation:", error);
        setUser(null);
      } finally {
        setIsInitializing(false);
      }
    };

    getSession();

    // Configuration du listener d'authentification
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      async (event, session) => {
        console.log("🔄 Auth state change:", event, session?.user?.email || 'no user');

        const newUser = session?.user || null;
        setUser(newUser);

        // Créer le profil par défaut lors de la connexion
        if (event === "SIGNED_IN" && newUser) {
          try {
            await createDefaultProfile(newUser.id);
          } catch (profileError) {
            console.error("❌ Erreur lors de la création du profil:", profileError);
          }
        }

        // Réinitialiser l'état de déconnexion
        if (event === "SIGNED_OUT") {
          setIsLoggingOut(false);
        }
      }
    );

    // Nettoyage du listener
    return () => {
      subscription.unsubscribe();
    };
  }, []);

  // Fonction de déconnexion améliorée
  const handleLogout = async () => {
    console.log("🔄 Début de la déconnexion...");

    try {
      setIsLoggingOut(true);

      // Déconnexion avec Supabase
      const { error } = await supabase.auth.signOut();

      if (error) {
        console.error("❌ Erreur Supabase lors de la déconnexion:", error);
        throw error;
      }

      console.log("✅ Déconnexion réussie");

      // Le listener onAuthStateChange va gérer la mise à jour de l'état
      // Donc pas besoin de faire setUser(null) ici

    } catch (error) {
      console.error("❌ Erreur lors de la déconnexion:", error);

      // En cas d'erreur, forcer la déconnexion locale
      setUser(null);
      setIsLoggingOut(false);

      // Optionnel : afficher une notification d'erreur à l'utilisateur
      alert("Erreur lors de la déconnexion. Vous avez été déconnecté localement.");
    }
  };

  // Champ de recherche avec une icône et un raccourci clavier (Cmd+K)
  const searchInput = (
    <Input
      aria-label="Rechercher..."
      classNames={{
        inputWrapper: "bg-default-100",
        input: "text-sm"
      }}
      endContent={
        <Kbd className="hidden lg:inline-block" keys={["command"]}>
          K
        </Kbd>
      }
      labelPlacement="outside"
      placeholder="Rechercher..."
      startContent={
        <SearchIcon className="text-base text-default-400 pointer-events-none flex-shrink-0" />
      }
      type="search"
    />
  );

  return (
    <HeroUINavbar maxWidth="xl" position="sticky">
      {/* Contenu de gauche : logo et liens principaux */}
      <NavbarContent className="basis-1/5 sm:basis-full" justify="start">
        {/* Logo et nom de la marque */}
        <NavbarBrand className="gap-3 max-w-fit">
          <Link
            className="flex justify-start items-center gap-1"
            color="foreground"
            href="/"
          >
            <Logo size={120} height={120} />
          </Link>
        </NavbarBrand>

        {/* Liens principaux visibles sur les grands écrans */}
        <div className="hidden lg:flex gap-4 justify-start ml-2">
          {siteConfig.navItems
            .filter(item => user ? (item.href !== "/register" && item.href !== "/login") : true)
            .map((item) => (
              <NavbarItem key={item.href}>
                <Link
                  className={clsx(
                    linkStyles({ color: "foreground" }),
                    "data-[active=true]:text-primary data-[active=true]:font-medium"
                  )}
                  color="foreground"
                  href={item.href}
                >
                  {item.label}
                </Link>
              </NavbarItem>
            ))}
        </div>
      </NavbarContent>

      {/* Contenu de droite */}
      <NavbarContent
        className="flex basis-1/5 sm:basis-full"
        justify="end"
      >
        {/* Boutons d'authentification */}
        {!isInitializing && (
          <>
            {user ? (
              // Utilisateur connecté: afficher email et bouton de déconnexion
              <NavbarItem className="flex gap-2 items-center">
                <span className="text-sm">{user.email}</span>
                <Button
                  onClick={handleLogout}
                  variant="ghost"
                  className="text-sm"
                  disabled={isLoggingOut}
                >
                  {isLoggingOut ? "Déconnexion..." : "Déconnexion"}
                </Button>
              </NavbarItem>
            ) : (
              // Utilisateur non connecté: afficher boutons de connexion et d'inscription
              <NavbarItem className="lg:flex gap-2">
                <Link href="/login">
                  <Button variant="ghost" className="text-sm">
                    Connexion
                  </Button>
                </Link>
                <Link href="/register">
                  <Button className="text-sm">
                    Inscription
                  </Button>
                </Link>
              </NavbarItem>
            )}
          </>
        )}

        {/* Icônes sociales */}
        <NavbarItem className="flex gap-2">
          <ThemeSwitch />
        </NavbarItem>

        {/* Champ de recherche visible sur les grands écrans */}
        <NavbarItem className="hidden lg:flex">{searchInput}</NavbarItem>
      </NavbarContent>

      {/* Contenu pour les petits écrans : icônes et menu hamburger */}
      <NavbarContent className="sm:hidden basis-1 pl-4" justify="end">
        <Link isExternal href={siteConfig.links.github}>
          <GithubIcon className="text-default-500" />
        </Link>
        <ThemeSwitch />
        <NavbarMenuToggle />
      </NavbarContent>

      {/* Menu déroulant pour les petits écrans */}
      <NavbarMenu>
        {searchInput}
        <div className="mx-4 mt-2 flex flex-col gap-2">
          {/* Options d'authentification pour mobile */}
          {!isInitializing && (
            <>
              {user ? (
                // Utilisateur connecté
                <>
                  <NavbarMenuItem>
                    <div className="text-sm font-medium mb-2">
                      Connecté en tant que: {user.email}
                    </div>
                  </NavbarMenuItem>
                  <NavbarMenuItem>
                    <Link
                      color="danger"
                      href="#"
                      size="lg"
                      onClick={(e) => {
                        e.preventDefault();
                        handleLogout();
                      }}
                    >
                      {isLoggingOut ? "Déconnexion..." : "Déconnexion"}
                    </Link>
                  </NavbarMenuItem>
                </>
              ) : (
                // Utilisateur non connecté
                <>
                  <NavbarMenuItem>
                    <Link
                      color="primary"
                      href="/login"
                      size="lg"
                    >
                      Connexion
                    </Link>
                  </NavbarMenuItem>
                  <NavbarMenuItem>
                    <Link
                      color="primary"
                      href="/register"
                      size="lg"
                    >
                      Inscription
                    </Link>
                  </NavbarMenuItem>
                </>
              )}
            </>
          )}

          {/* Liens de navigation standard */}
          {siteConfig.navMenuItems.map((item, index) => (
            <NavbarMenuItem key={`${item}-${index}`}>
              <Link
                color="foreground"
                href={item.href || "#"}
                size="lg"
              >
                {item.label}
              </Link>
            </NavbarMenuItem>
          ))}
        </div>
      </NavbarMenu>
    </HeroUINavbar>
  );
};