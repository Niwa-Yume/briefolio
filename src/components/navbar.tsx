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

import { siteConfig } from "@/config/site";
import { ThemeSwitch } from "@/components/theme-switch";
import {
  GithubIcon,
  SearchIcon,
} from "@/components/icons";
import { Logo } from "@/components/icons";

// Composant principal de la barre de navigation
export const Navbar = () => {
  // Champ de recherche avec une icône et un raccourci clavier (Cmd+K)
  const searchInput = (
    <Input
      aria-label="Rechercher..." // Accessibilité : étiquette pour les lecteurs d'écran
      classNames={{
        inputWrapper: "bg-default-100", // Style du conteneur
        input: "text-sm", // Style du champ de saisie
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
          {siteConfig.navItems.map((item) => (
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
        className="hidden sm:flex basis-1/5 sm:basis-full"
        justify="end"
      >
        {/* Icônes sociales */}
        <NavbarItem className="hidden sm:flex gap-2">
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
          {siteConfig.navMenuItems.map((item, index) => (
            <NavbarMenuItem key={`${item}-${index}`}>
              <Link
                color={
                  index === 2
                    ? "primary" // Couleur spéciale pour le 3e élément
                    : index === siteConfig.navMenuItems.length - 1
                      ? "danger" // Couleur spéciale pour le dernier élément
                      : "foreground"
                }
                href="#"
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