import { useLayoutEffect, useRef, useState, type ReactNode } from "react";

const DESIGN_W = 1920;
const DESIGN_H = 918;
/** 与 host `p-4`（16px × 2）一致，用于计算可用缩放区域 */
const PAD = 32;

/**
 * 整页按 1920×918 设计稿等比缩放适配窗口。
 * 统一使用 `transform: scale`（不用 CSS zoom），避免：
 * - 布局坐标仍为 1920px 而视觉缩小，导致 Cursor/检查器高亮框与点击位置错位
 * - zoom 与 DevTools elementFromPoint 坐标系不一致
 */
export function ViewportScaledFrame({ children }: { children: ReactNode }) {
  const hostRef = useRef<HTMLDivElement>(null);
  const [scale, setScale] = useState(1);

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

  const scaledW = DESIGN_W * scale;
  const scaledH = DESIGN_H * scale;

  return (
    <div
      ref={hostRef}
      className="flex h-[100dvh] w-full min-h-0 items-center justify-center overflow-hidden bg-[#eceff4] p-4"
      data-viewport-host
    >
      <div
        className="relative shrink-0 overflow-hidden"
        style={{ width: scaledW, height: scaledH }}
        data-viewport-slot
        data-viewport-scale={scale}
      >
        <div
          className="origin-top-left"
          style={{
            width: DESIGN_W,
            height: DESIGN_H,
            transform: `scale(${scale})`,
          }}
          data-viewport-surface
        >
          {children}
        </div>
      </div>
    </div>
  );
}
