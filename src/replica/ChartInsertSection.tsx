import { useCallback, useEffect, useMemo, useState, type Ref } from "react";
import type { WidgetType } from "../model/dashboardModel";
import {
  type AnalysisMode,
  type DimensionSelections,
  type InsertedChart,
  CHART_INSERT_TYPES,
  buildInsertedChartTitle,
  getAllDimensionOptions,
  getDefaultInsertDimensions,
  getDefaultInsertIndicators,
  getDimensionGroupsForInsert,
  getIndicatorOptionsForInsert,
  newInsertedChartId,
} from "./chartInsertConfig";

const TOKEN = {
  primary: "#1E40AF",
  primarySoft: "#EFF6FF",
  primarySoftRing: "#DBEAFE",
  surfaceAlt: "#F1F5F9",
  card: "#FFFFFF",
  border: "#E2E8F0",
  text: "#0F172A",
  textMuted: "#475569",
  textDim: "#64748B",
} as const;

function ChevronIcon({ expanded }: { expanded: boolean }) {
  return (
    <svg
      aria-hidden
      viewBox="0 0 16 16"
      className={`h-3.5 w-3.5 shrink-0 transition-transform duration-200 ${expanded ? "rotate-180" : ""}`}
      fill="none"
      stroke="currentColor"
      strokeWidth="1.6"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <path d="M4 6l4 4 4-4" />
    </svg>
  );
}

function previewSeed(...keys: (string | number)[]): number {
  let h = 2166136261;
  for (const k of keys) {
    const s = String(k);
    for (let i = 0; i < s.length; i++) {
      h = Math.imul(h ^ s.charCodeAt(i), 16777619);
    }
  }
  return (h >>> 0) % 100000;
}

function previewBarHeights(chartId: string, dim: string, indicator: string): number[] {
  return Array.from({ length: 8 }, (_, i) => {
    const s = previewSeed(chartId, dim, indicator, i);
    return 22 + (s % 58);
  });
}

function previewLinePts(chartId: string, dim: string, indicator: string): number[] {
  return Array.from({ length: 8 }, (_, i) => {
    const s = previewSeed(chartId, dim, indicator, i, "line");
    return 15 + (s % 50);
  });
}

function previewKpiValue(chartId: string, indicator: string): string {
  const s = previewSeed(chartId, indicator, "kpi");
  if (/笔数|数量/.test(indicator)) return String(120 + (s % 880));
  return (320 + (s % 4800) / 10).toFixed(1);
}

function previewCell(chartId: string, dim: string, indicator: string): string {
  const s = previewSeed(chartId, dim, indicator);
  if (/时间|日期/.test(indicator)) {
    return `2024-${String((s % 12) + 1).padStart(2, "0")}-${String((s % 28) + 1).padStart(2, "0")}`;
  }
  if (/笔数|数量/.test(indicator)) return String(50 + (s % 950));
  return ((s % 200) + 20).toFixed(1);
}

function FieldChip({
  label,
  selected,
  onToggle,
}: {
  label: string;
  selected: boolean;
  onToggle: () => void;
}) {
  return (
    <button
      type="button"
      role="checkbox"
      aria-checked={selected}
      onClick={onToggle}
      className="inline-flex shrink-0 cursor-pointer items-center gap-1 rounded-md border px-2 py-[3px] text-[11px] leading-tight transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#1E40AF]/35"
      style={{
        borderColor: selected ? TOKEN.primary : TOKEN.border,
        background: selected ? TOKEN.primarySoft : TOKEN.card,
        color: selected ? TOKEN.primary : TOKEN.text,
      }}
    >
      <span>{label}</span>
    </button>
  );
}

