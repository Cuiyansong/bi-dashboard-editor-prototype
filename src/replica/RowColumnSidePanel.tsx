import { useState, type ReactNode } from "react";
import { FilterableChip } from "./FilterableChip";
import { hasFilterForField, type FieldFilterCondition } from "../model/queryFieldFilters";

const TOKEN = {
  border: "#E2E8F0",
  card: "#FFFFFF",
  surfaceAlt: "#F1F5F9",
  text: "#0F172A",
  textDim: "#64748B",
  primary: "#1E40AF",
} as const;

export const ROW_COLUMN_PANEL_HEIGHT_CLASS =
  "h-[calc(100dvh-120px)] max-h-[calc(100dvh-120px)]";

const SCROLL_BODY_CLASS = "min-h-0 flex-1 overflow-y-auto [scrollbar-width:thin]";

type PanelExpandMode = "split" | "row" | "column";

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

function TinyButton({
  children,
  onClick,
  ariaLabel,
}: {
  children: ReactNode;
  onClick: () => void;
  ariaLabel?: string;
}) {
  return (
    <button
      type="button"
      onClick={(e) => {
        e.stopPropagation();
        onClick();
      }}
      aria-label={ariaLabel}
      className="shrink-0 rounded px-1.5 py-0.5 text-[11px] transition-colors hover:bg-[#EFF6FF] hover:text-[#1E40AF] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#1E40AF]/30"
      style={{ color: TOKEN.textDim }}
    >
      {children}
    </button>
  );
}

function CollapsibleSection({
  sectionId,
  badge,
  title,
  summary,
  expanded,
  onToggle,
  headerAction,
  sectionClassName,
  bodyClassName,
  children,
}: {
  sectionId: string;
  badge: string;
  title: string;
  summary: string;
  expanded: boolean;
  onToggle: () => void;
  headerAction?: ReactNode;
  sectionClassName?: string;
  bodyClassName?: string;
  children: ReactNode;
}) {
  const bodyId = `${sectionId}-body`;
  const shellClass = sectionClassName ?? (expanded ? "min-h-0 flex-1" : "shrink-0");
  const scrollClass = bodyClassName ?? SCROLL_BODY_CLASS;

  return (
    <div className={`flex min-h-0 flex-col ${shellClass}`}>
      <div
        className="flex shrink-0 items-center gap-1.5 border-b px-3 py-2"
        style={{ borderColor: TOKEN.border, background: TOKEN.surfaceAlt, color: TOKEN.text }}
      >
        <button
          type="button"
          aria-expanded={expanded}
          aria-controls={bodyId}
          onClick={onToggle}
          className="flex min-w-0 flex-1 cursor-pointer items-center gap-2 text-left transition-colors hover:opacity-80 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-inset focus-visible:ring-[#1E40AF]/30"
        >
          <span
            className="flex h-5 w-5 shrink-0 items-center justify-center rounded-full text-[10px] font-bold text-white"
            style={{ background: TOKEN.primary }}
          >
            {badge}
          </span>
          <h3 className="shrink-0 text-[13px] font-semibold">{title}</h3>
          {headerAction ? <div className="shrink-0">{headerAction}</div> : null}
          <span className="ml-auto max-w-[32%] truncate text-[10px]" style={{ color: TOKEN.textDim }}>
            {summary}
          </span>
          <ChevronIcon expanded={expanded} />
        </button>
      </div>
      {expanded ? (
        <div id={bodyId} className={scrollClass}>
          {children}
        </div>
      ) : null}
    </div>
  );
}

export type RowColumnSidePanelProps = {
  rowContent: ReactNode;
  rowSummary?: string;
  columnOptions: readonly string[];
  columnSelected: Set<string>;
  onColumnChange: (next: Set<string>) => void;
  filterable?: boolean;
  fieldFilters?: FieldFilterCondition[];
  onOpenColumnFilter?: (fieldLabel: string) => void;
};

