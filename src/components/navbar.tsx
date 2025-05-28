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
  // État pour suivre si l'utilisateur est connecté
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  // Vérifier l'état d'authentification au chargement du composant
// Ajoutez ces logs de debug dans votre useEffect pour identifier le problème

  useEffect(() => {
    const getSession = async () => {
      console.log("🔄 Début de getSession()");
      try {
        const { data, error } = await supabase.auth.getSession();
        if (error) throw error;
        setUser(data.session?.user || null);

        if (data.session?.user) {
          await createDefaultProfile(data.session.user.id);
        }
      } catch (error) {
        console.error("❌ Erreur:", error);
      } finally {
        setLoading(false);
      }
    };

    getSession();

    // Configuration du listener d'authentification
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      async (event, session) => {
        console.log("🔄 Auth state change:", event);
        setUser(session?.user || null);

        if (event === "SIGNED_IN" && session?.user) {
          await createDefaultProfile(session.user.id);
        }
      }
    );

    // Nettoyage du listener
    return () => {
      subscription.unsubscribe();
    };
  }, []);

// État de déconnexion
  const [isLoggingOut, setIsLoggingOut] = useState(false);

// Fonction de déconnexion
  const handleLogout = async () => {
    try {
      setIsLoggingOut(true);
      const { error } = await supabase.auth.signOut();
      if (error) throw error;

      setUser(null);
    } catch (error) {
      console.error("Erreur de déconnexion:", error);
    } finally {
      setIsLoggingOut(false);
    }
  };

  // Champ de recherche avec une icône et un raccourci clavier (Cmd+K)
  const searchInput = (
    <Input
      aria-label="Rechercher..." // Accessibilité : étiquette pour les lecteurs d'écran
      classNames={{
        inputWrapper: "bg-default-100", // Style du conteneur
        input: "text-sm" // Style du champ de saisie
      }}
      endContent={
        <Kbd className="hidden lg:inline-block" keys={["command"]}>
          K
        </Kbd> // Affiche "Cmd+K" pour les raccourcis clavier
      }
      labelPlacement="outside"
      placeholder="Rechercher..." // Texte indicatif dans le champ
      startContent={
        <SearchIcon className="text-base text-default-400 pointer-events-none flex-shrink-0" />
      } // Icône de recherche à gauche
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
        {(
          <>
            {user ? (
              // Utilisateur connecté: afficher email et bouton de déconnexion
              <NavbarItem className="flex gap-2 items-center">
                <span className="text-sm">{user.email}</span>
                <Button
                  onClick={handleLogout}
                  variant="ghost"
                  className="text-sm"
                >
                  Déconnexion
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
                    inscription
                  </Button>
                </Link>
              </NavbarItem>
            )}
          </>
        )}

        {/* Icônes sociales */}
        <NavbarItem className="flex gap-2">
          <ThemeSwitch /> {/* Switch (clair/sombre) */}
        </NavbarItem>

        {/* Champ de recherche visible sur les grands écrans */}
        <NavbarItem className="hidden lg:flex">{searchInput}</NavbarItem>

      </NavbarContent>

      {/* Contenu pour les petits écrans : icônes et menu hamburger */}
      <NavbarContent className="sm:hidden basis-1 pl-4" justify="end">
        <Link isExternal href={siteConfig.links.github}>
          <GithubIcon className="text-default-500" />
        </Link>
        <ThemeSwitch /> {/* Commutateur de thème */}
        <NavbarMenuToggle /> {/* Bouton pour ouvrir le menu */}
      </NavbarContent>

      {/* Menu déroulant pour les petits écrans */}
      <NavbarMenu>
        {searchInput} {/* Champ de recherche dans le menu */}
        <div className="mx-4 mt-2 flex flex-col gap-2">
          {/* Options d'authentification pour mobile */}
          {!loading && (
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
                      Déconnexion
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
                      inscription
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
                {item.label} {/* Texte du lien */}
              </Link>
            </NavbarMenuItem>
          ))}
        </div>
      </NavbarMenu>
    </HeroUINavbar>
  );
};