export function InlineChartPreview({
  chart,
  accent = TOKEN.primary,
}: {
  chart: InsertedChart;
  accent?: string;
}) {
  const dim = chart.dimensions[0] ?? "维度";
  const indicator = chart.indicators[0] ?? "指标";

  if (chart.type === "kpi") {
    return (
      <div className="flex min-h-[160px] flex-col items-center justify-center px-4 py-6">
        <div className="text-[11px]" style={{ color: TOKEN.textDim }}>
          {indicator}
        </div>
        <div
          className="mt-2 font-['Inter',sans-serif] text-[36px] font-semibold tabular-nums"
          style={{ color: TOKEN.text }}
        >
          {previewKpiValue(chart.id, indicator)}
        </div>
        <div className="mt-1 text-[10px]" style={{ color: TOKEN.textMuted }}>
          汇总 · {dim}
          {chart.dimensions.length > 1 ? ` 等${chart.dimensions.length}项` : ""}
        </div>
      </div>
    );
  }

  if (chart.type === "table") {
    const rowDims = chart.dimensions.slice(0, 4);
    const colIndicators = chart.indicators.slice(0, 3);
    return (
      <div className="min-h-[160px] overflow-x-auto p-3">
        <table className="w-full min-w-max border-collapse text-[11px]" style={{ color: TOKEN.text }}>
          <thead>
            <tr style={{ background: TOKEN.surfaceAlt }}>
              <th className="px-2 py-1.5 text-left font-semibold">维度</th>
              {colIndicators.map((ind) => (
                <th key={ind} className="px-2 py-1.5 text-right font-semibold">
                  {ind}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {rowDims.map((d) => (
              <tr key={d} style={{ borderTop: `1px solid ${TOKEN.border}` }}>
                <td className="px-2 py-1.5 font-medium">{d}</td>
                {colIndicators.map((ind) => (
                  <td key={ind} className="px-2 py-1.5 text-right tabular-nums">
                    {previewCell(chart.id, d, ind)}
                  </td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    );
  }

  if (chart.type === "line") {
    const pts = previewLinePts(chart.id, dim, indicator);
    return (
      <div className="min-h-[160px] p-4">
        <div className="mb-2 text-[11px] font-medium" style={{ color: TOKEN.textMuted }}>
          {indicator} · {dim}
        </div>
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
      </div>
    );
  }

  const heights = previewBarHeights(chart.id, dim, indicator);
  return (
    <div className="min-h-[160px] p-4">
      <div className="mb-2 text-[11px] font-medium" style={{ color: TOKEN.textMuted }}>
        {indicator} · {dim}
      </div>
      <div className="flex h-28 items-end gap-1.5">
        {heights.map((h, i) => (
          <div
            key={i}
            className="flex-1 rounded-t opacity-90"
            style={{ height: `${h}%`, backgroundColor: accent }}
          />
        ))}
      </div>
    </div>
  );
}

export function ChartInsertPanel({
  analysisMode,
  dashTabLabel,
  dimensionSelections,
  l1Fields,
  l2Fields,
  insertedCount = 0,
  onInsert,
  collapsed: collapsedProp,
  defaultCollapsed = true,
  onCollapsedChange,
  sectionRef,
}: {
  analysisMode: AnalysisMode;
  dashTabLabel?: string;
  dimensionSelections: DimensionSelections;
  l1Fields: Set<string>;
  l2Fields: Set<string>;
  insertedCount?: number;
  onInsert: (chart: InsertedChart) => void;
  collapsed?: boolean;
  defaultCollapsed?: boolean;
  onCollapsedChange?: (collapsed: boolean) => void;
  sectionRef?: Ref<HTMLElement>;
}) {
  const [internalCollapsed, setInternalCollapsed] = useState(defaultCollapsed);
  const collapsed = collapsedProp ?? internalCollapsed;

  const setCollapsed = useCallback(
    (next: boolean | ((prev: boolean) => boolean)) => {
      const resolved =
        typeof next === "function"
          ? next(collapsedProp ?? internalCollapsed)
          : next;
      if (collapsedProp === undefined) {
        setInternalCollapsed(resolved);
      }
      onCollapsedChange?.(resolved);
    },
    [collapsedProp, internalCollapsed, onCollapsedChange],
  );
  const dimensionGroups = useMemo(
    () => getDimensionGroupsForInsert(analysisMode, dashTabLabel),
    [analysisMode, dashTabLabel],
  );
  const allDimensions = useMemo(
    () => getAllDimensionOptions(analysisMode, dashTabLabel),
    [analysisMode, dashTabLabel],
  );
  const indicatorOptions = useMemo(
    () => getIndicatorOptionsForInsert(analysisMode, dashTabLabel),
    [analysisMode, dashTabLabel],
  );

  const [chartType, setChartType] = useState<WidgetType | null>("bar");
  const [selectedDimensions, setSelectedDimensions] = useState<Set<string>>(() =>
    getDefaultInsertDimensions(analysisMode, dimensionSelections, dashTabLabel),
  );
  const [selectedIndicators, setSelectedIndicators] = useState<Set<string>>(() =>
    getDefaultInsertIndicators(analysisMode, l1Fields, l2Fields, dashTabLabel),
  );

  useEffect(() => {
    setSelectedDimensions(getDefaultInsertDimensions(analysisMode, dimensionSelections, dashTabLabel));
    setSelectedIndicators(getDefaultInsertIndicators(analysisMode, l1Fields, l2Fields, dashTabLabel));
  }, [analysisMode, dashTabLabel, dimensionSelections, l1Fields, l2Fields]);

  const resetDraft = () => {
    setChartType("bar");
    setSelectedDimensions(getDefaultInsertDimensions(analysisMode, dimensionSelections, dashTabLabel));
    setSelectedIndicators(getDefaultInsertIndicators(analysisMode, l1Fields, l2Fields, dashTabLabel));
  };

  const toggleDimension = (opt: string, groupOptions: readonly string[]) => {
    const next = new Set(selectedDimensions);
    if (next.has(opt)) {
      next.delete(opt);
      if (next.size === 0) {
        setSelectedDimensions(new Set(groupOptions));
        return;
      }
    } else {
      next.add(opt);
    }
    setSelectedDimensions(next);
  };

  const toggleIndicator = (opt: string) => {
    const next = new Set(selectedIndicators);
    if (next.has(opt)) next.delete(opt);
    else next.add(opt);
    setSelectedIndicators(next);
  };

  const canInsert =
    chartType !== null && selectedDimensions.size > 0 && selectedIndicators.size > 0;

  const handleInsert = () => {
    if (!chartType || !canInsert) return;
    const dimensions = allDimensions.filter((d) => selectedDimensions.has(d));
    const indicators = indicatorOptions.filter((i) => selectedIndicators.has(i));
    onInsert({
      id: newInsertedChartId(),
      type: chartType,
      title: buildInsertedChartTitle(chartType, indicators),
      dimensions,
      indicators,
    });
    setCollapsed(true);
  };

  const typeLabel =
    chartType != null
      ? (CHART_INSERT_TYPES.find((t) => t.type === chartType)?.label ?? "")
      : "";

  return (
    <section
      ref={sectionRef}
      data-chart-insert-panel
      className="rounded-lg border"
      style={{ borderColor: TOKEN.border, background: TOKEN.card }}
    >
      <button
        type="button"
        aria-expanded={!collapsed}
        onClick={() => setCollapsed((c) => !c)}
        className="flex w-full cursor-pointer items-center gap-2 rounded-t-lg border-b px-3 py-2 text-left transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-inset focus-visible:ring-[#1E40AF]/30"
        style={{ borderColor: TOKEN.border, background: TOKEN.surfaceAlt, color: TOKEN.text }}
      >
        <h3 className="text-[13px] font-semibold">插入看板</h3>
        {collapsed ? (
          <span className="min-w-0 flex-1 truncate text-[11px]" style={{ color: TOKEN.textDim }}>
            {insertedCount > 0
              ? `已插入 ${insertedCount} 个 · 点击展开继续添加`
              : typeLabel
                ? `点击展开 · 当前 ${typeLabel}`
                : "点击展开配置图表"}
          </span>
        ) : (
          <span className="flex-1 text-[10px]" style={{ color: TOKEN.textDim }}>
            选择图表、维度与指标后插入
          </span>
        )}
        <ChevronIcon expanded={!collapsed} />
      </button>

      {!collapsed ? (
      <div className="flex flex-col gap-3 p-3">
        <div>
          <p className="mb-1.5 text-[11px] font-semibold" style={{ color: TOKEN.text }}>
            图表类型
          </p>
          <div className="grid grid-cols-4 gap-2">
            {CHART_INSERT_TYPES.map((item) => {
              const active = chartType === item.type;
              return (
                <button
                  key={item.type}
                  type="button"
                  onClick={() => setChartType(item.type)}
                  className="flex cursor-pointer flex-col rounded-md border px-2 py-2 text-left transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#1E40AF]/35"
                  style={{
                    borderColor: active ? TOKEN.primary : TOKEN.border,
                    background: active ? TOKEN.primarySoft : TOKEN.card,
                  }}
                >
                  <span
                    className="text-[12px] font-semibold"
                    style={{ color: active ? TOKEN.primary : TOKEN.text }}
                  >
                    {item.label}
                  </span>
                  <span className="mt-0.5 line-clamp-2 text-[10px] leading-snug" style={{ color: TOKEN.textDim }}>
                    {item.hint}
                  </span>
                </button>
              );
            })}
          </div>
        </div>

        <div className="h-px" style={{ background: TOKEN.border }} />

        <div>
          <div className="mb-1.5 flex items-center justify-between">
            <p className="text-[11px] font-semibold" style={{ color: TOKEN.text }}>
              维度
            </p>
            <span className="text-[10px] tabular-nums" style={{ color: TOKEN.textDim }}>
              {selectedDimensions.size}/{allDimensions.length}
            </span>
          </div>
          <div className="flex max-h-[140px] flex-col gap-2 overflow-y-auto pr-1 [scrollbar-width:thin]">
            {dimensionGroups.map((group) => (
              <div key={group.label}>
                <p className="mb-1 text-[10px] font-medium" style={{ color: TOKEN.textDim }}>
                  {group.label}
                </p>
                <div className="flex flex-wrap gap-1">
                  {group.options.map((opt) => {
                    const active = selectedDimensions.has(opt);
                    return (
                      <button
                        key={opt}
                        type="button"
                        aria-pressed={active}
                        onClick={() => toggleDimension(opt, group.options)}
                        className="inline-flex shrink-0 cursor-pointer rounded-md border px-2 py-[3px] text-[11px] transition-colors"
                        style={{
                          borderColor: active ? TOKEN.primary : TOKEN.border,
                          background: active ? TOKEN.primary : TOKEN.card,
                          color: active ? "#FFFFFF" : TOKEN.text,
                        }}
                      >
                        {opt}
                      </button>
                    );
                  })}
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="h-px" style={{ background: TOKEN.border }} />

        <div>
          <div className="mb-1.5 flex items-center justify-between">
            <p className="text-[11px] font-semibold" style={{ color: TOKEN.text }}>
              指标
            </p>
            <span className="text-[10px] tabular-nums" style={{ color: TOKEN.textDim }}>
              {selectedIndicators.size}/{indicatorOptions.length}
            </span>
          </div>
          <div className="flex max-h-[100px] flex-wrap gap-1.5 overflow-y-auto pr-1 [scrollbar-width:thin]">
            {indicatorOptions.map((ind) => (
              <FieldChip
                key={ind}
                label={ind}
                selected={selectedIndicators.has(ind)}
                onToggle={() => toggleIndicator(ind)}
              />
            ))}
          </div>
        </div>

        <div className="flex items-center justify-between gap-2 border-t pt-2" style={{ borderColor: TOKEN.border }}>
          <p className="text-[10px]" style={{ color: TOKEN.textDim }}>
            {canInsert ? "配置完整，可插入看板" : "请选择图表类型、至少一个维度和指标"}
          </p>
          <div className="flex shrink-0 items-center gap-2">
            <button
              type="button"
              onClick={resetDraft}
              className="cursor-pointer rounded-md border px-2.5 py-1.5 text-[11px] transition-colors"
              style={{ borderColor: TOKEN.border, color: TOKEN.textMuted }}
            >
              重置配置
            </button>
            <button
              type="button"
              disabled={!canInsert}
              onClick={handleInsert}
              className="cursor-pointer rounded-md px-3 py-1.5 text-[12px] font-medium text-white transition-opacity disabled:cursor-not-allowed disabled:opacity-40"
              style={{ background: TOKEN.primary }}
            >
              插入看板
            </button>
          </div>
        </div>
      </div>
      ) : null}
    </section>
  );
}

export function InsertedChartsGallery({
  charts,
  onRemove,
}: {
  charts: InsertedChart[];
  onRemove: (id: string) => void;
}) {
  if (charts.length === 0) return null;

  return (
    <section className="flex flex-col gap-3">
      <div className="flex items-center justify-between px-0.5">
        <h3 className="text-[13px] font-semibold" style={{ color: TOKEN.text }}>
          已插入看板
        </h3>
        <span className="text-[11px] tabular-nums" style={{ color: TOKEN.textDim }}>
          共 {charts.length} 个
        </span>
      </div>
      <div className="flex max-h-[480px] flex-col gap-3 overflow-y-auto pr-1 [scrollbar-width:thin]">
        {charts.map((chart) => (
          <article
            key={chart.id}
            className="overflow-hidden rounded-lg border"
            style={{ borderColor: TOKEN.border, background: TOKEN.card }}
          >
            <div
              className="flex flex-wrap items-center gap-2 border-b px-3 py-2"
              style={{ borderColor: TOKEN.border, background: TOKEN.surfaceAlt }}
            >
              <h4 className="text-[12px] font-semibold" style={{ color: TOKEN.text }}>
                {chart.title}
              </h4>
              <span
                className="rounded px-1.5 py-0.5 text-[10px]"
                style={{ background: TOKEN.primarySoftRing, color: TOKEN.primary }}
              >
                {CHART_INSERT_TYPES.find((t) => t.type === chart.type)?.label ?? chart.type}
              </span>
              <div className="ml-auto flex shrink-0 items-center gap-1">
                <button
                  type="button"
                  onClick={() => onRemove(chart.id)}
                  className="cursor-pointer rounded px-2 py-0.5 text-[11px] transition-colors hover:bg-red-50 hover:text-red-600"
                  style={{ color: TOKEN.textMuted }}
                >
                  删除
                </button>
              </div>
            </div>
            <div className="flex flex-wrap gap-1 border-b px-3 py-1.5" style={{ borderColor: TOKEN.border }}>
              <span className="text-[10px]" style={{ color: TOKEN.textDim }}>
                维度:
              </span>
              {chart.dimensions.slice(0, 6).map((d) => (
                <span
                  key={d}
                  className="rounded px-1.5 py-0.5 text-[10px]"
                  style={{ background: TOKEN.surfaceAlt, color: TOKEN.textMuted }}
                >
                  {d}
                </span>
              ))}
              {chart.dimensions.length > 6 ? (
                <span className="text-[10px]" style={{ color: TOKEN.textDim }}>
                  +{chart.dimensions.length - 6}
                </span>
              ) : null}
              <span className="mx-1 text-[10px]" style={{ color: TOKEN.border }}>
                |
              </span>
              <span className="text-[10px]" style={{ color: TOKEN.textDim }}>
                指标:
              </span>
              {chart.indicators.slice(0, 4).map((ind) => (
                <span
                  key={ind}
                  className="rounded px-1.5 py-0.5 text-[10px]"
                  style={{ background: TOKEN.primarySoft, color: TOKEN.primary }}
                >
                  {ind}
                </span>
              ))}
              {chart.indicators.length > 4 ? (
                <span className="text-[10px]" style={{ color: TOKEN.textDim }}>
                  +{chart.indicators.length - 4}
                </span>
              ) : null}
            </div>
            <InlineChartPreview chart={chart} />
          </article>
        ))}
      </div>
    </section>
  );
}
