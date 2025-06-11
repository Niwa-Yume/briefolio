import { title } from "@/components/primitives";
import DefaultLayout from "@/layouts/default";
import { AnimatedCard } from "@/components/ui/feature-block-animated-card";

export default function MonthlyPage() {
  return (
    <DefaultLayout>
      <section className="flex flex-col items-center justify-center gap-4 md:py-10">
        <div className="inline-block max-w-lg text-center justify-center">
          <h1 className={title()}>Brief du mois</h1>
        </div>
      </section>
      <AnimatedCard
        title="Titre du projet"
        description="ceci est une description du projet du mois. Il s'agit d'un projet fictif pour illustrer l'utilisation de la carte animée."
        icons={[
          {
            icon: (
              <img
                src="https://cdn.cosmos.so/2d774ea0-4b4f-4d9f-a634-6b6c5a130e91?format=jpeg"
                alt="Icône"
                className="object-cover"
              />
            ),
            size: "xxl",
          },
        ]}
      />
    </DefaultLayout>
  );
}