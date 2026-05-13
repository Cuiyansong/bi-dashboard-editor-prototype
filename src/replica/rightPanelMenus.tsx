import { useEffect, useRef, useState, type ReactNode } from "react";
import type { CanvasWidget } from "../model/dashboardModel";
import type { TemplateDatasetDef } from "../model/templateDatasets";
import { figmaAssets } from "./figmaAssets";
import { LEFT_LIBRARY_CATALOG, type LeftLibraryItem } from "./leftLibraryCatalog";

const sprite = figmaAssets.leftSprite;

function MiniTableIcon({ className = "" }: { className?: string }) {
  return (
    <span className={`inline-grid shrink-0 grid-cols-2 gap-px rounded-sm border border-primary/40 bg-primary/10 p-0.5 ${className}`} aria-hidden>
      <span className="h-1.5 w-1.5 rounded-[1px] bg-primary" />
      <span className="h-1.5 w-1.5 rounded-[1px] bg-primary/70" />
      <span className="h-1.5 w-1.5 rounded-[1px] bg-primary/70" />
      <span className="h-1.5 w-1.5 rounded-[1px] bg-primary/40" />
    </span>
  );
}

function PanelSearchBar() {
  return (
    <div className="mb-2 flex items-center gap-2">
      <div className="relative min-w-0 flex-1">
        <span className="pointer-events-none absolute left-2 top-1/2 -translate-y-1/2 text-[11px] text-figma-sub">🔍</span>
        <input
          type="search"
          placeholder="搜索"
          className="w-full rounded-md border border-figma-line bg-white py-1.5 pl-7 pr-2 text-xs text-figma-text outline-none placeholder:text-figma-sub focus:border-primary focus:ring-1 focus:ring-primary/20"
        />
      </div>
      <button type="button" className="shrink-0 rounded p-1.5 text-figma-sub hover:bg-black/[0.04]" title="更多">
        ⋮
      </button>
    </div>
  );
}

function AccordionBlock({
  title,
  defaultOpen,
  children,
}: {
  title: string;
  defaultOpen?: boolean;
  children: ReactNode;
}) {
  const [open, setOpen] = useState(!!defaultOpen);
  return (
    <div className="border-b border-black/[0.06] last:border-b-0">
      <button
        type="button"
        onClick={() => setOpen((v) => !v)}
        className="flex w-full items-center gap-1 py-2 text-left text-xs font-medium text-figma-text"
      >
        <span className="w-3 shrink-0 text-center text-[10px] text-figma-sub">{open ? "▾" : "▸"}</span>
        {title}
      </button>
      {open && <div className="space-y-1.5 pb-3 pl-4">{children}</div>}
    </div>
  );
}

function SubSettingRow({ label, hint }: { label: string; hint?: ReactNode }) {
  return (
    <button
      type="button"
      className="flex w-full items-center gap-2 rounded-md bg-neutral-100 px-2 py-2 text-left text-xs text-figma-text transition hover:bg-neutral-200/80"
    >
      <span className="text-[10px] text-figma-sub">▸</span>
      <span className="flex min-w-0 flex-1 items-center gap-1.5">
        {label}
        {hint}
      </span>
    </button>
  );
}

export function StyleTabPanel() {
  return (
    <div className="text-xs">
      <PanelSearchBar />
      <AccordionBlock title="标题与卡片" defaultOpen>
        <SubSettingRow label="标题" />
        <SubSettingRow label="备注与尾注" />
        <SubSettingRow label="组件容器" />
      </AccordionBlock>
      <AccordionBlock title="表格基础样式">
        <p className="px-1 py-1 text-[11px] text-figma-sub">展开后配置占位</p>
      </AccordionBlock>
      <AccordionBlock title="单元格" />
      <AccordionBlock title="表头样式" />
      <AccordionBlock title="条件格式" />
      <AccordionBlock title="总计" />
      <AccordionBlock title="筛选" />
      <AccordionBlock title="辅助展示" />
    </div>
  );
}

