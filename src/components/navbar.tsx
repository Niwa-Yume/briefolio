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
  const [isLoading, setIsLoading] = useState(false);
  const [isInitializing, setIsInitializing] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    const initializeAuth = async () => {
      try {
        const { data: { session } } = await supabase.auth.getSession();
        if (session?.user) {
          setUser(session.user);
          await createDefaultProfile(session.user.id);
        }
      } catch (error) {
        console.error('Error initializing auth:', error);
      } finally {
        setIsInitializing(false);
      }
    };

    initializeAuth();

    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      async (event, session) => {
        if (event === "SIGNED_IN" && session?.user) {
          setUser(session.user);
          await createDefaultProfile(session.user.id);
        } else if (event === "SIGNED_OUT") {
          setUser(null);
        }
      }
    );

    return () => {
      subscription.unsubscribe();
    };
  }, []);

  const handleLogout = async () => {
    try {
      setIsLoading(true);
      const { error } = await supabase.auth.signOut();

      if (error) {
        console.error('Error signing out:', error);
        return;
      }

      navigate('/login');
    } catch (error) {
      console.error('Error during logout:', error);
    } finally {
      setIsLoading(false);
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
        <Kbd className="hidden lg:inline-block\" keys={["command"]}>
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

  if (isInitializing) {
    return <div className="flex items-center justify-center p-4">Chargement...</div>;
  }

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
        {user ? (
          <NavbarItem className="flex gap-2 items-center">
            <span className="text-sm">{user.email}</span>
            <Button
              onClick={handleLogout}
              variant="ghost"
              className="text-sm"
              disabled={isLoading}
            >
              {isLoading ? 'Déconnexion...' : 'Déconnexion'}
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
          {isLoading ? (
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