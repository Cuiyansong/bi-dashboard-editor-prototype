import { useMemo, useState } from "react";
import type { CanvasWidget } from "../model/dashboardModel";
import {
  CUST_TIER_OPTIONS,
  SEVEN_COHORT_OPTIONS,
} from "../model/customerFilters";

const TOKEN = {
  primary: "#1E40AF",
  primaryHover: "#1E3A8A",
  primarySoft: "#EFF6FF",
  primarySoftRing: "#DBEAFE",
  accent: "#D97706",
  surface: "#F8FAFC",
  surfaceAlt: "#F1F5F9",
  card: "#FFFFFF",
  border: "#E2E8F0",
  borderStrong: "#CBD5E1",
  text: "#0F172A",
  textMuted: "#475569",
  textDim: "#64748B",
  positive: "#16A34A",
  negative: "#DC2626",
} as const;

const COMMON_TABS = [
  "资金信息",
  "风量信息",
  "参与人信息",
  "担保抵押物信息",
  "待办信息",
  "银行直查",
  "财务收账信息",
  "可视化新签情况",
  "暂停信息导出",
] as const;

const LEVEL1_TABS = COMMON_TABS;
const LEVEL2_TABS = ["同环比", ...COMMON_TABS] as const;

const YOY_TAB_LABEL = "同环比";
const YOY_FIELDS = ["同比", "环比", "占比"] as const;

function getTabFields(tabLabel: string): readonly string[] {
  return tabLabel === YOY_TAB_LABEL ? YOY_FIELDS : PENDING_FIELDS;
}

const PENDING_FIELDS = [
  "成交价",
  "贷款方式",
  "贷款委托机构",
  "物业交割时设立",
  "定金金额（第二笔）",
  "定金金额（第一笔）",
  "定金总额",
  "购房款/首付款（第二笔）",
  "购房款/首付款（第一笔）",
  "购房款总额",
  "户口迁出证明",
  "首付款总金额",
  "尾款总金额",
  "尾款金额（剩）",
];

type MetricKind = "amount" | "share" | "yoy";

const METRIC_KINDS: MetricKind[] = ["amount", "share", "yoy"];

type PivotRow = {
  cohort: string;
  tier: string;
  showCohort: boolean;
  cohortRowSpan: number;
};

function seed(...keys: (string | number)[]): number {
  let h = 2166136261;
  for (const k of keys) {
    const s = String(k);
    for (let i = 0; i < s.length; i++) {
      h = Math.imul(h ^ s.charCodeAt(i), 16777619);
    }
  }
  return ((h >>> 0) % 100000) / 100000;
}

function isHighValueField(field: string): boolean {
  return /总金额|购房款|成交价|尾款/.test(field);
}

function cellAmount(cohort: string, tier: string, field: string): string {
  const s = seed(cohort, tier, field, "amount");
  let v = 200 + s * 4800;
  if (isHighValueField(field)) v *= 1.5 + s * 0.5;
  v = Math.round(v / 100) * 100;
  return v.toLocaleString("zh-CN");
}

function cellShare(cohort: string, tier: string, field: string): string {
  const s = seed(cohort, tier, field, "share");
  return `${(s * 24 + 1).toFixed(1)}%`;
}

function cellYoy(cohort: string, tier: string, field: string): { text: string; value: number } {
  const s = seed(cohort, tier, field, "yoy");
  const value = (s - 0.4) * 60;
  const sign = value > 0 ? "+" : "";
  return { text: `${sign}${value.toFixed(1)}%`, value };
}

function cellValue(
  cohort: string,
  tier: string,
  field: string,
  metric: MetricKind,
): { display: string; yoyValue?: number } {
  if (metric === "amount") return { display: cellAmount(cohort, tier, field) };
  if (metric === "share") return { display: cellShare(cohort, tier, field) };
  const yoy = cellYoy(cohort, tier, field);
  return { display: yoy.text, yoyValue: yoy.value };
}

function orderedSelectedFields(selected: Set<string>): string[] {
  return [
    ...PENDING_FIELDS.filter((f) => selected.has(f)),
    ...YOY_FIELDS.filter((f) => selected.has(f)),
  ];
}

