import { useCallback, useMemo, useState } from "react";
import type { CanvasWidget } from "../model/dashboardModel";
import { dataMixHash } from "../model/templateDatasets";
import type { FieldSlotBindings } from "./ReplicaRightPanel";

const ORANGE = "#ea580c";
const ORANGE_SOFT = "#fed7aa";
const HEADER_BG = "#fff7ed";
const INACTIVE_LINE = "#d4d4d8";

type TreeNode = {
  id: string;
  label: string;
  value: string;
  pctLabel: string;
  ringPct: number;
  children?: TreeNode[];
};

function formatNum(n: number, digits = 1): string {
  return n.toLocaleString("zh-CN", { minimumFractionDigits: digits, maximumFractionDigits: digits });
}

function DonutGlyph({ ringPct, active, tone = "orange" }: { ringPct: number; active: boolean; tone?: "orange" | "blue" }) {
  const arc = Math.min(100, Math.max(0, ringPct)) * 0.942;
  const stroke =
    tone === "blue" ? (active ? "#1677ff" : "#94a3b8") : active ? ORANGE : "#a3a3a3";
  const track = tone === "blue" ? (active ? "#e0eaff" : "#f4f4f5") : active ? ORANGE_SOFT : "#f4f4f5";
  return (
    <svg className="h-7 w-7 shrink-0 -rotate-90" viewBox="0 0 36 36" aria-hidden>
      <circle cx="18" cy="18" r="14" fill="none" stroke={track} strokeWidth="4" />
      <circle
        cx="18"
        cy="18"
        r="14"
        fill="none"
        stroke={stroke}
        strokeWidth="4"
        strokeDasharray={`${arc} 100`}
        strokeLinecap="round"
      />
    </svg>
  );
}

function TreeNodePill({
  node,
  active,
  onClick,
  showExpandDot,
}: {
  node: TreeNode;
  active: boolean;
  onClick?: () => void;
  showExpandDot?: boolean;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={`relative flex w-[min(100%,118px)] flex-col gap-0.5 rounded-xl border bg-white px-2 py-1.5 text-left shadow-sm transition hover:shadow ${
        active ? "border-2 shadow-orange-100/80" : "border border-neutral-200"
      }`}
      style={active ? { borderColor: ORANGE } : undefined}
    >
      <div className="flex items-start gap-1">
        <DonutGlyph ringPct={node.ringPct} active={active} />
        <div className="min-w-0 flex-1">
          <div className="flex items-start justify-between gap-1">
            <span className={`line-clamp-2 text-[11px] font-medium leading-tight ${active ? "text-neutral-900" : "text-neutral-700"}`}>
              {node.label}
            </span>
            <span className="shrink-0 text-[10px] font-semibold tabular-nums text-neutral-900">{node.value}</span>
          </div>
          <div className="text-[10px] text-neutral-500">
            占比 <span className="tabular-nums font-medium text-neutral-700">{node.pctLabel}</span>
          </div>
        </div>
      </div>
      {showExpandDot && active ? (
        <span className="absolute -right-0.5 top-1/2 size-1.5 -translate-y-1/2 rounded-full" style={{ backgroundColor: ORANGE }} />
      ) : null}
    </button>
  );
}