export function AnalysisTabPanel() {
  return (
    <div className="text-xs">
      <PanelSearchBar />
      <AccordionBlock title="数据交互" defaultOpen>
        <SubSettingRow
          label="钻取"
          hint={
            <span
              className="inline-flex h-3.5 w-3.5 shrink-0 items-center justify-center rounded-full border border-figma-line text-[9px] font-medium text-figma-sub"
              title="说明"
            >
              i
            </span>
          }
        />
        <SubSettingRow label="联动" />
        <SubSettingRow label="跳转" />
      </AccordionBlock>
      <AccordionBlock title="高级设置" />
    </div>
  );
}

type ChartSwitchDropdownProps = {
  displayLabel: string;
  selected: CanvasWidget | null;
  onPick: (item: LeftLibraryItem) => void;
};

export function ChartSwitchDropdown({ displayLabel, selected, onPick }: ChartSwitchDropdownProps) {
  const [open, setOpen] = useState(false);
  const rootRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!open) return;
    const onDoc = (e: MouseEvent) => {
      if (!rootRef.current?.contains(e.target as Node)) setOpen(false);
    };
    document.addEventListener("mousedown", onDoc);
    return () => document.removeEventListener("mousedown", onDoc);
  }, [open]);

  const selectedLabel = selected?.libraryLabel;

  return (
    <div ref={rootRef} className="relative shrink-0 border-b border-black/[0.06] px-3 py-2">
      <div className="text-[10px] text-figma-sub">切换图表</div>
      <button
        type="button"
        onClick={() => setOpen((v) => !v)}
        className={`mt-1 flex w-full items-center justify-between gap-2 rounded border bg-white px-2 py-1.5 text-left text-xs text-figma-text transition ${
          open ? "border-primary ring-1 ring-primary/20" : "border-figma-line hover:border-neutral-300"
        }`}
        aria-expanded={open}
      >
        <span className="flex min-w-0 flex-1 items-center gap-2">
          <MiniTableIcon />
          <span className="truncate">{displayLabel}</span>
        </span>
        <span className="shrink-0 text-figma-sub">{open ? "▴" : "▾"}</span>
      </button>

      {open && (
        <div
          className="absolute left-2 right-2 top-full z-[90] mt-1 max-h-[min(72vh,520px)] overflow-hidden rounded-lg border border-figma-line bg-white shadow-xl"
          role="listbox"
        >
          <div className="flex items-center justify-between border-b border-black/[0.06] px-2 py-2">
            <div className="flex items-end gap-3 text-xs">
              <span className="border-b-2 border-primary pb-1 font-medium text-primary">官方</span>
            </div>
            <div className="flex items-center gap-0.5 text-figma-sub">
              <button type="button" className="rounded p-1 hover:bg-black/[0.05]" title="搜索">
                🔍
              </button>
              <button type="button" className="rounded p-1 hover:bg-black/[0.05]" title="筛选">
                ⛃
              </button>
            </div>
          </div>
          <div className="max-h-[min(64vh,460px)] overflow-y-auto overscroll-contain px-1 pb-2 pt-1">
            {LEFT_LIBRARY_CATALOG.map((sec) => (
              <div key={sec.title} className="mb-2">
                <div className="px-2 py-1.5 text-[10px] font-normal text-figma-sub">{sec.title}</div>
                <div className="grid grid-cols-4 justify-items-center gap-y-2 gap-x-0.5 px-1">
                  {sec.items.map((it) => {
                    const isSel = selectedLabel === it.label;
                    return (
                      <button
                        key={`${sec.title}-${it.label}`}
                        type="button"
                        onClick={() => {
                          onPick(it);
                          setOpen(false);
                        }}
                        className={`flex w-[52px] flex-col items-center gap-px rounded px-0.5 py-1 outline-none transition hover:bg-figma-azure-6 ${
                          isSel ? "bg-neutral-100 ring-1 ring-primary/35" : ""
                        }`}
                      >
                        <div className="relative size-[30px] shrink-0 overflow-hidden">
                          <img
                            alt=""
                            src={sprite}
                            draggable={false}
                            className={`pointer-events-none max-w-none select-none ${it.spriteClass}`}
                            style={{ WebkitUserDrag: "none" }}
                          />
                        </div>
                        <span className="max-w-[52px] text-center font-['Inter',sans-serif] text-[10.5px] leading-[17px] text-figma-text">
                          {it.label}
                        </span>
                      </button>
                    );
                  })}
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}

type DatasetSwitchPopoverProps = {
  dataset: TemplateDatasetDef;
  allDatasets: TemplateDatasetDef[];
  activeTemplateId: string;
  onSelectDataset: (templateId: string) => void;
};

export function DatasetSwitchPopover({ dataset, allDatasets, activeTemplateId, onSelectDataset }: DatasetSwitchPopoverProps) {
  const [open, setOpen] = useState(false);
  const rootRef = useRef<HTMLDivElement>(null);
  const [dsTab, setDsTab] = useState<"used" | "all">("used");

  useEffect(() => {
    if (!open) return;
    const onDoc = (e: MouseEvent) => {
      if (!rootRef.current?.contains(e.target as Node)) setOpen(false);
    };
    document.addEventListener("mousedown", onDoc);
    return () => document.removeEventListener("mousedown", onDoc);
  }, [open]);

  const list = dsTab === "all" ? allDatasets : allDatasets.filter((d) => d.templateId === activeTemplateId);

  return (
    <div ref={rootRef} className="relative shrink-0 border-b border-black/[0.06] px-3 py-2">
      <div className="text-xs font-semibold text-figma-text">数据</div>
      <button
        type="button"
        onClick={() => setOpen((v) => !v)}
        className={`mt-2 flex w-full items-center justify-between rounded border bg-white px-2 py-1.5 text-left text-xs text-figma-text ${
          open ? "border-primary ring-1 ring-primary/20" : "border-figma-line"
        }`}
        aria-expanded={open}
      >
        <span className="truncate">{dataset.datasetName}</span>
        <span className="shrink-0 text-figma-sub">{open ? "▴" : "▾"}</span>
      </button>

      {open && (
        <div className="absolute left-0 right-0 top-full z-[90] mt-1 overflow-hidden rounded-lg border border-black/[0.08] bg-white shadow-xl">
          <div className="flex items-center justify-between bg-primary px-3 py-2.5 text-xs font-medium text-white">
            <span className="truncate">{dataset.datasetName}</span>
            <span className="shrink-0 opacity-90">▴</span>
          </div>
          <div className="flex items-center justify-between border-b border-black/[0.06] px-2 py-2 text-xs">
            <div className="flex gap-3">
              <button
                type="button"
                onClick={() => setDsTab("used")}
                className={`border-b-2 pb-1 ${dsTab === "used" ? "border-primary font-medium text-primary" : "border-transparent text-figma-sub"}`}
              >
                已使用 1
              </button>
              <button
                type="button"
                onClick={() => setDsTab("all")}
                className={`border-b-2 pb-1 ${dsTab === "all" ? "border-primary font-medium text-primary" : "border-transparent text-figma-sub"}`}
              >
                全部
              </button>
            </div>
            <button type="button" className="text-primary hover:underline">
              多选
            </button>
          </div>
          <div className="max-h-48 overflow-y-auto">
            {(list.length ? list : allDatasets).map((d) => (
              <button
                key={d.templateId}
                type="button"
                onClick={() => {
                  onSelectDataset(d.templateId);
                  setOpen(false);
                }}
                className={`flex w-full items-center gap-2 px-3 py-2.5 text-left text-xs transition hover:bg-neutral-50 ${
                  d.templateId === activeTemplateId ? "bg-blue-50/70" : ""
                }`}
              >
                <span className="text-sm text-figma-sub">▣</span>
                <span className="truncate text-figma-text">{d.datasetName}</span>
              </button>
            ))}
          </div>
          <div className="grid grid-cols-2 gap-px border-t border-black/[0.06] bg-black/[0.06]">
            <button type="button" className="bg-primary py-2.5 text-center text-[11px] font-medium text-white hover:opacity-95">
              上传本地文件
            </button>
            <button
              type="button"
              className="bg-white py-2.5 text-center text-[11px] font-medium text-figma-text hover:bg-neutral-50"
            >
              新建数据集
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
