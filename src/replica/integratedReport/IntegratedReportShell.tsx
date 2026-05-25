import type { ReactNode } from "react";
import { INTEGRATED_TOP_NAV, type IntegratedTopNavId } from "./integratedReportConfig";

export type IntegratedReportShellProps = {
  topNav: IntegratedTopNavId;
  onTopNavChange: (id: IntegratedTopNavId) => void;
  onBackToHome: () => void;
  sidebar?: ReactNode;
  children: ReactNode;
};

function WLogo() {
  return (
    <svg viewBox="0 0 28 28" className="h-7 w-7 shrink-0" aria-hidden>
      <rect width="28" height="28" rx="4" fill="#1a3066" />
      <path
        d="M6 20 L10 8 L14 16 L18 8 L22 20"
        stroke="white"
        strokeWidth="2.2"
        fill="none"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}

export function IntegratedReportShell({
  topNav,
  onTopNavChange,
  onBackToHome,
  sidebar,
  children,
}: IntegratedReportShellProps) {
  const isQueryActive = topNav === "reportQuery";

  return (
    <div className="flex h-[918px] w-[1920px] shrink-0 flex-col overflow-hidden rounded-sm border border-figma-line bg-[#F3F4F6] shadow-md">
      <header className="flex h-11 shrink-0 items-stretch bg-[#213c7f] text-white">
        <div className="flex w-[240px] shrink-0 items-center gap-2.5 px-4">
          <WLogo />
          <span className="text-[14px] font-semibold tracking-tight">综合报表平台</span>
        </div>

        <nav className="flex min-w-0 flex-1 items-center gap-0.5 px-2">
          {INTEGRATED_TOP_NAV.map((item) => {
            const active = topNav === item.id;
            const queryPill = isQueryActive && item.id === "reportQuery";
            return (
              <button
                key={item.id}
                type="button"
                onClick={() => onTopNavChange(item.id)}
                className={`relative flex items-center gap-1 px-3 py-1.5 text-[13px] transition-colors ${
                  queryPill
                    ? "rounded bg-white font-medium text-[#2563EB]"
                    : active
                      ? "bg-[#111827] font-medium text-white"
                      : "text-[#D1D5DB] hover:bg-[#374151] hover:text-white"
                }`}
              >
                {item.label}
                {item.hasDropdown ? (
                  <span className="text-[10px] opacity-70" aria-hidden>
                    ▾
                  </span>
                ) : null}
                {item.badge != null ? (
                  <span className="absolute -right-0.5 -top-0.5 flex h-4 min-w-[16px] items-center justify-center rounded-full bg-[#EF4444] px-1 text-[10px] font-medium leading-none text-white">
                    {item.badge}
                  </span>
                ) : null}
              </button>
            );
          })}
        </nav>

        <div className="flex shrink-0 items-center gap-3 px-4">
          <button
            type="button"
            className="flex items-center gap-1.5 text-[12px] text-[#E5E7EB] hover:text-white"
          >
            <span className="inline-flex h-7 w-7 items-center justify-center rounded-full bg-[#4B5563] text-[11px]">
              A
            </span>
            admin
            <span className="text-[10px] opacity-70" aria-hidden>
              ▾
            </span>
          </button>
          <button
            type="button"
            onClick={onBackToHome}
            className="text-[11px] text-[#9CA3AF] hover:text-white"
          >
            返回首页
          </button>
        </div>
      </header>

      <div className="flex min-h-0 flex-1">
        {sidebar}
        <main className="min-h-0 min-w-0 flex-1">{children}</main>
      </div>
    </div>
  );
}
