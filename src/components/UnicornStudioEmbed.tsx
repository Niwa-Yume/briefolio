import { useEffect } from "react";

const UnicornStudioEmbed = () => {
  useEffect(() => {
    if (!(window as any).UnicornStudio) {
      (window as any).UnicornStudio = { isInitialized: false };

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
      style={{ width: "1440px", height: "900px" }}
    />
  );
};

export default UnicornStudioEmbed;
