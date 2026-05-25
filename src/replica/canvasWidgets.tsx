import type { ReactNode } from "react";
import type { CanvasWidget, MeasureKey } from "../model/dashboardModel";
import type { CohortTrackingMockRow } from "../model/templateDatasets";
import { STRATEGY_COHORT_DEFAULT_ROWS, dataMixHash, measureValueForWidget } from "../model/templateDatasets";
import { getChartConfigKind } from "./chartConfig";
import { getFieldSlotsForWidget, isLibraryDroppedWidgetId, widgetHasRequiredFieldData } from "./chartFieldSlots";
import type { FieldSlotBindings } from "./ReplicaRightPanel";
import { StrategyCohortTable } from "./StrategyCohortTable";
import { MetricBreakdownTreeView } from "./MetricBreakdownTreeView";
import { InsuranceCockpitBoardCard } from "./InsuranceCockpitBoardCard";
import { SelfServiceQueryBoardCard } from "./SelfServiceQueryBoardCard";

function bindingHintLine(w: CanvasWidget, slotBindings: FieldSlotBindings): string {
  const kind = getChartConfigKind(w);
  const slots = getFieldSlotsForWidget(kind, w.replicaLayout);
  const parts: string[] = [];
  for (const s of slots) {
    const arr = slotBindings[s.id];
    if (!arr?.length) continue;
    parts.push(arr.map((f) => f.label).join("、"));
    if (parts.length >= 2) break;
  }
  return parts.join(" · ");
}

function mockBarHeights(wid: string, measureKey: string, seed: number, filterMix: string): number[] {
  return Array.from({ length: 8 }, (_, i) => {
    const h = dataMixHash(`${wid}|bar|${i}|${measureKey}|${filterMix}`, seed);
    return 22 + (h % 58);
  });
}

function mockLinePts(wid: string, measureKey: string, seed: number, filterMix: string): number[] {
  return Array.from({ length: 8 }, (_, i) => {
    const h = dataMixHash(`${wid}|line|${i}|${measureKey}|${filterMix}`, seed + i * 7);
    return 15 + (h % 50);
  });
}

function mockKpiMain(wid: string, measureKey: string, seed: number, filterMix: string): number {
  const base = measureValueForWidget(measureKey, seed, wid, filterMix);
  return Math.round(base * 2.4 + (dataMixHash(`${wid}|kpi|${filterMix}`, seed) % 180));
}

function mockTableCells(wid: string, measureKey: string, seed: number, filterMix: string): [number, number] {
  const h = dataMixHash(`${wid}|tbl|${measureKey}|${filterMix}`, seed);
  const a = ((h % 200) + 20) / 10;
  const b = (((h >> 8) % 220) + 15) / 10;
  return [a, b];
}

function EmptyChartShell({ children }: { children: ReactNode }) {
  return (
    <div className="relative min-h-[100px] w-full">
      <div className="pointer-events-none select-none opacity-[0.36]">{children}</div>
      <div className="pointer-events-none absolute inset-0 flex items-center justify-center px-3">
        <div className="rounded-md border border-neutral-200/95 bg-white px-4 py-2 text-xs text-neutral-600 shadow-sm">
          当前图表无数据
        </div>
      </div>
    </div>
  );
}