function buildPivotRows(cohorts: Set<string>, tiers: Set<string>): PivotRow[] {
  const cohortList = SEVEN_COHORT_OPTIONS.filter((c) => cohorts.has(c));
  const tierList = CUST_TIER_OPTIONS.filter((t) => tiers.has(t));
  const rows: PivotRow[] = [];
  for (const cohort of cohortList) {
    tierList.forEach((tier, i) => {
      rows.push({
        cohort,
        tier,
        showCohort: i === 0,
        cohortRowSpan: tierList.length,
      });
    });
  }
  return rows;
}

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

function CheckIcon() {
  return (
    <svg
      aria-hidden
      viewBox="0 0 12 12"
      className="h-3 w-3 shrink-0"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <path d="M2.5 6.5l2.5 2.5 4.5-5" />
    </svg>
  );
}

function PlayIcon() {
  return (
    <svg aria-hidden viewBox="0 0 14 14" className="h-3 w-3 shrink-0" fill="currentColor">
      <path d="M3 2.5l8 4.5-8 4.5V2.5z" />
    </svg>
  );
}

function SearchIcon() {
  return (
    <svg
      aria-hidden
      viewBox="0 0 16 16"
      className="h-3.5 w-3.5 shrink-0"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.6"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <circle cx="7" cy="7" r="4.5" />
      <path d="M13 13l-2.5-2.5" />
    </svg>
  );
}

function StepBadge({ n }: { n: number }) {
  return (
    <span
      aria-hidden
      className="inline-flex h-5 w-5 shrink-0 items-center justify-center rounded text-[11px] font-semibold tabular-nums"
      style={{ background: TOKEN.primarySoftRing, color: TOKEN.primary }}
    >
      {n}
    </span>
  );
}

function TinyButton({
  children,
  onClick,
  ariaLabel,
}: {
  children: React.ReactNode;
  onClick: () => void;
  ariaLabel?: string;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      aria-label={ariaLabel}
      className="rounded px-1.5 py-0.5 text-[11px] transition-colors hover:bg-[#EFF6FF] hover:text-[#1E40AF] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#1E40AF]/30"
      style={{ color: TOKEN.textMuted }}
    >
      {children}
    </button>
  );
}

function DimensionChipGroup({
  label,
  options,
  selected,
  onChange,
}: {
  label: string;
  options: readonly string[];
  selected: Set<string>;
  onChange: (next: Set<string>) => void;
}) {
  const toggle = (opt: string) => {
    const next = new Set(selected);
    if (next.has(opt)) {
      next.delete(opt);
      if (next.size === 0) {
        onChange(new Set(options));
        return;
      }
    } else {
      next.add(opt);
    }
    onChange(next);
  };

  return (
    <fieldset className="min-w-0 border-0 p-0">
      <div className="mb-1.5 flex items-center justify-between gap-1">
        <legend className="text-[12px] font-semibold" style={{ color: TOKEN.text }}>
          {label}
        </legend>
        <div className="flex items-center gap-0.5">
          <span
            className="rounded px-1.5 py-0.5 text-[10px] font-medium tabular-nums"
            style={{
              background: selected.size === options.length ? TOKEN.primarySoft : TOKEN.surfaceAlt,
              color: selected.size === options.length ? TOKEN.primary : TOKEN.textMuted,
            }}
          >
            {selected.size}/{options.length}
          </span>
          <TinyButton onClick={() => onChange(new Set(options))} ariaLabel={`${label}全选`}>
            全选
          </TinyButton>
          <TinyButton
            onClick={() => onChange(new Set([options[0]!]))}
            ariaLabel={`${label}重置`}
          >
            重置
          </TinyButton>
        </div>
      </div>
      <div className="flex flex-wrap gap-1" role="group" aria-label={label}>
        {options.map((opt) => {
          const active = selected.has(opt);
          return (
            <button
              key={opt}
              type="button"
              aria-pressed={active}
              onClick={() => toggle(opt)}
              className="inline-flex shrink-0 cursor-pointer items-center rounded-md border px-2 py-[3px] text-[11px] leading-tight transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#1E40AF]/35"
              style={{
                borderColor: active ? TOKEN.primary : TOKEN.border,
                background: active ? TOKEN.primary : TOKEN.card,
                color: active ? "#FFFFFF" : TOKEN.text,
                fontWeight: active ? 500 : 400,
              }}
            >
              {opt}
            </button>
          );
        })}
      </div>
    </fieldset>
  );
}

