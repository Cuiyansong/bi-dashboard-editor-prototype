import { useEffect, useMemo, useState } from "react";
import type { TemplateDatasetDef } from "../model/templateDatasets";
import type { FieldRef } from "../model/fieldRef";

export type SourceFieldRow = {
  id: string;
  kind: "dimension" | "measure";
  key: string;
  label: string;
};

function sourceRowsFromDataset(ds: TemplateDatasetDef): SourceFieldRow[] {
  const dims = ds.dimensions.map((d) => ({
    id: `dimension:${d.key}`,
    kind: "dimension" as const,
    key: d.key,
    label: d.label,
  }));
  const ms = ds.measures.map((m) => ({
    id: `measure:${m.key}`,
    kind: "measure" as const,
    key: m.key,
    label: m.label,
  }));
  return [...dims, ...ms];
}

function targetOptionsForKind(ds: TemplateDatasetDef, kind: "dimension" | "measure"): { key: string; label: string }[] {
  return kind === "dimension"
    ? ds.dimensions.map((d) => ({ key: d.key, label: d.label }))
    : ds.measures.map((m) => ({ key: m.key, label: m.label }));
}

function rowLabelPrefix(kind: "dimension" | "measure") {
  return kind === "dimension" ? "Str." : "№";
}

export type GlobalDatasetReplaceModalProps = {
  open: boolean;
  onClose: () => void;
  sourceDataset: TemplateDatasetDef;
  allDatasets: TemplateDatasetDef[];
  usedCount: number;
  onConfirm: (targetTemplateId: string, fieldMap: Record<string, string>) => void;
};

