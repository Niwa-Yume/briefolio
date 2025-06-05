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
  NavbarMenuItem,
} from "@heroui/navbar";
import { link as linkStyles } from "@heroui/theme";
import clsx from "clsx";
import { useState } from "react";
import { useNavigate } from "react-router-dom";

import { siteConfig } from "@/config/site";
import { ThemeSwitch } from "@/components/theme-switch";
import { GithubIcon, SearchIcon } from "@/components/icons";
import { Logo } from "@/components/icons";
import { Button } from "@/components/ui/button";
import { useAuth } from "@/contexts/AuthContext.tsx";

export const Navbar = () => {
  const { user, logout } = useAuth();
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();

  const searchInput = (
    <Input
      aria-label="Rechercher..."
      classNames={{
        inputWrapper: "bg-default-100",
        input: "text-sm",
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

  const handleLogout = async () => {
    try {
      setIsLoading(true);
      await logout();
      navigate("/login");
    } catch (error) {
      console.error("Erreur lors de la déconnexion:", error);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <HeroUINavbar maxWidth="xl" position="sticky">
      <NavbarContent className="basis-1/5 sm:basis-full" justify="start">
        <NavbarBrand className="gap-3 max-w-fit">
          <Link
            className="flex justify-start items-center gap-1"
            color="foreground"
            href="/"
          >
            <Logo height={120} size={120} />
          </Link>
        </NavbarBrand>

        <div className="hidden lg:flex gap-4 justify-start ml-2">
          {siteConfig.navItems
            .filter((item) =>
              user ? item.href !== "/register" && item.href !== "/login" : true,
            )
            .map((item) => (
              <NavbarItem key={item.href}>
                <Link
                  className={clsx(
                    linkStyles({ color: "foreground" }),
                    "data-[active=true]:text-primary data-[active=true]:font-medium",
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
              className="text-sm"
              disabled={isLoading}
              variant="ghost"
              onClick={handleLogout}
            >
              {isLoading ? "Déconnexion..." : "Déconnexion"}
            </Button>
          </NavbarItem>
        ) : (
          <NavbarItem className="lg:flex gap-2">
            <Link href="/login">
              <Button className="text-sm" variant="ghost">
                Connexion
              </Button>
            </Link>
            <Link href="/register">
              <Button className="text-sm">Inscription</Button>
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
              <Link color="foreground" href={item.href || "#"} size="lg">
                {item.label}
              </Link>
            </NavbarMenuItem>
          ))}
        </div>
      </NavbarMenu>
    </HeroUINavbar>
  );
};