function IrisKpisCard({ rows, hint }: { rows: { label: string; value: string }[]; hint?: string }) {
  return (
    <div className="p-5">
      {hint ? <div className="mb-2 text-[10px] leading-snug text-figma-sub">{hint}</div> : null}
      <div className="grid grid-cols-3 gap-4">
        {rows.map((c) => (
          <div key={c.label} className="text-center">
            <div className="text-[11px] text-figma-sub">{c.label}</div>
            <div className="mt-2 font-['Inter',sans-serif] text-[32px] font-semibold leading-none tabular-nums text-figma-text">
              {c.value}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

function GenericLiquidBarCard({
  w,
  measureLabel,
  pct,
  accent,
  hint,
}: {
  w: CanvasWidget;
  measureLabel: string;
  pct: number;
  accent: string;
  hint?: string;
}) {
  const displayPct = pct >= 100 ? "100.0" : pct.toFixed(1);
  const target = 876.5;
  const actual = (target * (pct / 100)).toFixed(1);
  return (
    <div className="flex flex-col px-4 pb-4 pt-3">
      <div className="mb-3 flex items-center justify-between border-b border-black/[0.06] pb-2">
        <span className="text-sm font-semibold text-figma-text">{w.title}</span>
        <button type="button" className="text-figma-sub hover:text-figma-text">
          ⚙
        </button>
      </div>
      <div className="flex flex-col py-2">
        {hint ? <div className="mb-2 text-center text-[10px] text-figma-sub">{hint}</div> : null}
        <div className="mb-2 text-center text-xs text-figma-sub">进度条 · {measureLabel}</div>
        <div className="mx-auto w-full max-w-[min(100%,560px)] px-0">
          <div className="mb-2 flex items-baseline justify-between gap-2">
            <span className="text-2xl font-bold tabular-nums text-primary">{displayPct}%</span>
            <span className="text-[11px] text-figma-sub">完成度</span>
          </div>
          <div className="h-5 w-full overflow-hidden rounded-md bg-neutral-100">
            <div className="h-full rounded-md transition-all" style={{ width: `${Math.min(pct, 100)}%`, backgroundColor: accent }} />
          </div>
          <div className="mt-4 flex flex-wrap justify-center gap-x-6 gap-y-1 px-1 text-[11px] text-figma-sub">
            <span>
              实际 <span className="font-medium tabular-nums text-figma-text">{actual}</span>
            </span>
            <span className="text-figma-line">|</span>
            <span>
              目标 <span className="font-medium tabular-nums text-figma-text">{target}</span>
            </span>
          </div>
        </div>
      </div>
    </div>
  );
}

function CompoundQueryCard({ w, rowLabels }: { w: CanvasWidget; rowLabels: [string, string] }) {
  const [a, b] = rowLabels;
  return (
    <div className="px-4 pb-4 pt-3">
      <div className="mb-3 text-sm font-semibold text-figma-text">{w.title}</div>
      <div className="flex gap-0">
        <div className="relative flex w-[52px] shrink-0 flex-col items-center">
          <div className="z-[1] rounded border border-neutral-200 bg-neutral-100 px-2 py-1 text-center text-[11px] font-semibold leading-tight text-neutral-700">
            且
          </div>
          <svg className="mt-1 w-full text-neutral-300" height="120" viewBox="0 0 52 120" preserveAspectRatio="none" aria-hidden>
            <path d="M 26 0 L 26 18" stroke="currentColor" strokeWidth="1" fill="none" />
            <path d="M 26 18 L 52 18" stroke="currentColor" strokeWidth="1" fill="none" />
            <path d="M 26 18 L 26 58" stroke="currentColor" strokeWidth="1" fill="none" />
            <path d="M 26 58 L 52 58" stroke="currentColor" strokeWidth="1" fill="none" />
            <path d="M 26 58 L 26 98" stroke="currentColor" strokeWidth="1" fill="none" />
            <path d="M 26 98 L 52 98" stroke="currentColor" strokeWidth="1" fill="none" />
          </svg>
        </div>
        <div className="min-w-0 flex-1 space-y-5 border-l border-neutral-200 pl-3">
          {[a, b].map((label) => (
            <div key={label}>
              <div className="mb-1 text-[11px] text-figma-sub">{label}</div>
              <div className="flex flex-wrap items-end gap-2 sm:flex-nowrap">
                <select className="min-w-[100px] flex-1 rounded border border-neutral-200 bg-neutral-50 px-2 py-1.5 text-[11px] text-figma-text outline-none focus:border-primary">
                  <option>请选择</option>
                </select>
                <input
                  type="text"
                  placeholder="值"
                  className="min-w-[80px] flex-1 border-b border-neutral-300 bg-transparent py-1.5 text-[11px] outline-none focus:border-primary"
                />
              </div>
            </div>
          ))}
        </div>
      </div>
      <div className="mt-6 flex justify-center">
        <button type="button" className="rounded-md bg-[#2E74FF] px-12 py-2 text-xs font-medium text-white shadow-sm hover:opacity-95">
          查询
        </button>
      </div>
    </div>
  );
}

function OrgProgressBoardCard({
  w,
  wid,
  measureKey,
  dataSeed,
  accent,
  hint,
}: {
  w: CanvasWidget;
  wid: string;
  measureKey: string;
  dataSeed: number;
  accent: string;
  hint?: string;
}) {
  const orgs = ["华北中心", "华南中心", "华东中心", "西南中心", "总行营业部", "直属支行"];
  const rows = orgs.map((name, i) => {
    const p = Math.min(100, 35 + (dataMixHash(`${wid}|org|${i}|${measureKey}`, dataSeed) % 58));
    const ach = (p * 0.92).toFixed(1);
    return { name, p, ach };
  });
  return (
    <div className="p-3">
      <div className="mb-2 text-xs font-semibold text-figma-text">{w.title}</div>
      {hint ? <div className="mb-2 text-[10px] text-figma-sub">{hint}</div> : null}
      <div className="space-y-3">
        {rows.map((r) => (
          <div key={r.name}>
            <div className="mb-1 flex justify-between text-[11px]">
              <span className="text-figma-text">{r.name}</span>
              <span className="tabular-nums text-figma-sub">
                达成 <span className="font-medium text-primary">{r.ach}%</span>
              </span>
            </div>
            <div className="h-2 overflow-hidden rounded-full bg-neutral-100">
              <div className="h-full rounded-full transition-all" style={{ width: `${r.p}%`, backgroundColor: accent }} />
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

function CustomerTagTableCard({ w, hint }: { w: CanvasWidget; hint?: string }) {
  const rows = [
    { id: "6228****3012", tag: "高价值", tier: "战略客户", active: "7日内活跃" },
    { id: "6228****4410", tag: "沉睡唤醒", tier: "成长客户", active: "30日内活跃" },
    { id: "6228****9921", tag: "交叉销售", tier: "长尾客户", active: "本日登录" },
    { id: "6228****1103", tag: "风险关注", tier: "战略客户", active: "90日内未活跃" },
    { id: "6228****5567", tag: "产品渗透", tier: "成长客户", active: "7日内活跃" },
  ];
  return (
    <div className="p-3">
      <div className="mb-2 text-xs font-semibold text-figma-text">{w.title}</div>
      {hint ? <div className="mb-2 text-[10px] text-figma-sub">{hint}</div> : null}
      <div className="overflow-hidden rounded border border-border text-[11px]">
        <div className="grid grid-cols-4 bg-neutral-50 px-2 py-1.5 font-medium text-neutral-600">
          <span>客户号</span>
          <span>客户标签</span>
          <span>分层</span>
          <span>最近活跃</span>
        </div>
        {rows.map((r) => (
          <div key={r.id} className="grid grid-cols-4 border-t border-border px-2 py-1.5 text-figma-text">
            <span className="tabular-nums text-figma-sub">{r.id}</span>
            <span>{r.tag}</span>
            <span>{r.tier}</span>
            <span className="text-figma-sub">{r.active}</span>
          </div>
        ))}
      </div>
    </div>
  );
}

function IrisCrossTableCard({
  primaryLabel,
  secondaryLabel,
  hint,
}: {
  primaryLabel: string;
  secondaryLabel: string;
  hint?: string;
}) {
  const rows = [
    { a: "5.1", b: "3.5", hi: false },
    { a: "4.9", b: "3.0", hi: true },
    { a: "4.7", b: "3.2", hi: false },
    { a: "4.6", b: "3.1", hi: false },
    { a: "5.0", b: "3.6", hi: false },
  ];
  return (
    <div className="px-3 pb-3 pt-2">
      <div className="mb-2 flex items-center justify-between">
        <span className="text-sm font-semibold text-figma-text">交叉表</span>
        <span className="max-w-[55%] truncate text-[10px] text-primary">{hint || "已选字段(2)"}</span>
      </div>
      <div className="overflow-hidden rounded-lg border border-black/[0.08] text-[12px]">
        <div className="grid grid-cols-2 border-b border-primary bg-figma-azure-6">
          <div className="px-3 py-2 text-right font-medium text-figma-text">{primaryLabel}</div>
          <div className="px-3 py-2 text-right font-medium text-figma-text">{secondaryLabel}</div>
        </div>
        {rows.map((r, i) => (
          <div
            key={i}
            className={`grid grid-cols-2 border-b border-black/[0.06] last:border-b-0 ${
              i % 2 === 1 ? "bg-figma-azure-6/40" : "bg-white"
            } ${r.hi ? "ring-1 ring-inset ring-primary" : ""}`}
          >
            <div className="px-3 py-2 text-right tabular-nums text-figma-text">{r.a}</div>
            <div className="px-3 py-2 text-right tabular-nums text-figma-text">{r.b}</div>
          </div>
        ))}
        <div className="grid grid-cols-2 bg-figma-azure-6/60">
          <div className="px-3 py-2 text-right text-figma-sub">均值 · {primaryLabel}</div>
          <div className="px-3 py-2 text-right tabular-nums text-figma-text">4.86</div>
        </div>
      </div>
    </div>
  );
}

export function WidgetBody({
  w,
  measureKey,
  dataSeed,
  filterMix = "",
  measureLabel,
  secondaryMeasureLabel,
  dimensionLabels,
  kpiPreviewRows,
  cohortRows,
  pct,
  accent,
  slotBindings = {},
  dashTabLabel,
}: {
  w: CanvasWidget;
  measureKey: MeasureKey;
  dataSeed: number;
  filterMix?: string;
  measureLabel: string;
  secondaryMeasureLabel: string;
  dimensionLabels: string[];
  kpiPreviewRows: { label: string; value: string }[];
  cohortRows?: CohortTrackingMockRow[];
  pct: number;
  accent: string;
  slotBindings?: FieldSlotBindings;
  dashTabLabel?: string;
}) {
  const dim0 = dimensionLabels[0] ?? "维度";
  const dim1 = dimensionLabels[1] ?? "分类";
  const hint = bindingHintLine(w, slotBindings);
  const hasFieldData = widgetHasRequiredFieldData(w, slotBindings);
  const emptyUnlessBound = isLibraryDroppedWidgetId(w.id);
  const showChartData = hasFieldData || !emptyUnlessBound;

  const empty = (node: ReactNode) => (showChartData ? node : <EmptyChartShell>{node}</EmptyChartShell>);

  if (w.replicaLayout === "irisKpis") return empty(<IrisKpisCard rows={kpiPreviewRows} hint={hint || undefined} />);
  if (w.replicaLayout === "irisLiquid")
    return empty(<GenericLiquidBarCard w={w} measureLabel={measureLabel} pct={pct} accent={accent} hint={hint || undefined} />);
  if (w.replicaLayout === "irisCrossTable")
    return empty(
      <IrisCrossTableCard primaryLabel={measureLabel} secondaryLabel={secondaryMeasureLabel} hint={hint || undefined} />,
    );
  if (w.replicaLayout === "strategyCohortTable") {
    const rows = cohortRows?.length ? cohortRows : STRATEGY_COHORT_DEFAULT_ROWS;
    return empty(
      <div>
        {hint ? <div className="border-b border-black/[0.06] px-3 py-1.5 text-[10px] text-figma-sub">{hint}</div> : null}
        <StrategyCohortTable rows={rows} />
      </div>,
    );
  }
  if (w.replicaLayout === "insuranceCockpitBoard") {
    return empty(
      <InsuranceCockpitBoardCard
        w={w}
        measureKey={measureKey}
        dataSeed={dataSeed}
        accent={accent}
        hint={hint || undefined}
      />,
    );
  }
  if (w.replicaLayout === "compoundQuery") {
    const rowLabels: [string, string] = [dim0, dim1];
    return <CompoundQueryCard w={w} rowLabels={rowLabels} />;
  }
  if (w.replicaLayout === "selfServiceQuery") {
    return <SelfServiceQueryBoardCard w={w} hint={hint || undefined} dashTabLabel={dashTabLabel} />;
  }
  if (w.replicaLayout === "metricBreakdownTree") {
    return (
      <MetricBreakdownTreeView
        w={w}
        slotBindings={slotBindings}
        dataSeed={dataSeed}
        accent={accent}
        hint={hint || undefined}
        emptyUnlessBound={emptyUnlessBound}
      />
    );
  }
  if (w.replicaLayout === "orgProgressBoard") {
    return empty(
      <OrgProgressBoardCard
        w={w}
        wid={w.id}
        measureKey={measureKey}
        dataSeed={dataSeed}
        accent={accent}
        hint={hint || undefined}
      />,
    );
  }
  if (w.replicaLayout === "customerTagTable") {
    return empty(<CustomerTagTableCard w={w} hint={hint || undefined} />);
  }

  if (w.type === "kpi") {
    const kpiVal = mockKpiMain(w.id, measureKey, dataSeed, filterMix);
    return empty(
      <div className="p-4">
        {hint ? <div className="mb-1 text-[10px] text-figma-sub">{hint}</div> : null}
        <div className="text-[11px] text-figma-sub">{w.title}</div>
        <div className="mt-2 text-2xl font-semibold tabular-nums text-figma-text">{kpiVal}</div>
      </div>,
    );
  }
  if (w.type === "liquid") {
    return empty(<GenericLiquidBarCard w={w} measureLabel={measureLabel} pct={pct} accent={accent} hint={hint || undefined} />);
  }
  if (w.type === "table") {
    const [cellA, cellB] = mockTableCells(w.id, measureKey, dataSeed, filterMix);
    return empty(
      <div className="p-3">
        {hint ? <div className="mb-1 text-[10px] text-figma-sub">{hint}</div> : null}
        <div className="mb-2 text-xs font-medium text-figma-text">{w.title}</div>
        <div className="overflow-hidden rounded border border-border text-[11px]">
          <div className="grid grid-cols-3 bg-neutral-50 px-2 py-1 font-medium text-neutral-600">
            <span>{dim0}</span>
            <span>{measureLabel}</span>
            <span>{secondaryMeasureLabel}</span>
          </div>
          <div className="grid grid-cols-3 border-t border-border px-2 py-1">
            <span>{dim1}</span>
            <span className="tabular-nums">{cellA.toFixed(1)}</span>
            <span className="tabular-nums">{cellB.toFixed(1)}</span>
          </div>
        </div>
      </div>,
    );
  }
  if (w.type === "bar") {
    const heights = mockBarHeights(w.id, measureKey, dataSeed, filterMix);
    return empty(
      <div className="p-4">
        {hint ? <div className="mb-2 text-[10px] text-figma-sub">{hint}</div> : null}
        <div className="mb-3 text-xs font-medium text-figma-text">{w.title}</div>
        <div className="flex h-28 items-end gap-1.5">
          {heights.map((h, i) => (
            <div
              key={i}
              className="flex-1 rounded-t opacity-90"
              style={{ height: `${h}%`, backgroundColor: accent }}
            />
          ))}
        </div>
      </div>,
    );
  }
  if (w.type === "line") {
    const pts = mockLinePts(w.id, measureKey, dataSeed, filterMix);
    return empty(
      <div className="p-4">
        {hint ? <div className="mb-2 text-[10px] text-figma-sub">{hint}</div> : null}
        <div className="mb-3 text-xs font-medium text-figma-text">{w.title}</div>
        <div className="relative h-28">
          <svg className="h-full w-full" viewBox="0 0 100 40" preserveAspectRatio="none">
            <polyline
              fill="none"
              stroke={accent}
              strokeWidth="2"
              points={pts.map((y, i) => `${(i / (pts.length - 1)) * 100},${40 - y * 0.5}`).join(" ")}
            />
          </svg>
        </div>
      </div>,
    );
  }
  return null;
}
