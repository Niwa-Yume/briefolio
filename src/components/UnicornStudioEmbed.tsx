import { useEffect } from "react";

const UnicornStudioEmbed = () => {
  useEffect(() => {
    if (!(window as any).UnicornStudio) {
      (window as any).UnicornStudio = { isInitialized: false };

      const interval = setInterval(() => {
        const canvas = document.querySelector('[data-us-project] canvas');
        if (canvas) {
          (canvas as HTMLElement).style.borderRadius = "30px";
          clearInterval(interval);
        }
      }, 100);

      const script = document.createElement("script");
      script.src =
        "https://cdn.jsdelivr.net/gh/hiunicornstudio/unicornstudio.js@v1.4.11/dist/unicornStudio.umd.js";
      script.onload = () => {
        if (!(window as any).UnicornStudio.isInitialized) {
          (window as any).UnicornStudio.init();
          (window as any).UnicornStudio.isInitialized = true;
        }
      };

      (document.head || document.body).appendChild(script);
    }
  }, []);

  return (
    <div
      data-us-project="EtMztKQLYrjjPU6lz8VB"
      data-testid="unicorn-embed"
      style={{
        width: "100%",
        maxWidth: "100%",
        height: "900px",
        borderRadius: "30px",
      }}
    />
  );
};

export default UnicornStudioEmbed;
