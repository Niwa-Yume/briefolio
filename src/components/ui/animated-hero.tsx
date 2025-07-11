import { useEffect, useMemo, useState } from "react";
import { motion } from "framer-motion";
import { MoveRight, PhoneCall } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";

function Hero() {
  const [titleNumber, setTitleNumber] = useState(0);
  const titles = useMemo(
    () => ["Incoryable", "nouveau", "innovant", "Créatif", "Intélligent"],
    []
  );

  useEffect(() => {
    const timeoutId = setTimeout(() => {
      if (titleNumber === titles.length - 1) {
        setTitleNumber(0);
      } else {
        setTitleNumber(titleNumber + 1);
      }
    }, 2000);
    return () => clearTimeout(timeoutId);
  }, [titleNumber, titles]);

  return (
    <div className="w-full">
      <div className="container mx-auto">
        <div className="flex gap-8 py-20 lg:py-40 items-center justify-center flex-col">
          <div>
            <Button variant="secondary" size="sm" className="gap-4" asChild>
              <Link to="/register">
                Lance toi aujourd'hui <MoveRight className="w-4 h-4" />
              </Link>
            </Button>
          </div>
          <div className="flex gap-4 flex-col">
            <h1 className="text-5xl md:text-7xl max-w-2xl tracking-tighter text-center font-regular">
              <span className="text-spektr-cyan-50">C'est pour des projets</span>
              <span className="relative flex w-full justify-center overflow-hidden text-center md:pb-4 md:pt-1">
                &nbsp;
                {titles.map((title, index) => (
                  <motion.span
                    key={index}
                    className="absolute font-semibold"
                    initial={{ opacity: 0, y: "-100" }}
                    transition={{ type: "spring", stiffness: 50 }}
                    animate={
                      titleNumber === index
                        ? {
                            y: 0,
                            opacity: 1,
                          }
                        : {
                            y: titleNumber > index ? -150 : 150,
                            opacity: 0,
                          }
                    }
                  >
                    {title}
                  </motion.span>
                ))}
              </span>
            </h1>

            <p className="text-lg md:text-xl leading-relaxed tracking-tight text-muted-foreground max-w-2xl text-center">
              Trouver des projets vraiment pertinents pour enrichir son portfolio, sans tomber dans le déjà-vu, c’est un vrai défi. Ne perdez plus de temps avec des idées banales ou peu valorisantes. Briefolio a été créé pour proposer des projets uniques, concrets et inspirants, afin de bâtir un portfolio qui sort réellement du lot.
            </p>
          </div>
          <div className="flex flex-row gap-3 flex-wrap justify-center w-full">
            <Button size="lg" className="gap-4 w-full sm:w-auto" variant="outline" asChild>
              <Link to="/category">
                Regarder la liste de brief <PhoneCall className="w-4 h-4" />
              </Link>
            </Button>
            <Button size="lg" className="gap-4 w-full sm:w-auto" asChild>
              <Link to="/register">
                Inscris toi ici <MoveRight className="w-4 h-4" />
              </Link>
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}

export { Hero };
