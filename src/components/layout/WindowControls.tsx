import React, { useEffect, useState } from "react";
import { Minus, Square, Copy, X } from "lucide-react";
import { getCurrentWindow } from "@tauri-apps/api/window";
import { useI18n } from "@/locales";
import "./window-controls.css";

export const WindowControls: React.FC = () => {
  const { t } = useI18n();
  const [isMaximized, setIsMaximized] = useState(false);

  useEffect(() => {
    try {
      const appWindow = getCurrentWindow();
      appWindow.isMaximized().then(setIsMaximized).catch(() => {});
      
      const unlisten = appWindow.onResized(async () => {
        try {
          const max = await appWindow.isMaximized();
          setIsMaximized(max);
        } catch {}
      });

      return () => {
        unlisten.then((fn) => fn()).catch(() => {});
      };
    } catch {}
  }, []);

  const handleMinimize = async () => {
    try {
      await getCurrentWindow().minimize();
    } catch (err) {
      console.error(err);
    }
  };

  const handleToggleMaximize = async () => {
    try {
      await getCurrentWindow().toggleMaximize();
      const max = await getCurrentWindow().isMaximized();
      setIsMaximized(max);
    } catch (err) {
      console.error(err);
    }
  };

  const handleClose = async () => {
    try {
      await getCurrentWindow().close();
    } catch (err) {
      console.error(err);
    }
  };

  const maximizeTitle = isMaximized ? t.windowControls.restore : t.windowControls.maximize;

  return (
    <div className="window-controls" data-tauri-drag-region="false">
      <button
        type="button"
        className="win-btn win-minimize"
        onClick={handleMinimize}
        title={t.windowControls.minimize}
        aria-label={t.windowControls.minimize}
      >
        <Minus size={11} strokeWidth={2} />
      </button>
      <button
        type="button"
        className="win-btn win-maximize"
        onClick={handleToggleMaximize}
        title={maximizeTitle}
        aria-label={maximizeTitle}
      >
        {isMaximized ? (
          <Copy size={10} strokeWidth={2} style={{ transform: "rotate(90deg)" }} />
        ) : (
          <Square size={10} strokeWidth={2} />
        )}
      </button>
      <button
        type="button"
        className="win-btn win-close"
        onClick={handleClose}
        title={t.windowControls.close}
        aria-label={t.windowControls.close}
      >
        <X size={12} strokeWidth={2} />
      </button>
    </div>
  );
};
