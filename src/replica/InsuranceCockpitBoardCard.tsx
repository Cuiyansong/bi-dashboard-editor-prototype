import type { CanvasWidget } from "../model/dashboardModel";
import { dataMixHash } from "../model/templateDatasets";

function miniSparkPts(wid: string, seed: number, salt: string): number[] {
  return Array.from({ length: 10 }, (_, i) => {
    const h = dataMixHash(`${wid}|sp|${salt}|${i}`, seed + i * 3);
    return 8 + (h % 14);
  });
}

function MiniSparkline({ wid, seed, salt }: { wid: string; seed: number; salt: string }) {
  const pts = miniSparkPts(wid, seed, salt);
  const w = 64;
  const h = 22;
  const max = Math.max(...pts, 1);
  const min = Math.min(...pts, 0);
  const span = max - min || 1;
  const step = pts.length > 1 ? w / (pts.length - 1) : w;
  const d = pts
    .map((p, i) => {
      const x = i * step;
      const y = h - 2 - ((p - min) / span) * (h - 4);
      return `${i === 0 ? "M" : "L"}${x.toFixed(1)},${y.toFixed(1)}`;
    })
    .join(" ");
  return (
    <svg width={w} height={h} className="mt-1 opacity-90" aria-hidden>
      <path d={d} fill="none" stroke="currentColor" strokeWidth="1.25" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}

function SemiGauge({ pct, accent }: { pct: number; accent: string }) {
  const p = Math.min(100, Math.max(0, pct));
  const r = 36;
  const cx = 48;
  const cy = 46;
  const toRad = (deg: number) => (Math.PI * deg) / 180;
  const polar = (deg: number) => ({
    x: cx + r * Math.cos(toRad(deg)),
    y: cy + r * Math.sin(toRad(deg)),
  });
  const start = polar(180);
  const end = polar(180 - (p / 100) * 180);
  const largeArc = p > 50 ? 1 : 0;
  const track = `M ${start.x} ${start.y} A ${r} ${r} 0 0 1 ${polar(0).x} ${polar(0).y}`;
  const val = `M ${start.x} ${start.y} A ${r} ${r} 0 ${largeArc} 1 ${end.x} ${end.y}`;
  return (
    <svg viewBox="0 0 96 52" className="mx-auto w-[128px]" aria-hidden>
      <path d={track} fill="none" stroke="#e5e7eb" strokeWidth="8" strokeLinecap="round" />
      <path d={val} fill="none" stroke={accent} strokeWidth="8" strokeLinecap="round" />
    </svg>
  );
}

const RANK_ROWS = [
  { code: "ZX0003", val: "97.55万", up: true, w: 92 },
  { code: "ZX00014", val: "96.12万", up: false, w: 88 },
  { code: "ZX00008", val: "94.03万", up: true, w: 85 },
  { code: "ZX00021", val: "91.66万", up: false, w: 78 },
  { code: "ZX00001", val: "88.20万", up: true, w: 72 },
];

export function InsuranceCockpitBoardCard({
  w,
  measureKey,
  dataSeed,
  accent,
  hint,
}: {
  w: CanvasWidget;
  measureKey: string;
  dataSeed: number;
  accent: string;
  hint?: string;
}) {
  const wid = w.id;
  const topBlue = [
    { key: "a", label: "放款金额", value: "1,328.6万", salt: "fk" },
    { key: "b", label: "还款金额", value: "986.4万", salt: "hk" },
    { key: "c", label: "新增余额", value: "512.3万", salt: "xz" },
    { key: "d", label: "管理余额", value: "2,041.8万", salt: "gl" },
  ] as const;
  const topAccent = [
    { key: "e", label: "DPD7+余额逾期率", value: "2.35%", bg: "linear-gradient(135deg,#fb923c,#ea580c)", salt: "dpd" },
    { key: "f", label: "运营成本", value: "39.69万", bg: "linear-gradient(135deg,#f87171,#dc2626)", salt: "cb" },
  ] as const;

  const g1 = 19.2 + (dataMixHash(`${wid}|g1`, dataSeed) % 8) / 10;
  const g2 = 24.6 + (dataMixHash(`${wid}|g2`, dataSeed) % 10) / 10;

  const bottomCards = [
    { label: "放款金额", value: "1,328.6万", bg: "bg-sky-100/90" },
    { label: "还款金额", value: "986.4万", bg: "bg-amber-100/90" },
    { label: "新增余额", value: "512.3万", bg: "bg-emerald-100/90" },
    { label: "管理余额", value: "2,041.8万", bg: "bg-violet-100/90" },
    { label: "DPD7+余额逾期率", value: "2.35%", bg: "bg-cyan-100/90" },
    { label: "运营成本", value: "39.69万", bg: "bg-rose-100/90" },
  ];

  return (
    <div className="px-3 pb-4 pt-2">
      {hint ? <div className="mb-2 text-[10px] text-figma-sub">{hint}</div> : null}

      {/* 顶部大指标 */}
      <div className="mb-3 flex min-h-[120px] flex-wrap gap-0 overflow-hidden rounded-lg shadow-sm">
        <div className="relative flex min-w-[200px] flex-1 flex-col bg-gradient-to-br from-[#1e3a8a] via-[#1d4ed8] to-[#2563eb] px-3 py-3 text-white">
          <div className="pointer-events-none absolute inset-0 opacity-[0.12]" aria-hidden>
            <div className="absolute -right-6 bottom-0 h-24 w-24 rounded-full bg-white/30 blur-2xl" />
          </div>
          <div className="relative grid grid-cols-2 gap-x-4 gap-y-3 sm:grid-cols-4">
            {topBlue.map((c) => (
              <div key={c.key} className="min-w-0">
                <div className="text-[11px] text-white/85">{c.label}</div>
                <div className="mt-0.5 font-['Inter',sans-serif] text-xl font-semibold tabular-nums leading-tight">{c.value}</div>
                <MiniSparkline wid={wid} seed={dataSeed} salt={`${c.salt}|${measureKey}`} />
              </div>
            ))}
          </div>
        </div>
        <div className="flex w-full shrink-0 flex-col text-white sm:w-[200px] sm:flex-row">
          {topAccent.map((c) => (
            <div
              key={c.key}
              className="flex min-h-[100px] min-w-0 flex-1 flex-col justify-center px-3 py-2 text-white sm:w-1/2"
              style={{ background: c.bg }}
            >
              <div className="text-[11px] text-white/90">{c.label}</div>
              <div className="mt-1 font-['Inter',sans-serif] text-lg font-semibold tabular-nums">{c.value}</div>
              <MiniSparkline wid={wid} seed={dataSeed} salt={`${c.salt}|${measureKey}`} />
            </div>
          ))}
        </div>
      </div>

      {/* 中部：双仪表盘 + 排行 */}
      <div className="mb-3 grid grid-cols-1 gap-3 lg:grid-cols-12">
        <div className="rounded-lg border border-black/[0.06] bg-white p-3 shadow-sm lg:col-span-3">
          <div className="text-center text-[11px] font-medium text-figma-text">全年放款金额KPI达成率</div>
          <SemiGauge pct={g1} accent={accent} />
          <div className="-mt-2 text-center">
            <div className="text-2xl font-bold tabular-nums text-primary">{g1.toFixed(1)}%</div>
            <div className="text-[10px] text-figma-sub">实际: 28.87亿</div>
          </div>
        </div>
        <div className="rounded-lg border border-black/[0.06] bg-white p-3 shadow-sm lg:col-span-3">
          <div className="text-center text-[11px] font-medium text-figma-text">全年还款金额KPI达成率</div>
          <SemiGauge pct={g2} accent={accent} />
          <div className="-mt-2 text-center">
            <div className="text-2xl font-bold tabular-nums text-primary">{g2.toFixed(1)}%</div>
            <div className="text-[10px] text-figma-sub">实际: 21.36亿</div>
          </div>
        </div>
        <div className="rounded-lg border border-black/[0.06] bg-white p-3 shadow-sm lg:col-span-6">
          <div className="mb-2 flex items-center justify-between border-b border-black/[0.06] pb-2">
            <span className="text-xs font-semibold text-figma-text">本月分公司业绩排行</span>
            <button type="button" className="text-[10px] text-primary hover:underline">
              销售分析 &gt;
            </button>
          </div>
          <div className="space-y-2.5">
            {RANK_ROWS.map((r, i) => (
              <div key={r.code} className="flex items-center gap-2 text-[11px]">
                <span className="w-5 shrink-0 text-center font-medium text-figma-sub">
                  {i === 0 ? "🥇" : i === 1 ? "🥈" : i === 2 ? "🥉" : i + 1}
                </span>
                <span className="w-16 shrink-0 truncate text-figma-text">{r.code}</span>
                <div className="min-w-0 flex-1">
                  <div className="h-2 overflow-hidden rounded-full bg-neutral-100">
                    <div className="h-full rounded-full bg-primary/85" style={{ width: `${r.w}%` }} />
                  </div>
                </div>
                <span className="shrink-0 tabular-nums font-medium text-figma-text">{r.val}</span>
                <span className={r.up ? "text-red-500" : "text-emerald-600"}>{r.up ? "↑" : "↓"}</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* 筛选条 */}
      <div className="mb-4 flex flex-wrap items-center gap-2 rounded-lg border border-black/[0.06] bg-neutral-100/90 px-3 py-2.5">
        <select className="min-w-[120px] flex-1 rounded border border-neutral-200 bg-white px-2 py-1.5 text-[11px] text-figma-text outline-none focus:border-primary">
          <option>时间筛选</option>
          <option>本月</option>
          <option>本季度</option>
          <option>本年</option>
        </select>
        <select className="min-w-[120px] flex-1 rounded border border-neutral-200 bg-white px-2 py-1.5 text-[11px] text-figma-text outline-none focus:border-primary">
          <option>地域筛选</option>
          <option>全辖</option>
          <option>华东</option>
          <option>华北</option>
        </select>
        <select className="min-w-[120px] flex-1 rounded border border-neutral-200 bg-white px-2 py-1.5 text-[11px] text-figma-text outline-none focus:border-primary">
          <option>渠道筛选</option>
          <option>全渠道</option>
          <option>直营</option>
          <option>合作方</option>
        </select>
        <button
          type="button"
          className="shrink-0 rounded-md px-4 py-1.5 text-[11px] font-medium text-white"
          style={{ background: "#2E74FF" }}
        >
          查询
        </button>
      </div>

      {/* 核心指标监控 */}
      <div className="text-sm font-semibold text-figma-text">核心指标监控</div>
      <div className="mt-2 grid grid-cols-2 gap-2 sm:grid-cols-3 lg:grid-cols-6">
        {bottomCards.map((c) => (
          <div key={c.label} className={`rounded-lg border border-black/[0.04] px-2 py-3 text-center shadow-sm ${c.bg}`}>
            <div className="text-[10px] text-neutral-600">{c.label}</div>
            <div className="mt-1 font-['Inter',sans-serif] text-lg font-bold tabular-nums text-figma-text">{c.value}</div>
          </div>
        ))}
      </div>
    </div>
  );
}
