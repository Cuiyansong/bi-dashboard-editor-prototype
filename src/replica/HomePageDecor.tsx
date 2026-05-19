import { figmaAssets } from "./figmaAssets";

/** 主内容区极轻背景（无大图） */
export function HomeSubtleBackground() {
  return (
    <div aria-hidden className="pointer-events-none absolute inset-0 overflow-hidden">
      <div className="absolute inset-0 bg-[#F1F5F9]" />
      <div
        className="absolute inset-0"
        style={{
          backgroundImage:
            "radial-gradient(ellipse 60% 40% at 100% 0%, rgba(46,116,255,0.06) 0%, transparent 55%), radial-gradient(ellipse 50% 35% at 0% 100%, rgba(30,64,175,0.05) 0%, transparent 50%)",
        }}
      />
    </div>
  );
}

type HomeHeroBannerProps = {
  titleId: string;
};

/** 顶部 Banner：渐变条 + 右侧裁切看板预览（尺寸受控） */
export function HomeHeroBanner({ titleId }: HomeHeroBannerProps) {
  const snapshot = figmaAssets.canvas.snapshot;

  return (
    <section
      aria-labelledby={titleId}
      className="relative z-10 mx-10 mt-5 shrink-0 overflow-hidden rounded-2xl border border-[#BFDBFE]/60 shadow-[0_12px_40px_rgba(30,64,175,0.12)]"
    >
      <div className="absolute inset-0 bg-gradient-to-r from-[#1E3A8A] via-[#1E40AF] to-[#2563EB]" />
      <div
        aria-hidden
        className="absolute inset-0 opacity-30"
        style={{
          backgroundImage:
            "linear-gradient(rgba(255,255,255,0.08) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.08) 1px, transparent 1px)",
          backgroundSize: "32px 32px",
        }}
      />
      <BannerGlowOrnament className="absolute -right-8 top-1/2 h-[200px] w-[200px] -translate-y-1/2 opacity-20" />

      <div className="relative flex h-[148px] items-stretch">
        <div className="flex min-w-0 flex-1 flex-col justify-center px-8 py-5">
          <p className="font-['Inter',sans-serif] text-[11px] font-semibold uppercase tracking-[0.14em] text-blue-200">
            BI 看板 · 银行业务分析
          </p>
          <h1
            id={titleId}
            className="mt-1.5 text-balance font-['Inter',sans-serif] text-[28px] font-semibold leading-tight tracking-tight text-white"
          >
            选择模板，快速搭建数据看板
          </h1>
          <p className="mt-2 max-w-lg text-sm leading-relaxed text-blue-100/90">
            预置驾驶舱、通报考核、客户经营、策略编辑与自助查询场景，支持全局筛选与图表联动。
          </p>
        </div>

        <div
          aria-hidden
          className="relative w-[min(42%,520px)] shrink-0 border-l border-white/10 bg-[#0F172A]/20"
        >
          <div className="absolute inset-0 bg-gradient-to-l from-[#1E40AF]/80 via-transparent to-transparent" />
          <img
            alt=""
            src={snapshot}
            className="h-full w-full object-cover object-left-top"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-[#1E3A8A]/50 via-transparent to-transparent" />
          <MiniDashboardFrame className="absolute bottom-3 right-4 h-[72px] w-[120px] rounded-lg border border-white/25 bg-white/10 shadow-lg backdrop-blur-sm" />
        </div>
      </div>
    </section>
  );
}

function BannerGlowOrnament({ className = "" }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 200 200" fill="none" xmlns="http://www.w3.org/2000/svg">
      <circle cx="100" cy="100" r="80" stroke="white" strokeWidth="1" strokeOpacity="0.4" />
      <circle cx="100" cy="100" r="56" stroke="white" strokeWidth="1" strokeOpacity="0.25" />
      <path
        d="M40 120 L70 90 L100 105 L130 75 L160 88"
        stroke="white"
        strokeWidth="2"
        strokeOpacity="0.35"
        strokeLinecap="round"
      />
    </svg>
  );
}

function MiniDashboardFrame({ className = "" }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 120 72" fill="none" xmlns="http://www.w3.org/2000/svg">
      <rect x="8" y="10" width="48" height="20" rx="3" fill="white" fillOpacity="0.2" />
      <rect x="60" y="10" width="52" height="20" rx="3" fill="white" fillOpacity="0.15" />
      <rect x="8" y="36" width="104" height="28" rx="3" fill="white" fillOpacity="0.12" />
      <rect x="14" y="44" width="8" height="14" rx="1" fill="white" fillOpacity="0.45" />
      <rect x="26" y="48" width="8" height="10" rx="1" fill="white" fillOpacity="0.55" />
      <rect x="38" y="42" width="8" height="16" rx="1" fill="white" fillOpacity="0.5" />
    </svg>
  );
}
