import { Link } from "@heroui/link";
import { button as buttonStyles } from "@heroui/theme";

import { siteConfig } from "@/config/site";
import { title, subtitle } from "@/components/primitives";
import { GithubIcon } from "@/components/icons";
import DefaultLayout from "@/layouts/default";
import UnicornStudioEmbed from "@/components/UnicornStudioEmbed.tsx";

export default function IndexPage() {
  return (
    <DefaultLayout>
      <section className="flex flex-col items-center justify-center gap-4 py-8 md:py-10">
        <UnicornStudioEmbed/>
        <div className="inline-block max-w-lg text-center justify-center">
          <span className={title()}>Créer&nbsp;</span>
          <span className={title({ color: "violet" })}>vous&nbsp;</span>
          <br />
          <span className={title()}>
            un magnifique portfolio.
          </span>
          <div className={subtitle({ class: "mt-4" })}>
            Mémorable et avec de vrai projet.
          </div>
        </div>

        <div className="flex gap-3">
          <Link
            isExternal
            className={buttonStyles({
              color: "primary",
              radius: "full",
              variant: "shadow",
            })}
            href={siteConfig.links.docs}
          >
            Découvrir les projets
          </Link>
          <Link
            isExternal
            className={buttonStyles({ variant: "bordered", radius: "full" })}
            href={siteConfig.links.github}
          >
            <GithubIcon size={20} />
            Voir les projets du mois
          </Link>
        </div>
      </section>
    </DefaultLayout>
  );
}
