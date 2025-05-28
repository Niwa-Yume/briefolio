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
import { useNavigate } from "react-router-dom";
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

export const Navbar = () => {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();
  useEffect(() => {
    const getUser = async () => {
      try {
        const { data: { session } } = await supabase.auth.getSession();
        setUser(session?.user ?? null);
        if (session?.user) {
          await createDefaultProfile(session.user.id);
        }
      } catch (e) {
        setUser(null);
      } finally {
        setLoading(false);
      }
    };

    getUser();

    // Écoute les changements d’authentification
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      async (event, session) => {
        setUser(session?.user ?? null);
        setLoading(false);
        if (session?.user && event === 'SIGNED_IN') {
          await createDefaultProfile(session.user.id);
        }
      }
    );

    // Écoute les changements de session dans le localStorage (multi-onglet ou reload)
    const onStorage = (event: StorageEvent) => {
      if (event.key === 'supabase.auth.token') {
        getUser();
      }
    };
    window.addEventListener('storage', onStorage);

    return () => {
      subscription.unsubscribe();
      window.removeEventListener('storage', onStorage);
    };
  }, []);

  const handleLogout = async () => {
    try {
      setLoading(true);
      await supabase.auth.signOut();
      // Ne pas faire setUser(null) ici : l’écouteur onAuthStateChange s’en charge
      navigate("/login");
    } catch (e) {
      // Optionnel : gestion d’erreur
    } finally {
      setLoading(false);
    }
  };

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
      <NavbarContent className="basis-1/5 sm:basis-full" justify="start">
        <NavbarBrand className="gap-3 max-w-fit">
          <Link
            className="flex justify-start items-center gap-1"
            color="foreground"
            href="/"
          >
            <Logo size={120} height={120} />
          </Link>
        </NavbarBrand>

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

      <NavbarContent className="flex basis-1/5 sm:basis-full" justify="end">
        { user ? (
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

        <NavbarItem className="flex gap-2">
          <ThemeSwitch />
        </NavbarItem>

        <NavbarItem className="hidden lg:flex">{searchInput}</NavbarItem>
      </NavbarContent>

      <NavbarContent className="sm:hidden basis-1 pl-4" justify="end">
        <Link isExternal href={siteConfig.links.github}>
          <GithubIcon className="text-default-500" />
        </Link>
        <ThemeSwitch />
        <NavbarMenuToggle />
      </NavbarContent>

      <NavbarMenu>
        {searchInput}
        <div className="mx-4 mt-2 flex flex-col gap-2">
          {loading ? (
            <NavbarMenuItem>
              <span className="text-sm">Chargement...</span>
            </NavbarMenuItem>
          ) : user ? (
            <>
              <NavbarMenuItem>
                <div className="text-sm font-medium mb-2">
                  Connecté: {user.email}
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
            <>
              <NavbarMenuItem>
                <Link color="primary" href="/login" size="lg">
                  Connexion
                </Link>
              </NavbarMenuItem>
              <NavbarMenuItem>
                <Link color="primary" href="/register" size="lg">
                  Inscription
                </Link>
              </NavbarMenuItem>
            </>
          )}

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