/** 驾驶舱首页：参考 EVA 多层级拆解（长图一） */
function EvaDemoTree({ title, hint }: { title: string; hint?: string }) {
  const tree: TreeNode = useMemo(
    () => ({
      id: "root",
      label: "EVA",
      value: "-40.52万",
      pctLabel: "—",
      ringPct: 88,
      children: [
        {
          id: "p1",
          label: "担保理财",
          value: "-12.3万",
          pctLabel: "30.4%",
          ringPct: 32,
        },
        {
          id: "p2",
          label: "担保定期保证金",
          value: "2.529万",
          pctLabel: "12.37%",
          ringPct: 62,
          children: [
            {
              id: "l1",
              label: "个金条线",
              value: "2.529万",
              pctLabel: "100.00%",
              ringPct: 100,
              children: [
                {
                  id: "b1",
                  label: "某银行苏州(汇总)",
                  value: "1.345万",
                  pctLabel: "53.2%",
                  ringPct: 54,
                  children: [
                    {
                      id: "s1",
                      label: "某银行苏州市区(汇总)",
                      value: "1.345万",
                      pctLabel: "100.00%",
                      ringPct: 100,
                    },
                  ],
                },
                {
                  id: "b2",
                  label: "某银行盐城(汇总)",
                  value: "1.137万",
                  pctLabel: "44.9%",
                  ringPct: 45,
                },
                {
                  id: "b3",
                  label: "某银行徐州(汇总)",
                  value: "463",
                  pctLabel: "18.3%",
                  ringPct: 18,
                },
              ],
            },
          ],
        },
        {
          id: "p3",
          label: "对公结构性存款",
          value: "-6.8万",
          pctLabel: "16.8%",
          ringPct: 24,
        },
      ],
    }),
    [],
  );

  const headers = [null, "PA产品名", "条线名", "机构名称_分行", "机构名称_一级支行"] as const;

  const [path, setPath] = useState<number[]>([1, 0, 0, 0]);

  const columns = useMemo(() => {
    const cols: { header: string | null; nodes: TreeNode[] }[] = [];
    let cursor: TreeNode | undefined = tree;
    cols.push({ header: null, nodes: [tree] });
    for (let d = 1; d < headers.length; d++) {
      const children = cursor?.children ?? [];
      if (!children.length) break;
      cols.push({ header: headers[d]!, nodes: children });
      const pick = Math.min(path[d - 1] ?? 0, Math.max(0, children.length - 1));
      cursor = children[pick];
    }
    return cols;
  }, [path, tree]);

  const setPick = useCallback((depth: number, index: number) => {
    setPath((prev) => [...prev.slice(0, depth), index]);
  }, []);

  const nodeActive = (depth: number, index: number) => (depth === 0 ? index === 0 : path[depth - 1] === index);

  const colW = 140;
  const headerH = 30;
  const rowH = 76;
  const padTop = 8;

  const connectorPaths = useMemo(() => {
    const paths: { d: string; active: boolean }[] = [];
    let cursor: TreeNode | undefined = tree;
    for (let d = 0; d < path.length && cursor?.children?.length; d++) {
      const children = cursor.children;
      const pick = Math.min(path[d] ?? 0, children.length - 1);
      const px = d * colW + colW - 12;
      const py = padTop + headerH + pick * rowH + rowH / 2;
      children.forEach((ch, ci) => {
        const cx = (d + 1) * colW + 10;
        const cy = padTop + headerH + ci * rowH + rowH / 2;
        const onActiveBranch = pick === path[d] && path[d + 1] === ci;
        const dPath = `M ${px} ${py} C ${px + 40} ${py}, ${cx - 40} ${cy}, ${cx} ${cy}`;
        paths.push({ d: dPath, active: onActiveBranch });
      });
      cursor = children[pick];
    }
    return paths;
  }, [path, tree]);

  const svgW = Math.max(520, columns.length * colW + 24);
  const svgH = padTop + headerH + 4 * rowH + 16;

  return (
    <div className="flex flex-col px-2 pb-2 pt-1">
      <div className="mb-2 flex items-center justify-between border-b border-black/[0.06] pb-2">
        <span className="text-sm font-semibold text-figma-text">{title}</span>
        <span className="text-[10px] text-figma-sub">Tips: 当前无查询条件</span>
      </div>
      {hint ? <div className="mb-2 text-[10px] text-figma-sub">{hint}</div> : null}
      <div className="relative min-h-[260px] w-full overflow-x-auto rounded-lg border border-black/[0.06] bg-white/95 px-1 py-2">
        <svg className="pointer-events-none absolute left-0 top-0" width={svgW} height={svgH} aria-hidden>
          {connectorPaths.map((p, i) => (
            <path
              key={i}
              d={p.d}
              fill="none"
              stroke={p.active ? ORANGE : INACTIVE_LINE}
              strokeWidth={p.active ? 2.2 : 1}
              opacity={p.active ? 1 : 0.45}
            />
          ))}
        </svg>
        <div className="relative z-[1] flex min-w-max gap-0 pr-2" style={{ paddingTop: padTop }}>
          {columns.map((col, depth) => (
            <div key={depth} className="flex w-[140px] shrink-0 flex-col gap-1.5 px-1">
              {col.header ? (
                <div
                  className="mb-0.5 flex h-[30px] items-center justify-between rounded-md border border-orange-100 px-1.5 text-[10px] font-medium text-neutral-800"
                  style={{ backgroundColor: HEADER_BG }}
                >
                  <span className="line-clamp-2 flex-1 leading-snug">{col.header}</span>
                  <button type="button" className="shrink-0 px-0.5 text-neutral-400 hover:text-neutral-700" aria-label="移除维度">
                    ×
                  </button>
                </div>
              ) : (
                <div className="h-[30px]" />
              )}
              <div className="flex flex-col gap-2">
                {col.nodes.map((node, idx) => (
                  <div key={node.id} className="min-h-[68px]">
                    <TreeNodePill
                      node={node}
                      active={nodeActive(depth, idx)}
                      showExpandDot={!!node.children?.length}
                      onClick={() => (node.children?.length ? setPick(depth, idx) : undefined)}
                    />
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

function LibraryUnconfiguredPreview() {
  const ghost: TreeNode = { id: "g", label: "Money", value: "234,333", pctLabel: "—", ringPct: 40 };
  return (
    <div className="relative flex min-h-[200px] flex-col px-2 pb-2 pt-1">
      <div className="mb-2 flex items-center justify-between border-b border-black/[0.06] pb-2">
        <span className="text-sm font-semibold text-figma-text">指标拆解</span>
      </div>
      <div className="flex flex-1 items-center justify-center gap-6 py-4 opacity-[0.35]">
        <TreeNodePill node={ghost} active />
        <div className="text-neutral-400">···</div>
        <div className="h-16 w-16 rounded-full border border-dashed border-neutral-300" />
      </div>
      <div className="pointer-events-none absolute inset-0 flex items-center justify-center pt-6">
        <span className="rounded-md bg-white/90 px-3 py-1.5 text-xs font-medium text-neutral-600 shadow-sm ring-1 ring-black/[0.06]">
          三维列表无数据
        </span>
      </div>
    </div>
  );
}

const IRIS_CLASS_ROWS = [
  { label: "Iris-virginica", value: 329.4 },
  { label: "Iris-versicolor", value: 296.8 },
  { label: "Iris-setosa", value: 250.3 },
];

function isIrisSpeciesDim(dims: { key: string; label: string }[]): boolean {
  if (!dims.length) return false;
  const t = `${dims[0]!.key} ${dims[0]!.label}`.toLowerCase();
  return /species|class|物种/.test(t);
}

function isSepalLenMeasure(m?: { key: string; label: string }): boolean {
  if (!m) return false;
  const t = `${m.key} ${m.label}`.toLowerCase();
  return /sepal_len|花萼长/.test(t);
}

const PRIMARY_BLUE = "#1677ff";
const LINE_GRAY = "#cbd5e1";

/** Iris + sepal_len：参考横向「指标拆解树」布局（根在左、子类纵向在右、蓝色连线） */
function IrisHorizontalMetricTree({ slotBindings, title }: { slotBindings: FieldSlotBindings; title: string }) {
  const dims = slotBindings.breakdownDims ?? [];
  const measure = slotBindings.breakdownMeasure?.[0];
  const mLabel = measure?.label ?? "sepal_len";
  const dim0Label = dims[0]?.label ?? "class";
  const rootTotal = IRIS_CLASS_ROWS.reduce((s, r) => s + r.value, 0);
  const [selectedI, setSelectedI] = useState(0);

  const ROW_H = 72;
  const GAP = 12;
  const stackH = IRIS_CLASS_ROWS.length * ROW_H + (IRIS_CLASS_ROWS.length - 1) * GAP;
  const mids = IRIS_CLASS_ROWS.map((_, i) => ROW_H / 2 + i * (ROW_H + GAP));
  const midY = stackH / 2;
  const yMin = Math.min(...mids);
  const yMax = Math.max(...mids);
  const hubX = 28;
  const rightX = 78;

  return (
    <div className="flex flex-col px-2 pb-2 pt-1">
      <div className="mb-3 flex items-center justify-between gap-2 border-b border-black/[0.06] pb-2">
        <div className="flex min-w-0 items-center gap-1.5">
          <span className="truncate text-sm font-semibold text-figma-text">{title || "指标拆解树"}</span>
          <span className="shrink-0 text-neutral-400" aria-hidden>
            ↗
          </span>
        </div>
        <div className="flex flex-1 justify-center px-2">
          <div className="inline-flex max-w-full items-center gap-2 truncate rounded-full border border-primary/25 bg-primary/[0.06] px-3 py-1 text-xs font-medium text-primary">
            <span className="shrink-0 text-[10px] font-normal text-primary/80">维度</span>
            <span className="truncate">{dim0Label}</span>
          </div>
        </div>
        <button type="button" className="shrink-0 px-1 text-neutral-400 hover:text-neutral-600" aria-label="更多">
          ⋮
        </button>
      </div>
      <div className="relative w-full overflow-x-auto rounded-lg border border-black/[0.06] bg-white/95 px-3 py-4">
        <div className="flex min-w-[560px] items-center gap-2 pr-2">
          <div className="relative shrink-0">
            <div className="relative flex min-w-[220px] max-w-[280px] items-center gap-3 rounded-2xl border-2 border-primary bg-white px-4 py-3 shadow-md">
              <DonutGlyph ringPct={100} active tone="blue" />
              <div className="min-w-0 flex-1">
                <div className="text-xs font-semibold text-primary">{mLabel}</div>
                <div className="text-xl font-bold tabular-nums text-figma-text">{formatNum(rootTotal, 1)}</div>
              </div>
              <span
                className="absolute -right-3 top-1/2 flex size-7 -translate-y-1/2 cursor-default items-center justify-center rounded-full border-2 border-white bg-primary text-[11px] font-bold leading-none text-white shadow"
                aria-hidden
              >
                ×
              </span>
            </div>
          </div>

          <svg width={rightX + 4} height={stackH} className="shrink-0 overflow-visible text-[0]" aria-hidden>
            <path
              d={`M 0 ${midY} H ${hubX} M ${hubX} ${yMin} V ${yMax}`}
              fill="none"
              stroke={LINE_GRAY}
              strokeWidth={1.25}
            />
            {mids.map((cy, i) => {
              const active = selectedI === i;
              return (
                <path
                  key={i}
                  d={`M ${hubX} ${cy} H ${rightX}`}
                  fill="none"
                  stroke={active ? PRIMARY_BLUE : LINE_GRAY}
                  strokeWidth={active ? 2 : 1.2}
                  strokeDasharray={i === 0 && active ? "5 4" : undefined}
                  opacity={active ? 1 : 0.55}
                />
              );
            })}
          </svg>

          <div className="flex min-w-0 flex-1 flex-col gap-3">
            {IRIS_CLASS_ROWS.map((r, i) => {
              const pct = rootTotal > 0 ? (r.value / rootTotal) * 100 : 0;
              const active = selectedI === i;
              return (
                <button
                  key={r.label}
                  type="button"
                  onClick={() => setSelectedI(i)}
                  className={`flex w-full min-w-[240px] max-w-[320px] items-center gap-3 rounded-2xl border bg-white px-3 py-2.5 text-left shadow-sm transition hover:shadow ${
                    active ? "border-primary ring-1 ring-primary/25" : "border-neutral-200"
                  }`}
                >
                  <DonutGlyph ringPct={Math.min(100, pct)} active={active} tone="blue" />
                  <div className="min-w-0 flex-1">
                    <div className="flex items-start justify-between gap-2">
                      <span className="text-[12px] font-medium leading-snug text-figma-text">{r.label}</span>
                      <span className="shrink-0 text-[12px] font-semibold tabular-nums text-figma-text">{formatNum(r.value, 1)}</span>
                    </div>
                    <div className="mt-0.5 flex items-center justify-between text-[10px] text-figma-sub">
                      <span>占比</span>
                      <span className="font-medium tabular-nums text-figma-text">{pct.toFixed(2)}%</span>
                    </div>
                  </div>
                </button>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
}

function BoundMetricTreeColumns({
  slotBindings,
  dataSeed,
  widgetId,
}: {
  slotBindings: FieldSlotBindings;
  dataSeed: number;
  widgetId: string;
}) {
  const dims = slotBindings.breakdownDims ?? [];
  const measure = slotBindings.breakdownMeasure?.[0];

  const [path, setPath] = useState<number[]>(() => [0]);

  const { columns } = useMemo(() => {
    const mLabel = measure?.label ?? "度量";
    let rootValue: number;
    let level0: TreeNode[] = [];

    const n = 2 + (dataMixHash(`${widgetId}|mbt0`, dataSeed) % 4);
    for (let i = 0; i < n; i++) {
      const v = 50 + (dataMixHash(`${widgetId}|mbt|${i}`, dataSeed) % 220);
      level0.push({
        id: `l0-${i}`,
        label: `分支 ${i + 1}`,
        value: formatNum(v, 1),
        pctLabel: "0.00%",
        ringPct: 40 + (i * 17) % 55,
        children:
          dims.length > 1
            ? [
                {
                  id: `l1-${i}-0`,
                  label: `${dims[1]?.label?.slice(0, 4) ?? "子级"}-A`,
                  value: formatNum(v * 0.55, 1),
                  pctLabel: "55.00%",
                  ringPct: 55,
                },
                {
                  id: `l1-${i}-1`,
                  label: `${dims[1]?.label?.slice(0, 4) ?? "子级"}-B`,
                  value: formatNum(v * 0.45, 1),
                  pctLabel: "45.00%",
                  ringPct: 45,
                },
              ]
            : undefined,
      });
    }
    rootValue = level0.reduce((s, r) => s + parseFloat(r.value.replace(/,/g, "")), 0);
    level0 = level0.map((node) => {
      const val = parseFloat(node.value.replace(/,/g, ""));
      const pct = rootValue > 0 ? (val / rootValue) * 100 : 0;
      return { ...node, pctLabel: `${pct.toFixed(2)}%`, ringPct: Math.min(100, pct) };
    });

    const rootNode: TreeNode = {
      id: "root",
      label: mLabel,
      value: formatNum(rootValue, 1),
      pctLabel: "100.00%",
      ringPct: 100,
    };

    const cols: { header: string | null; nodes: TreeNode[] }[] = [{ header: null, nodes: [rootNode] }];
    cols.push({ header: dims[0]?.label ?? "维度", nodes: level0 });
    return { columns: cols };
  }, [dataSeed, dims, measure?.label, widgetId]);

  const safePath = useMemo(() => {
    const c1 = columns[1]?.nodes ?? [];
    const p0 = Math.min(path[0] ?? 0, Math.max(0, c1.length - 1));
    const kids = c1[p0]?.children ?? [];
    const p1 = Math.min(path[1] ?? 0, Math.max(0, kids.length - 1));
    return [p0, p1];
  }, [columns, path]);

  const visibleCols = useMemo(() => {
    const out = [columns[0]!, columns[1]!];
    if (dims.length >= 2) {
      const p0 = safePath[0] ?? 0;
      const parent = columns[1]!.nodes[p0];
      const kids = parent?.children ?? [];
      if (kids.length) {
        out.push({ header: dims[1]?.label ?? "维度 2", nodes: kids });
      }
    }
    return out;
  }, [columns, dims.length, safePath]);

  const setPick = (depth: number, index: number) => {
    setPath((prev) => [...prev.slice(0, depth), index]);
  };

  const nodeActive = (depth: number, idx: number) => {
    if (depth === 0) return idx === 0;
    if (depth === 1) return (safePath[0] ?? 0) === idx;
    return (safePath[1] ?? 0) === idx;
  };

  const colW = 140;
  const headerH = 30;
  const rowH = 76;
  const padTop = 8;

  const connectorPaths = useMemo(() => {
    const paths: { d: string; active: boolean }[] = [];
    if (visibleCols.length < 2) return paths;
    for (let d = 0; d < visibleCols.length - 1; d++) {
      const children = visibleCols[d + 1]!.nodes;
      const pIdx = d === 0 ? 0 : safePath[d - 1] ?? 0;
      const py = padTop + headerH + pIdx * rowH + rowH / 2;
      const px = d * colW + colW - 12;
      children.forEach((_, ci) => {
        const cx = (d + 1) * colW + 10;
        const cy = padTop + headerH + ci * rowH + rowH / 2;
        const active = d === 0 ? ci === (safePath[0] ?? 0) : ci === (safePath[1] ?? 0);
        paths.push({
          d: `M ${px} ${py} C ${px + 40} ${py}, ${cx - 40} ${cy}, ${cx} ${cy}`,
          active,
        });
      });
    }
    return paths;
  }, [safePath, visibleCols]);

  const maxRows = Math.max(1, ...visibleCols.map((c) => c.nodes.length));
  const svgW = Math.max(520, visibleCols.length * colW + 24);
  const svgH = padTop + headerH + maxRows * rowH + 20;

  return (
    <div className="flex flex-col px-2 pb-2 pt-1">
      <div className="mb-2 flex items-center justify-between border-b border-black/[0.06] pb-2">
        <span className="text-sm font-semibold text-figma-text">指标拆解树</span>
        <span className="max-w-[48%] truncate text-[10px] text-primary">{dims.map((d) => d.label).join(" → ")}</span>
      </div>
      <div
        className="relative w-full overflow-x-auto rounded-lg border border-black/[0.06] bg-white/95 px-1 py-2"
        style={{ minHeight: Math.max(260, svgH + 8) }}
      >
        <svg className="pointer-events-none absolute left-0 top-0" width={svgW} height={svgH} aria-hidden>
          {connectorPaths.map((p, i) => (
            <path
              key={i}
              d={p.d}
              fill="none"
              stroke={p.active ? ORANGE : INACTIVE_LINE}
              strokeWidth={p.active ? 2.2 : 1}
              opacity={p.active ? 1 : 0.45}
            />
          ))}
        </svg>
        <div className="relative z-[1] flex min-w-max gap-0 pr-2" style={{ paddingTop: padTop }}>
          {visibleCols.map((col, depth) => (
            <div key={depth} className="flex w-[140px] shrink-0 flex-col gap-1.5 px-1">
              {col.header ? (
                <div
                  className="mb-0.5 flex h-[30px] items-center justify-between rounded-md border border-orange-100 px-1.5 text-[10px] font-medium text-neutral-800"
                  style={{ backgroundColor: HEADER_BG }}
                >
                  <span className="line-clamp-2 flex-1 leading-snug">{col.header}</span>
                  <button type="button" className="shrink-0 px-0.5 text-neutral-400 hover:text-neutral-700" aria-label="移除维度">
                    ×
                  </button>
                </div>
              ) : (
                <div className="h-[30px]" />
              )}
              <div className="flex flex-col gap-2">
                {col.nodes.map((node, idx) => (
                  <div key={node.id} className="min-h-[68px]">
                    <TreeNodePill
                      node={node}
                      active={nodeActive(depth, idx)}
                      showExpandDot={!!node.children?.length && depth === 1}
                      onClick={() => {
                        if (depth === 1) setPick(0, idx);
                        if (depth === 2) setPick(1, idx);
                      }}
                    />
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

function BoundMetricTree({
  slotBindings,
  dataSeed,
  widgetId,
  title,
}: {
  slotBindings: FieldSlotBindings;
  dataSeed: number;
  widgetId: string;
  title: string;
}) {
  const dims = slotBindings.breakdownDims ?? [];
  const measure = slotBindings.breakdownMeasure?.[0];
  const irisLike = isIrisSpeciesDim(dims) && isSepalLenMeasure(measure);
  if (irisLike) {
    return <IrisHorizontalMetricTree slotBindings={slotBindings} title={title} />;
  }
  return <BoundMetricTreeColumns slotBindings={slotBindings} dataSeed={dataSeed} widgetId={widgetId} />;
}

export type MetricBreakdownTreeViewProps = {
  w: CanvasWidget;
  slotBindings: FieldSlotBindings;
  dataSeed: number;
  accent: string;
  hint?: string;
  emptyUnlessBound: boolean;
};

export function MetricBreakdownTreeView({ w, slotBindings, dataSeed, accent, hint, emptyUnlessBound }: MetricBreakdownTreeViewProps) {
  const measureBound = (slotBindings.breakdownMeasure?.length ?? 0) > 0;
  const dimsBound = (slotBindings.breakdownDims?.length ?? 0) > 0;
  const showBound = measureBound && dimsBound;

  if (emptyUnlessBound && !showBound) {
    return <LibraryUnconfiguredPreview />;
  }

  if (showBound) {
    return <BoundMetricTree slotBindings={slotBindings} dataSeed={dataSeed} widgetId={w.id} title={w.title} />;
  }

  return <EvaDemoTree title={w.title} hint={hint} />;
}
