import { useEffect, useState } from "react";
import { isTauri } from "@tauri-apps/api/core";

export const useTauriEnv = () => {
  const [isDesktop, setIsDesktop] = useState(false);
  const [osPlatform, setOsPlatform] = useState<
    "windows" | "macos" | "linux" | "unknown" | "web"
  >("web");

  useEffect(() => {
    const setup = async () => {
      const runningInTauri = isTauri();
      setIsDesktop(runningInTauri);

      if (!runningInTauri) {
        setOsPlatform("web");
        return;
      }

      // Dynamically import plugin only inside Tauri
      const { platform } = await import("@tauri-apps/plugin-os");

      const p = await platform();
      setOsPlatform(p as any);
    };

    setup();
  }, []);

  return { isDesktop, osPlatform };
};
