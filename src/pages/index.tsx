import DefaultLayout from "@/layouts/default";
import UnicornStudioEmbed from "@/components/UnicornStudioEmbed.tsx";
import { SplashCursor } from "@/components/ui/splash-cursor";
import { Hero } from "@/components/ui/animated-hero";

export default function IndexPage() {
  return (
    <DefaultLayout>
      <SplashCursor />
      <section className="flex flex-col items-center justify-center gap-4 py-8 md:py-10">
        <UnicornStudioEmbed/>
      </section>
      <div className="block">
        <Hero />
      </div>
    </DefaultLayout>
  );
}