function DimensionPanel({
  cohorts,
  setCohorts,
  tiers,
  setTiers,
}: {
  cohorts: Set<string>;
  setCohorts: (s: Set<string>) => void;
  tiers: Set<string>;
  setTiers: (s: Set<string>) => void;
}) {
  return (
    <section
      className="flex min-w-0 flex-col rounded-lg border"
      style={{ borderColor: TOKEN.border, background: TOKEN.card }}
    >
      <div
        className="flex items-center gap-2 rounded-t-lg border-b px-3 py-2"
        style={{ borderColor: TOKEN.border, background: TOKEN.surfaceAlt }}
      >
        <StepBadge n={0} />
        <h3 className="text-[13px] font-semibold" style={{ color: TOKEN.text }}>
          维度选取
        </h3>
        <span className="ml-auto text-[10px]" style={{ color: TOKEN.textDim }}>
          可多选
        </span>
      </div>
      <div className="flex flex-col gap-3 p-3">
        <DimensionChipGroup
          label="七大客群"
          options={SEVEN_COHORT_OPTIONS}
          selected={cohorts}
          onChange={setCohorts}
        />
        <div className="h-px" style={{ background: TOKEN.border }} />
        <DimensionChipGroup
          label="客户分层"
          options={CUST_TIER_OPTIONS}
          selected={tiers}
          onChange={setTiers}
        />
      </div>
    </section>
  );
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
      <span
        aria-hidden
        className="inline-flex h-3 w-3 shrink-0 items-center justify-center rounded-sm border"
        style={{
          borderColor: selected ? TOKEN.primary : TOKEN.borderStrong,
          background: selected ? TOKEN.primary : "#FFFFFF",
          color: "#FFFFFF",
        }}
      >
        {selected ? <CheckIcon /> : null}
      </span>
      <span>{label}</span>
    </button>
  );
}

