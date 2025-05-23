import DefaultLayout from "@/layouts/default";
import UnicornStudioEmbed from "@/components/UnicornStudioEmbed.tsx";
import { SplashCursor } from "@/components/ui/splash-cursor";
import { Hero } from "@/components/ui/animated-hero";
import AnimatedTextCycle from "@/components/ui/animated-text-cycle";
import AnimatedGradientBackground from "@/components/ui/animated-gradient-background";
import { DotLottieReact } from '@lottiefiles/dotlottie-react';


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
      <div className="flex justify-center items-center w-full">
        <div className="p-4 max-w-[800px]">
          <h1 className="text-4xl font-light text-left text-muted-foreground whitespace-nowrap flex items-center">
            Votre
            <span className="mx-3">
        <AnimatedTextCycle
          words={[
            "recruteur",
            "projet",
            "professeur",
            "portfolio",
            "patron",
            "idée",
          ]}
          interval={1500}
          className="text-foreground font-semi-bold"
        />
      </span>
            mérite de meilleures projets
          </h1>
        </div>
      </div>

      {/* fona animé */}


      {/* CTA */}
      <div className="block">
        <Hero />
      </div>
    </DefaultLayout>
  );
}