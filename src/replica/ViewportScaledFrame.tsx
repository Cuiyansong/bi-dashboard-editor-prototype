import { useLayoutEffect, useRef, useState, type ReactNode } from "react";

const DESIGN_W = 1920;
const DESIGN_H = 918;
const PAD = 32;

/** `transform: scale` 会导致 HTML5 拖放命中错位；Chromium 系优先用 `zoom`。 */
function cssZoomSupported(): boolean {
  return typeof document !== "undefined" && "zoom" in document.documentElement.style;
}

export function ViewportScaledFrame({ children }: { children: ReactNode }) {
  const hostRef = useRef<HTMLDivElement>(null);
  const [scale, setScale] = useState(1);
  const [useZoom, setUseZoom] = useState(cssZoomSupported);

  useLayoutEffect(() => {
    setUseZoom(cssZoomSupported());
  }, []);

  useLayoutEffect(() => {
    const el = hostRef.current;
    if (!el) return;

    const measure = () => {
      const rect = el.getBoundingClientRect();
      const sx = (rect.width - PAD) / DESIGN_W;
      const sy = (rect.height - PAD) / DESIGN_H;
      const s = Math.min(Math.max(0.2, Math.min(sx, sy, 1)), 1);
      setScale(s);
    };

    measure();
    const ro = new ResizeObserver(measure);
    ro.observe(el);
    window.addEventListener("resize", measure);
    return () => {
      ro.disconnect();
      window.removeEventListener("resize", measure);
    };
  }, []);

  return (
    <div ref={hostRef} className="flex h-[100dvh] w-full min-h-0 items-center justify-center overflow-hidden bg-[#eceff4] p-4">
      <div
        className="shrink-0"
        style={{
          width: DESIGN_W * scale,
          height: DESIGN_H * scale,
        }}
      >
        <div
          style={
            useZoom
              ? {
                  width: DESIGN_W,
                  height: DESIGN_H,
                  zoom: scale,
                }
              : {
                  width: DESIGN_W,
                  height: DESIGN_H,
                  transform: `scale(${scale})`,
                  transformOrigin: "top left",
                }
          }
        >
          {children}
        </div>
      </div>
    </div>
  );
}