function IndicatorPanel({
  step,
  title,
  tabs,
  selected,
  onChange,
  defaultCollapsed = false,
}: {
  step: number;
  title: string;
  tabs: readonly string[];
  selected: Set<string>;
  onChange: (next: Set<string>) => void;
  defaultCollapsed?: boolean;
}) {
  const [collapsed, setCollapsed] = useState(defaultCollapsed);
  const [activeTab, setActiveTab] = useState(0);
  const [query, setQuery] = useState("");

  const activeTabLabel = tabs[activeTab] ?? tabs[0] ?? "";
  const tabFields = useMemo(() => getTabFields(activeTabLabel), [activeTabLabel]);

  const selectedCount = useMemo(
    () => tabFields.filter((f) => selected.has(f)).length,
    [tabFields, selected],
  );
  const totalCount = tabFields.length;

  const filteredFields = useMemo(() => {
    if (!query.trim()) return tabFields;
    const q = query.trim();
    return tabFields.filter((f) => f.includes(q));
  }, [query, tabFields]);

  const toggleField = (label: string) => {
    const next = new Set(selected);
    if (next.has(label)) next.delete(label);
    else next.add(label);
    onChange(next);
  };

  const selectAllInTab = () => {
    const next = new Set(selected);
    for (const f of tabFields) next.add(f);
    onChange(next);
  };

  const invertInTab = () => {
    const next = new Set(selected);
    for (const f of tabFields) {
      if (next.has(f)) next.delete(f);
      else next.add(f);
    }
    onChange(next);
  };

  const clearInTab = () => {
    const next = new Set(selected);
    for (const f of tabFields) next.delete(f);
    onChange(next);
  };

  return (
    <section
      className="flex min-w-0 flex-col rounded-lg border"
      style={{ borderColor: TOKEN.border, background: TOKEN.card }}
    >
      <button
        type="button"
        aria-expanded={!collapsed}
        onClick={() => setCollapsed((c) => !c)}
        className="flex w-full items-center gap-2 rounded-t-lg border-b px-3 py-2 text-left transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-inset focus-visible:ring-[#1E40AF]/30"
        style={{ borderColor: TOKEN.border, background: TOKEN.surfaceAlt, color: TOKEN.text }}
      >
        <StepBadge n={step} />
        <h3 className="text-[13px] font-semibold">{title}</h3>
        <span
          className="ml-1 rounded px-1.5 py-0.5 text-[10px] font-medium tabular-nums"
          style={{
            background: selectedCount === totalCount ? TOKEN.primarySoft : "#FFFFFF",
            color: selectedCount === totalCount ? TOKEN.primary : TOKEN.textMuted,
            border: `1px solid ${TOKEN.border}`,
          }}
        >
          {selectedCount}/{totalCount}
        </span>
        {collapsed ? (
          <span className="ml-1 min-w-0 flex-1 truncate text-[11px]" style={{ color: TOKEN.textDim }}>
            点击展开 · 当前 Tab「{activeTabLabel}」
          </span>
        ) : (
          <span className="flex-1" />
        )}

        <ChevronIcon expanded={!collapsed} />
      </button>

      {!collapsed ? (
        <div className="flex flex-col gap-2.5 px-3 py-2.5">
          <div className="flex items-center gap-2">
            <div
              className="relative flex w-[180px] shrink-0 items-center gap-1.5 rounded-md border px-2"
              style={{ borderColor: TOKEN.border, background: "#FFFFFF" }}
            >
              <span style={{ color: TOKEN.textDim }}>
                <SearchIcon />
              </span>
              <input
                type="text"
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                placeholder="搜索字段"
                className="min-w-0 flex-1 bg-transparent py-1.5 text-[12px] outline-none placeholder:text-[#94A3B8]"
                style={{ color: TOKEN.text }}
              />
            </div>
            <div
              className="flex min-w-0 flex-1 items-center gap-x-3 overflow-x-auto whitespace-nowrap text-[12px] [scrollbar-width:none] [&::-webkit-scrollbar]:hidden"
              role="tablist"
            >
              {tabs.map((tab, idx) => (
                <button
                  key={tab}
                  type="button"
                  role="tab"
                  aria-selected={idx === activeTab}
                  onClick={() => setActiveTab(idx)}
                  className="relative shrink-0 cursor-pointer pb-1 transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#1E40AF]/30"
                  style={{
                    color: idx === activeTab ? TOKEN.primary : TOKEN.textMuted,
                    fontWeight: idx === activeTab ? 600 : 400,
                  }}
                >
                  {tab}
                  {idx === activeTab ? (
                    <span
                      aria-hidden
                      className="absolute inset-x-0 -bottom-[3px] h-[2px] rounded-full"
                      style={{ background: TOKEN.primary }}
                    />
                  ) : null}
                </button>
              ))}
            </div>
          </div>

          <div className="h-px" style={{ background: TOKEN.border }} />

          <div className="flex items-center gap-1 text-[11px]" style={{ color: TOKEN.textMuted }}>
            <span style={{ color: TOKEN.text }}>
              字段
              <span className="ml-1 tabular-nums" style={{ color: TOKEN.textDim }}>
                ({totalCount} 个 · 已选 {selectedCount})
              </span>
            </span>
            <span className="mx-1" style={{ color: TOKEN.border }}>
              |
            </span>
            <TinyButton onClick={selectAllInTab}>全选</TinyButton>
            <TinyButton onClick={invertInTab}>反选</TinyButton>
            <TinyButton onClick={clearInTab}>清空</TinyButton>
          </div>

          <div
            className="flex flex-wrap content-start gap-1.5 overflow-y-auto pr-1 [scrollbar-width:thin]"
            style={{ maxHeight: 132 }}
          >
            {filteredFields.length === 0 ? (
              <p className="px-1 py-2 text-[11px]" style={{ color: TOKEN.textDim }}>
                未匹配到字段
              </p>
            ) : (
              filteredFields.map((label) => (
                <FieldChip
                  key={`${step}-${label}`}
                  label={label}
                  selected={selected.has(label)}
                  onToggle={() => toggleField(label)}
                />
              ))
            )}
          </div>
        </div>
      ) : null}
    </section>
  );
}

