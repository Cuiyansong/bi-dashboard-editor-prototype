import { useMemo, useState } from "react";
import { figmaAssetSources } from "./figmaAssets";

function uuidFromSrc(src: string): string | null {
  const m = src.match(/\/figma\/([0-9a-f-]+)\.png$/i) ?? src.match(/\/asset\/([0-9a-f-]+)$/i);
  return m?.[1] ?? null;
}

type FigmaAssetImageProps = {
  uuid?: string;
  /** Legacy: derive uuid from /figma/{id}.png or MCP URL */
  src?: string;
  className?: string;
  /** Shown when all sources fail (e.g. gradient block) */
  fallback?: React.ReactNode;
};

/**
 * Tries /figma/{uuid}.png first, then Figma MCP URL. Hides broken img icons.
 */
export function FigmaAssetImage({ uuid, src, className, fallback }: FigmaAssetImageProps) {
  const sources = useMemo(() => {
    const id = uuid ?? (src ? uuidFromSrc(src) : null);
    if (id) return figmaAssetSources(id);
    return src ? [src] : [];
  }, [uuid, src]);
  const [index, setIndex] = useState(0);
  const failed = index >= sources.length;

  if (failed) {
    return fallback ? <>{fallback}</> : null;
  }

  return (
    <img
      alt=""
      draggable={false}
      className={className}
      src={sources[index]}
      onError={() => setIndex((i) => i + 1)}
    />
  );
}