export function GlobalDatasetReplaceModal({
  open,
  onClose,
  sourceDataset,
  allDatasets,
  usedCount,
  onConfirm,
}: GlobalDatasetReplaceModalProps) {
  const sourceRows = useMemo(() => sourceRowsFromDataset(sourceDataset), [sourceDataset]);

  const [targetId, setTargetId] = useState(sourceDataset.templateId);
  const [fieldMap, setFieldMap] = useState<Record<string, string>>({});
  const [search, setSearch] = useState("");

  const targetDs = useMemo(() => allDatasets.find((d) => d.templateId === targetId) ?? sourceDataset, [allDatasets, targetId, sourceDataset]);

  useEffect(() => {
    if (!open) return;
    setTargetId(sourceDataset.templateId);
    setSearch("");
  }, [open, sourceDataset.templateId]);

  useEffect(() => {
    if (!open) return;
    const tgt = allDatasets.find((d) => d.templateId === targetId);
    if (!tgt) return;
    const next: Record<string, string> = {};
    for (const row of sourceRowsFromDataset(sourceDataset)) {
      const opts = row.kind === "dimension" ? tgt.dimensions : tgt.measures;
      const hit = opts.find((o) => o.key === row.key);
      next[row.id] = hit ? hit.key : opts[0]?.key ?? row.key;
    }
    setFieldMap(next);
  }, [open, sourceDataset, targetId, allDatasets]);

  const filteredRows = useMemo(() => {
    const q = search.trim().toLowerCase();
    if (!q) return sourceRows;
    return sourceRows.filter((r) => `${r.label} ${r.key}`.toLowerCase().includes(q));
  }, [search, sourceRows]);

  const matched = useMemo(() => sourceRows.filter((r) => !!fieldMap[r.id]).length, [fieldMap, sourceRows]);

  if (!open) return null;

  const onApply = () => {
    onConfirm(targetId, fieldMap);
  };

  return (
    <div className="fixed inset-0 z-[55] flex items-center justify-center bg-black/40 p-4" role="dialog" aria-modal="true">
      <div className="flex max-h-[90vh] w-full max-w-2xl flex-col overflow-hidden rounded-lg bg-white shadow-xl">
        <div className="flex shrink-0 items-center justify-between border-b border-black/[0.08] px-4 py-3">
          <span className="text-sm font-semibold text-figma-text">全局数据集替换</span>
          <button type="button" className="rounded p-1 text-figma-sub hover:bg-black/[0.05] hover:text-figma-text" onClick={onClose} aria-label="关闭">
            ✕
          </button>
        </div>

        <div className="min-h-0 flex-1 overflow-y-auto px-4 py-4">
          <div className="flex flex-wrap items-end gap-3 sm:flex-nowrap">
            <div className="min-w-0 flex-1">
              <div className="mb-1.5 text-[11px] text-figma-sub">已使用数据集：{usedCount}</div>
              <div className="flex items-center gap-2 rounded-lg border border-neutral-200 bg-neutral-50 px-3 py-2.5">
                <span className="text-lg leading-none text-violet-600" aria-hidden>
                  ▣
                </span>
                <div className="min-w-0 flex-1">
                  <div className="truncate text-xs font-medium text-figma-text">{sourceDataset.datasetName}</div>
                  <div className="mt-0.5 flex items-center gap-1 text-[10px] text-figma-sub">
                    <span>📊</span>
                    <span>{usedCount}</span>
                  </div>
                </div>
              </div>
            </div>
            <div className="hidden shrink-0 items-center pb-6 sm:flex" aria-hidden>
              <div className="h-px w-10 border-t border-dashed border-neutral-300" />
            </div>
            <div className="w-full min-w-0 flex-1 sm:max-w-[280px]">
              <div className="mb-1.5 text-[11px] text-figma-sub">替换至数据集</div>
              <div className="relative">
                <span className="pointer-events-none absolute left-2.5 top-1/2 text-lg text-violet-600 -translate-y-1/2">▣</span>
                <select
                  value={targetId}
                  onChange={(e) => setTargetId(e.target.value)}
                  className="w-full appearance-none rounded-lg border border-neutral-200 bg-white py-2.5 pl-9 pr-8 text-xs font-medium text-figma-text outline-none focus:border-primary"
                >
                  {allDatasets.map((d) => (
                    <option key={d.templateId} value={d.templateId}>
                      {d.datasetName}
                    </option>
                  ))}
                </select>
                <span className="pointer-events-none absolute right-2.5 top-1/2 text-[10px] text-figma-sub -translate-y-1/2">▾</span>
              </div>
            </div>
          </div>

          <div className="mt-4 overflow-hidden rounded-lg border border-black/[0.08] bg-white">
            <div className="flex items-center justify-between border-b border-black/[0.06] px-3 py-2">
              <div className="relative pb-0.5">
                <span className="text-xs font-semibold text-primary">数据集字段</span>
                <div className="absolute -bottom-px left-0 right-0 h-0.5 bg-primary" />
              </div>
              <button type="button" className="text-figma-sub hover:text-figma-text" title="刷新" aria-label="刷新">
                ↻
              </button>
            </div>
            <div className="flex flex-wrap items-center justify-between gap-2 border-b border-black/[0.05] bg-neutral-50/80 px-3 py-2 text-[11px]">
              <span className="text-figma-sub">已使用字段：{sourceRows.length}</span>
              <span className="font-medium text-emerald-700">
                已匹配：{matched}/{sourceRows.length}
              </span>
            </div>
            <div className="border-b border-black/[0.05] px-3 py-2">
              <div className="relative">
                <span className="pointer-events-none absolute left-2.5 top-1/2 text-figma-sub -translate-y-1/2">🔍</span>
                <input
                  type="search"
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                  placeholder="输入关键字搜索"
                  className="w-full rounded-md border border-neutral-200 bg-white py-1.5 pl-8 pr-2 text-xs outline-none focus:border-primary"
                />
              </div>
            </div>
            <div className="max-h-[min(40vh,320px)] overflow-y-auto px-3 py-3">
              <div className="space-y-3">
                {filteredRows.map((row) => {
                  const opts = targetOptionsForKind(targetDs, row.kind);
                  const val = fieldMap[row.id] ?? opts[0]?.key ?? "";
                  const shell =
                    row.kind === "dimension"
                      ? "border-blue-400/70 bg-sky-50 text-blue-950"
                      : "border-emerald-500/70 bg-emerald-50 text-emerald-950";
                  return (
                    <div key={row.id} className="flex flex-wrap items-center gap-2 sm:flex-nowrap">
                      <div
                        className={`flex min-w-0 flex-1 items-center gap-1.5 rounded-md border px-2 py-1.5 font-mono text-[11px] font-medium ${shell}`}
                      >
                        <span className="shrink-0 opacity-80">{rowLabelPrefix(row.kind)}</span>
                        <span className="truncate">{row.label}</span>
                      </div>
                      <div className="hidden h-px w-6 shrink-0 border-t border-dashed border-neutral-300 sm:block" aria-hidden />
                      <div className="w-full min-w-0 sm:w-[200px] sm:flex-none">
                        <select
                          value={val}
                          onChange={(e) => setFieldMap((m) => ({ ...m, [row.id]: e.target.value }))}
                          className="w-full rounded-md border border-neutral-200 bg-white py-1.5 pl-2 pr-7 text-[11px] outline-none focus:border-primary"
                        >
                          {opts.map((o) => (
                            <option key={o.key} value={o.key}>
                              {rowLabelPrefix(row.kind)} {o.label}
                            </option>
                          ))}
                        </select>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          </div>
        </div>

        <div className="flex shrink-0 flex-col gap-3 border-t border-black/[0.06] bg-neutral-50/50 px-4 py-3 sm:flex-row sm:items-center sm:justify-between">
          <div className="flex items-start gap-2 text-[11px] text-figma-sub">
            <span className="shrink-0 opacity-70">ⓘ</span>
            <span>如果要对组件进行数据集替换，请前往组件的数据面板操作。</span>
          </div>
          <div className="flex justify-end gap-2">
            <button
              type="button"
              onClick={onClose}
              className="rounded-md border border-neutral-300 bg-white px-4 py-2 text-xs font-medium text-figma-text hover:bg-neutral-50"
            >
              取消
            </button>
            <button type="button" onClick={onApply} className="rounded-md bg-primary px-4 py-2 text-xs font-medium text-white hover:opacity-95">
              确定
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

export function remapFieldRefWithMap(f: FieldRef, target: TemplateDatasetDef, fieldMap: Record<string, string>): FieldRef {
  const sid = `${f.kind}:${f.key}`;
  const tKey = fieldMap[sid];
  if (!tKey) return f;
  if (f.kind === "dimension") {
    const d = target.dimensions.find((x) => x.key === tKey);
    if (d) return { kind: "dimension", key: d.key, label: d.label, semantic: d.semantic };
  } else {
    const m = target.measures.find((x) => x.key === tKey);
    if (m) return { kind: "measure", key: m.key, label: m.label, semantic: "number" };
  }
  return f;
}