function SummaryChip({
  label,
  value,
  tone = "neutral",
}: {
  label: string;
  value: string | number;
  tone?: "neutral" | "primary" | "accent";
}) {
  const tones = {
    neutral: { bg: TOKEN.surfaceAlt, border: TOKEN.border, color: TOKEN.text, labelColor: TOKEN.textDim },
    primary: { bg: TOKEN.primarySoft, border: TOKEN.primarySoftRing, color: TOKEN.primary, labelColor: TOKEN.primary },
    accent: { bg: "#FFFBEB", border: "#FDE68A", color: TOKEN.accent, labelColor: TOKEN.accent },
  } as const;
  const t = tones[tone];
  return (
    <span
      className="inline-flex items-center gap-1 rounded-md border px-1.5 py-0.5 text-[11px] leading-tight tabular-nums"
      style={{ background: t.bg, borderColor: t.border, color: t.color }}
    >
      <span style={{ color: t.labelColor }}>{label}</span>
      <span className="font-medium">{value}</span>
    </span>
  );
}

function QueryHeader({
  cohortCount,
  tierCount,
  l1Count,
  l2Count,
  effectiveFieldCount,
  onReset,
}: {
  cohortCount: number;
  tierCount: number;
  l1Count: number;
  l2Count: number;
  effectiveFieldCount: number;
  onReset: () => void;
}) {
  return (
    <div
      className="sticky top-0 z-10 flex items-center justify-between gap-3 rounded-md border px-3 py-2"
      style={{
        borderColor: TOKEN.border,
        background: `linear-gradient(180deg, #FFFFFF 0%, ${TOKEN.surface} 100%)`,
      }}
    >
      <div className="flex min-w-0 flex-wrap items-center gap-1.5">
        <span
          className="rounded px-1.5 py-0.5 text-[10px] font-semibold uppercase tracking-wide"
          style={{ background: TOKEN.primary, color: "#FFFFFF" }}
        >
          QUERY
        </span>
        <span className="text-[12px]" style={{ color: TOKEN.textMuted }}>
          自助拼装维度与指标，实时生成交叉表
        </span>
        <span className="mx-1" style={{ color: TOKEN.border }}>
          |
        </span>
        <SummaryChip
          label="七大客群"
          value={`${cohortCount}/${SEVEN_COHORT_OPTIONS.length}`}
          tone="primary"
        />
        <SummaryChip
          label="客户分层"
          value={`${tierCount}/${CUST_TIER_OPTIONS.length}`}
          tone="primary"
        />
        <SummaryChip label="一层指标" value={l1Count} />
        <SummaryChip label="二层指标" value={l2Count} />
        <SummaryChip label="生效字段" value={effectiveFieldCount} tone="primary" />
      </div>
      <div className="flex shrink-0 items-center gap-2">
        <button
          type="button"
          onClick={onReset}
          className="cursor-pointer rounded-md border px-2.5 py-1.5 text-[12px] transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#1E40AF]/30"
          style={{ borderColor: TOKEN.border, background: "#FFFFFF", color: TOKEN.textMuted }}
        >
          重置
        </button>
        <button
          type="button"
          className="cursor-pointer rounded-md border px-2.5 py-1.5 text-[12px] transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#1E40AF]/30"
          style={{ borderColor: TOKEN.border, background: "#FFFFFF", color: TOKEN.textMuted }}
        >
          另存为视图
        </button>
        <button
          type="button"
          className="inline-flex cursor-pointer items-center gap-1 rounded-md px-3 py-1.5 text-[12px] font-medium text-white shadow-sm transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#1E40AF]/40"
          style={{ background: TOKEN.primary }}
        >
          <PlayIcon />
          查询
        </button>
      </div>
    </div>
  );
}

