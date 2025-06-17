import DefaultLayout from "@/layouts/default";
import UnicornStudioEmbed from "@/components/UnicornStudioEmbed.tsx";
import { SplashCursor } from "@/components/ui/splash-cursor";
import { Hero } from "@/components/ui/animated-hero";
import AnimatedTextCycle from "@/components/ui/animated-text-cycle";

export default function IndexPage() {
  return (
    <DefaultLayout>

      {/* effet de curseur */}
      <SplashCursor />

      {/* effet de blob 3D */}
      <section className="flex flex-col items-center justify-center gap-4 py-8 md:py-10 overflow-x-hidden">
        <UnicornStudioEmbed/>
      </section>

      {/* effet de mot */}
      <div className="flex flex-col justify-center items-center w-full px-2">
        <div className="p-4 w-full max-w-[800px]">
          <h1 className="text-4xl font-light text-left text-muted-foreground flex flex-wrap items-center w-full">
            Votre
            <span className="mx-3 min-w-0 flex-1 max-w-full overflow-x-hidden">
              <AnimatedTextCycle
                words={[
                  "recruteur",
                  "professeur",
                  "portfolio",
                  "patron",
                  "créativité",
                ]}
                interval={1500}
                className="text-foreground font-semi-bold"
              />
            </span>
            mérite de meilleures projets
          </h1>
        </div>
      </div>

      {/* CTA */}
      <div className="block">
        <Hero />
      </div>
    </DefaultLayout>
  );
}