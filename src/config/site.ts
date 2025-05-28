export type SiteConfig = typeof siteConfig;

export const siteConfig = {
  name: "Briefolio",
  description: "Faites-vous un magnifique Portofolio, avec de vrai projet.",
  navItems: [
    {
      label: "Accueil",
      href: "/",
    },
    {
      label: "Projet du mois",
      href: "/monthly",
    },
    {
      label: "Catégorie de Brief",
      href: "/category",
    },
    {
      label: "Contact",
      href: "/contact",
    },
  ],
  navMenuItems: [
    {
      label: "Accueil",
      href: "/",
    },
    {
      label: "Projet du mois",
      href: "/monthly",
    },
    {
      label: "Catégorie de Brief",
      href: "/category",
    },
    {
      label: "Contact",
      href: "/contact",
    },
  ],
  links: {
    github: "https://github.com/frontio-ai/heroui",
    twitter: "https://twitter.com/hero_ui",
    docs: "https://heroui.com",
    discord: "https://discord.gg/9b6yyZKmH4",
    sponsor: "https://patreon.com/jrgarciadev",
  },
};