function ResultPivotTable({
  cohorts,
  tiers,
  l1Fields,
  l2Fields,
}: {
  cohorts: Set<string>;
  tiers: Set<string>;
  l1Fields: Set<string>;
  l2Fields: Set<string>;
}) {
  const fields = useMemo(() => {
    const shared = PENDING_FIELDS.filter((f) => l1Fields.has(f) && l2Fields.has(f));
    const yoyOnly = YOY_FIELDS.filter((f) => l2Fields.has(f));
    return [...shared, ...yoyOnly];
  }, [l1Fields, l2Fields]);

  const rows = useMemo(() => buildPivotRows(cohorts, tiers), [cohorts, tiers]);

  const rowCount = rows.length;
  const colCount = 2 + fields.length * 3;
  const isEmpty =
    rowCount === 0 || fields.length === 0 || cohorts.size === 0 || tiers.size === 0;

  return (
    <section
      className="overflow-hidden rounded-lg border"
      style={{ borderColor: TOKEN.border, background: TOKEN.card }}
    >
      <div
        className="flex items-center justify-between gap-2 border-b px-3 py-2"
        style={{ borderColor: TOKEN.border, background: TOKEN.surfaceAlt }}
      >
        <div className="flex items-center gap-2">
          <h3 className="text-[13px] font-semibold" style={{ color: TOKEN.text }}>
            结果预览
          </h3>
          <SummaryChip label="行" value={rowCount} />
          <SummaryChip label="列" value={colCount} />
          <span className="text-[11px]" style={{ color: TOKEN.textDim }}>
            客群 × 分层 × 指标 · 演示数据
          </span>
        </div>
        <div className="flex items-center gap-1">
          <TinyButton onClick={() => undefined}>导出 CSV</TinyButton>
          <TinyButton onClick={() => undefined}>复制</TinyButton>
        </div>
      </div>
      <div className="overflow-x-auto [scrollbar-width:thin]">
        <table className="w-full min-w-max border-collapse text-[12px]" style={{ color: TOKEN.text }}>
          <thead>
            <tr style={{ borderBottom: `1px solid ${TOKEN.border}`, background: TOKEN.surfaceAlt }}>
              <th
                rowSpan={2}
                className="sticky left-0 z-[2] px-3 py-1.5 text-left text-[11px] font-semibold"
                style={{ background: TOKEN.surfaceAlt, minWidth: 108 }}
              >
                七大客群
              </th>
              <th
                rowSpan={2}
                className="sticky z-[2] px-3 py-1.5 text-left text-[11px] font-semibold"
                style={{
                  left: 108,
                  background: TOKEN.surfaceAlt,
                  minWidth: 72,
                  boxShadow: `1px 0 0 ${TOKEN.border}`,
                }}
              >
                客户分层
              </th>
              {fields.map((field) => (
                <th
                  key={field}
                  colSpan={3}
                  className="px-2 py-1.5 text-center text-[11px] font-semibold"
                  style={{ color: TOKEN.text, borderLeft: `1px solid ${TOKEN.border}` }}
                >
                  {field}
                </th>
              ))}
            </tr>
            <tr style={{ borderBottom: `1px solid ${TOKEN.border}`, background: TOKEN.surfaceAlt }}>
              {fields.map((field) =>
                (["金额(万)", "占比", "同环比"] as const).map((label, mi) => (
                  <th
                    key={`${field}-${label}`}
                    className="px-2 py-1 text-right text-[10px] font-medium"
                    style={{
                      color: TOKEN.textDim,
                      borderLeft: mi === 0 ? `1px solid ${TOKEN.border}` : undefined,
                    }}
                  >
                    {label}
                  </th>
                )),
              )}
            </tr>
          </thead>
          <tbody>
            {isEmpty ? (
              <tr>
                <td
                  colSpan={Math.max(colCount, 2)}
                  className="px-4 py-10 text-center text-[12px]"
                  style={{ color: TOKEN.textDim }}
                >
                  请在左侧勾选客群与分层，并至少在一层或二层指标中选择一个字段后查看结果
                </td>
              </tr>
            ) : (
              rows.map((row) => (
                <tr
                  key={`${row.cohort}-${row.tier}`}
                  className="transition-colors hover:bg-[#EFF6FF]"
                  style={{ borderBottom: `1px solid ${TOKEN.border}` }}
                >
                  {row.showCohort ? (
                    <td
                      rowSpan={row.cohortRowSpan}
                      className="sticky left-0 z-[1] px-3 py-1.5 align-middle text-left text-[11px] font-semibold"
                      style={{
                        background: TOKEN.surface,
                        color: TOKEN.text,
                        minWidth: 108,
                        borderRight: `1px solid ${TOKEN.border}`,
                      }}
                    >
                      {row.cohort}
                    </td>
                  ) : null}
                  <td
                    className="sticky z-[1] px-3 py-1.5 text-left text-[11px]"
                    style={{
                      left: 108,
                      background: "#FFFFFF",
                      color: TOKEN.textMuted,
                      minWidth: 72,
                      boxShadow: `1px 0 0 ${TOKEN.border}`,
                    }}
                  >
                    {row.tier}
                  </td>
                  {fields.map((field) =>
                    METRIC_KINDS.map((metric) => {
                      const { display, yoyValue } = cellValue(
                        row.cohort,
                        row.tier,
                        field,
                        metric,
                      );
                      let color: string = TOKEN.text;
                      if (metric === "yoy" && yoyValue !== undefined) {
                        if (yoyValue > 0.05) color = TOKEN.positive;
                        else if (yoyValue < -0.05) color = TOKEN.negative;
                        else color = TOKEN.textDim;
                      }
                      return (
                        <td
                          key={`${field}-${metric}`}
                          className="px-2 py-1.5 text-right tabular-nums"
                          style={{
                            color,
                            borderLeft:
                              metric === "amount" ? `1px solid ${TOKEN.border}` : undefined,
                          }}
                        >
                          {display}
                        </td>
                      );
                    }),
                  )}
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </section>
  );
}

export function SelfServiceQueryBoardCard({ w: _w, hint }: { w: CanvasWidget; hint?: string }) {
  const [cohorts, setCohorts] = useState<Set<string>>(() => new Set(SEVEN_COHORT_OPTIONS));
  const [tiers, setTiers] = useState<Set<string>>(() => new Set(CUST_TIER_OPTIONS));
  const [l1Fields, setL1Fields] = useState<Set<string>>(() => new Set(PENDING_FIELDS));
  const [l2Fields, setL2Fields] = useState<Set<string>>(
    () => new Set<string>([...PENDING_FIELDS, ...YOY_FIELDS]),
  );

  const handleReset = () => {
    setCohorts(new Set(SEVEN_COHORT_OPTIONS));
    setTiers(new Set(CUST_TIER_OPTIONS));
    setL1Fields(new Set(PENDING_FIELDS));
    setL2Fields(new Set<string>([...PENDING_FIELDS, ...YOY_FIELDS]));
  };

  const effectiveFieldCount = useMemo(() => {
    const sharedCount = PENDING_FIELDS.filter(
      (f) => l1Fields.has(f) && l2Fields.has(f),
    ).length;
    const yoyCount = YOY_FIELDS.filter((f) => l2Fields.has(f)).length;
    return sharedCount + yoyCount;
  }, [l1Fields, l2Fields]);

  return (
    <div
      className="flex flex-col gap-3 p-4 font-['Inter',sans-serif]"
      style={{ background: TOKEN.surface }}
    >
      {hint ? (
        <div className="-mb-1 text-[10px]" style={{ color: TOKEN.textDim }}>
          {hint}
        </div>
      ) : null}

      <QueryHeader
        cohortCount={cohorts.size}
        tierCount={tiers.size}
        l1Count={l1Fields.size}
        l2Count={l2Fields.size}
        effectiveFieldCount={effectiveFieldCount}
        onReset={handleReset}
      />

      <div
        className="grid gap-3"
        style={{ gridTemplateColumns: "minmax(260px, 280px) minmax(0, 1fr)" }}
      >
        <DimensionPanel
          cohorts={cohorts}
          setCohorts={setCohorts}
          tiers={tiers}
          setTiers={setTiers}
        />
        <div className="flex min-w-0 flex-col gap-3">
          <IndicatorPanel
            step={1}
            title="一层指标选取"
            tabs={LEVEL1_TABS}
            selected={l1Fields}
            onChange={setL1Fields}
          />
          <IndicatorPanel
            step={2}
            title="二层指标选取"
            tabs={LEVEL2_TABS}
            selected={l2Fields}
            onChange={setL2Fields}
            defaultCollapsed
          />
        </div>
      </div>

      <ResultPivotTable cohorts={cohorts} tiers={tiers} l1Fields={l1Fields} l2Fields={l2Fields} />
    </div>
  );
}
