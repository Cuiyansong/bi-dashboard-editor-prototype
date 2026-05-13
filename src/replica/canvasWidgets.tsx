import type { ReactNode } from "react";
import { CanvasWidget } from "../model/dashboardModel";
import type { CohortTrackingMockRow } from "../model/templateDatasets";
import { STRATEGY_COHORT_DEFAULT_ROWS } from "../model/templateDatasets";
import { widgetFieldBindingsComplete } from "./chartFieldSlots";
import type { FieldSlotBindings } from "./ReplicaRightPanel";
import { StrategyCohortTable } from "./StrategyCohortTable";

/** 与 `EditorFrame` 中 `uid()` 一致：从库拖入的组件 id，用于「无绑定则无数据」仅作用于新拖入块 */
function isLibraryDroppedWidgetId(id: string): boolean {
  return /^w_[a-z0-9]{7}$/i.test(id);
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

function IrisKpisCard({ rows }: { rows: { label: string; value: string }[] }) {
  return (
    <div className="p-5">
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

function IrisLiquidCard({
  w,
  measureLabel,
  pct,
  accent,
}: {
  w: CanvasWidget;
  measureLabel: string;
  pct: number;
  accent: string;
}) {
  const displayPct = pct >= 100 ? "100.0" : pct.toFixed(1);
  const actual = (876.5 * (pct / 100)).toFixed(1);
  return (
    <div className="flex flex-col px-4 pb-4 pt-3">
      <div className="mb-3 flex items-center justify-between border-b border-black/[0.06] pb-2">
        <span className="text-sm font-semibold text-figma-text">{w.title}</span>
        <button type="button" className="text-figma-sub hover:text-figma-text">
          ⚙
        </button>
      </div>
      <div className="flex flex-col items-center py-2">
        <div className="mb-3 text-xs text-figma-sub">切换图表 · 水波图</div>
        <div
          className="relative flex h-[168px] w-[168px] items-center justify-center rounded-full"
          style={{
            background: `conic-gradient(${accent} ${Math.min(pct, 100)}%, #e8f4ff 0)`,
          }}
        >
          <div className="absolute inset-[14px] flex flex-col items-center justify-center rounded-full bg-white shadow-inner">
            <div className="text-xs text-figma-sub">{measureLabel}</div>
            <div className="mt-1 text-2xl font-bold tabular-nums text-primary">{displayPct}%</div>
          </div>
        </div>
        <div className="mt-4 flex w-full justify-between px-6 text-[11px] text-figma-sub">
          <span>实际: {actual}</span>
          <span>目标: 876.5</span>
        </div>
      </div>
    </div>
  );
}

function IrisCrossTableCard({ primaryLabel, secondaryLabel }: { primaryLabel: string; secondaryLabel: string }) {
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
        <span className="text-xs text-primary">已选字段(2)</span>
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
  measureLabel,
  secondaryMeasureLabel,
  dimensionLabels,
  kpiPreviewRows,
  cohortRows,
  pct,
  accent,
  slotBindings = {},
}: {
  w: CanvasWidget;
  measureLabel: string;
  secondaryMeasureLabel: string;
  dimensionLabels: string[];
  kpiPreviewRows: { label: string; value: string }[];
  cohortRows?: CohortTrackingMockRow[];
  pct: number;
  accent: string;
  slotBindings?: FieldSlotBindings;
}) {
  const dim0 = dimensionLabels[0] ?? "维度";
  const dim1 = dimensionLabels[1] ?? "分类";
  const hasFieldData = widgetFieldBindingsComplete(w, slotBindings);
  const emptyUnlessBound = isLibraryDroppedWidgetId(w.id);
  const showChartData = hasFieldData || !emptyUnlessBound;

  const empty = (node: ReactNode) => (showChartData ? node : <EmptyChartShell>{node}</EmptyChartShell>);

  if (w.replicaLayout === "irisKpis") return empty(<IrisKpisCard rows={kpiPreviewRows} />);
  if (w.replicaLayout === "irisLiquid")
    return empty(<IrisLiquidCard w={w} measureLabel={measureLabel} pct={pct} accent={accent} />);
  if (w.replicaLayout === "irisCrossTable")
    return empty(<IrisCrossTableCard primaryLabel={measureLabel} secondaryLabel={secondaryMeasureLabel} />);
  if (w.replicaLayout === "strategyCohortTable") {
    const rows = cohortRows?.length ? cohortRows : STRATEGY_COHORT_DEFAULT_ROWS;
    return empty(<StrategyCohortTable rows={rows} />);
  }

  if (w.type === "kpi") {
    return empty(
      <div className="p-4">
        <div className="text-[11px] text-figma-sub">{w.title}</div>
        <div className="mt-2 text-2xl font-semibold tabular-nums text-figma-text">128</div>
      </div>,
    );
  }
  if (w.type === "liquid") {
    return empty(
      <div className="flex flex-col items-center p-6">
        <div className="mb-2 text-center text-xs font-medium text-figma-text">
          {w.title} · {measureLabel}
        </div>
        <div
          className="relative flex h-36 w-36 items-center justify-center rounded-full"
          style={{
            background: `conic-gradient(${accent} ${pct}%, #e6f4ff 0)`,
          }}
        >
          <div className="absolute inset-3 flex items-center justify-center rounded-full bg-white text-lg font-bold tabular-nums text-primary">
            {pct}%
          </div>
        </div>
      </div>,
    );
  }
  if (w.type === "table") {
    return empty(
      <div className="p-3">
        <div className="mb-2 text-xs font-medium text-figma-text">{w.title}</div>
        <div className="overflow-hidden rounded border border-border text-[11px]">
          <div className="grid grid-cols-3 bg-neutral-50 px-2 py-1 font-medium text-neutral-600">
            <span>{dim0}</span>
            <span>{measureLabel}</span>
            <span>{secondaryMeasureLabel}</span>
          </div>
          <div className="grid grid-cols-3 border-t border-border px-2 py-1">
            <span>{dim1}</span>
            <span>{(pct / 3).toFixed(1)}</span>
            <span>{(pct / 2.8).toFixed(1)}</span>
          </div>
        </div>
      </div>,
    );
  }
  if (w.type === "bar") {
    const heights = [32, 48, 40, 56, 44, 52, 38, 60];
    return empty(
      <div className="p-4">
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
    const pts = [20, 35, 28, 50, 40, 55, 45, 62];
    return empty(
      <div className="p-4">
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