export function RowColumnSidePanel({
  rowContent,
  rowSummary,
  columnOptions,
  columnSelected,
  onColumnChange,
  filterable = true,
  fieldFilters = [],
  onOpenColumnFilter,
}: RowColumnSidePanelProps) {
  const [mode, setMode] = useState<PanelExpandMode>("split");
  const [rowCollapsed, setRowCollapsed] = useState(false);
  const [columnCollapsed, setColumnCollapsed] = useState(false);

  const toggleColumnChip = (opt: string) => {
    const next = new Set(columnSelected);
    if (next.has(opt)) {
      next.delete(opt);
      if (next.size === 0) onColumnChange(new Set(columnOptions));
      else onColumnChange(next);
    } else {
      next.add(opt);
      onColumnChange(next);
    }
  };

  const restoreSplit = () => {
    setMode("split");
    setRowCollapsed(false);
    setColumnCollapsed(false);
  };

  const rowBodyVisible = mode === "row" || (mode === "split" && !rowCollapsed);
  const columnBodyVisible = mode === "column" || (mode === "split" && !columnCollapsed);

  const toggleRow = () => {
    if (mode === "row") {
      restoreSplit();
      return;
    }
    if (mode === "column") {
      setMode("row");
      setRowCollapsed(false);
      setColumnCollapsed(false);
      return;
    }
    setRowCollapsed((v) => !v);
  };

  const toggleColumnSection = () => {
    if (mode === "column") {
      restoreSplit();
      return;
    }
    if (mode === "row") {
      setMode("column");
      setRowCollapsed(false);
      setColumnCollapsed(false);
      return;
    }
    setColumnCollapsed((v) => !v);
  };

  const columnSummary = `${columnSelected.size}/${columnOptions.length}`;
  const rowHeaderSummary = rowBodyVisible ? "可多选" : rowSummary || "已收起";

  const sectionGrowClass = (bodyVisible: boolean, otherBodyVisible: boolean) => {
    if (!bodyVisible) return "shrink-0";
    if (otherBodyVisible) return "min-h-0 flex-1";
    return "min-h-0 flex-1";
  };

  const rowSectionClass = sectionGrowClass(rowBodyVisible, columnBodyVisible);
  const columnSectionClass = sectionGrowClass(columnBodyVisible, rowBodyVisible);

  const rowHeaderAction =
    mode === "row" ? (
      <TinyButton onClick={restoreSplit} ariaLabel="恢复行/列分屏显示">
        恢复分屏
      </TinyButton>
    ) : (
      <TinyButton
        onClick={() => {
          setMode("row");
          setRowCollapsed(false);
        }}
        ariaLabel="展开全部行维度并收起列指标"
      >
        展开全部
      </TinyButton>
    );

  const columnHeaderAction =
    mode === "column" ? (
      <TinyButton onClick={restoreSplit} ariaLabel="恢复行/列分屏显示">
        恢复分屏
      </TinyButton>
    ) : (
      <TinyButton
        onClick={() => {
          setMode("column");
          setColumnCollapsed(false);
        }}
        ariaLabel="展开全部列指标并收起行维度"
      >
        展开全部
      </TinyButton>
    );

  return (
    <section
      className={`flex ${ROW_COLUMN_PANEL_HEIGHT_CLASS} min-h-0 min-w-0 flex-col overflow-hidden rounded-lg border`}
      style={{ borderColor: TOKEN.border, background: TOKEN.card }}
    >
      <CollapsibleSection
        sectionId="row-column-row"
        badge="行"
        title="行维度"
        summary={rowHeaderSummary}
        expanded={rowBodyVisible}
        onToggle={toggleRow}
        headerAction={rowHeaderAction}
        sectionClassName={rowSectionClass}
      >
        <div className="p-3">{rowContent}</div>
      </CollapsibleSection>

      <div className="h-px shrink-0" style={{ background: TOKEN.border }} />

      <CollapsibleSection
        sectionId="row-column-col"
        badge="列"
        title="列指标"
        summary={columnSummary}
        expanded={columnBodyVisible}
        onToggle={toggleColumnSection}
        headerAction={columnHeaderAction}
        sectionClassName={columnSectionClass}
      >
        <div className="p-3 pt-0">
          <div className="mb-1.5 flex items-center gap-0.5">
            <TinyButton onClick={() => onColumnChange(new Set(columnOptions))} ariaLabel="列全选">
              全选
            </TinyButton>
            <TinyButton
              onClick={() => onColumnChange(new Set([columnOptions[0]!]))}
              ariaLabel="列重置"
            >
              重置
            </TinyButton>
          </div>
          <div className="flex flex-wrap gap-1">
            {columnOptions.map((opt) => {
              const active = columnSelected.has(opt);
              if (filterable && onOpenColumnFilter) {
                return (
                  <FilterableChip
                    key={opt}
                    label={opt}
                    selected={active}
                    onToggle={() => toggleColumnChip(opt)}
                    chipVariant="measure"
                    filterable
                    hasFilter={hasFilterForField(fieldFilters, opt)}
                    onOpenFilter={() => onOpenColumnFilter(opt)}
                  />
                );
              }
              return (
                <button
                  key={opt}
                  type="button"
                  aria-pressed={active}
                  onClick={() => toggleColumnChip(opt)}
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
        </div>
      </CollapsibleSection>
    </section>
  );
}
