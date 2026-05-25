import { useState } from "react";
import {
  PLATFORM_HERO_IMAGE,
  PLATFORM_HERO_IMAGE_FALLBACK,
  PLATFORM_PRIMARY,
} from "./platformHomeAssets";

export type PlatformHeroBannerProps = {
  titleId: string;
  eyebrow?: string;
  title?: string;
  subtitle?: string;
};

export function PlatformHeroBanner({
  titleId,
  eyebrow = "综合报表平台 · 银行业务分析",
  title = "报表查询与仪表板配置",
  subtitle = "预置考核、产品、客群、效益、营销后评价等分析模板；支持报表查询、配置发布与模板建表。",
}: PlatformHeroBannerProps) {
  const [imgSrc, setImgSrc] = useState(PLATFORM_HERO_IMAGE);
  const [imgFailed, setImgFailed] = useState(false);

  return (
    <section
      aria-labelledby={titleId}
      className="relative z-10 shrink-0 overflow-hidden"
      style={{ height: "clamp(300px, 45%, 420px)", minHeight: 300, maxHeight: 420 }}
    >
      {!imgFailed ? (
        <img
          src={imgSrc}
          alt=""
          className="absolute inset-0 h-full w-full object-cover object-[center_55%]"
          onError={() => {
            if (imgSrc !== PLATFORM_HERO_IMAGE_FALLBACK) {
              setImgSrc(PLATFORM_HERO_IMAGE_FALLBACK);
            } else {
              setImgFailed(true);
            }
          }}
        />
      ) : (
        <div
          className="absolute inset-0"
          style={{
            background: `linear-gradient(135deg, ${PLATFORM_PRIMARY} 0%, #2a4a9e 50%, #1e3a7a 100%)`,
          }}
        />
      )}
      <div
        aria-hidden
        className="absolute inset-0 bg-gradient-to-r from-[#213c7f]/90 via-[#213c7f]/55 to-transparent"
      />

      <div className="relative flex h-full items-center px-8 py-6">
        <div className="min-w-0 max-w-3xl">
          <p className="text-xs font-semibold uppercase tracking-[0.12em] text-blue-100/90">{eyebrow}</p>
          <h1
            id={titleId}
            className="mt-2 text-balance font-['Inter',sans-serif] text-[28px] font-bold leading-tight tracking-tight text-white"
          >
            {title}
          </h1>
          <p className="mt-2 max-w-3xl text-sm leading-relaxed text-white/90">{subtitle}</p>
        </div>
      </div>
    </section>
  );
}
