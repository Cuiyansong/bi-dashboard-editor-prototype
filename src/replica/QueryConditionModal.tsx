import { useMemo, useState } from "react";

export type QueryConditionModalProps = {
  open: boolean;
  datasetName: string;
  chartTitles: string[];
  onClose: () => void;
  onConfirm?: () => void;
};

export function QueryConditionModal({ open, datasetName, chartTitles, onClose, onConfirm }: QueryConditionModalProps) {
  const [selected, setSelected] = useState<Record<string, boolean>>(() =>
    Object.fromEntries(chartTitles.map((t) => [t, true])),
  );

  const allOn = useMemo(() => chartTitles.length > 0 && chartTitles.every((t) => selected[t]), [chartTitles, selected]);

  if (!open) return null;

  const toggleAll = () => {
    const next = !allOn;
    setSelected(Object.fromEntries(chartTitles.map((t) => [t, next])));
  };

  const toggleOne = (t: string) => {
    setSelected((s) => ({ ...s, [t]: !s[t] }));
  };

  return (
    <div
      className="fixed inset-0 z-[60] flex items-center justify-center bg-black/40 p-4"
      role="dialog"
      aria-modal="true"
      aria-labelledby="qc-modal-title"
    >
      <div className="flex max-h-[90vh] w-full max-w-2xl flex-col overflow-hidden rounded-lg bg-white shadow-xl">
        <div className="flex items-center justify-between border-b border-black/[0.08] px-4 py-3">
          <div className="flex min-w-0 flex-wrap items-center gap-2 text-sm font-semibold text-figma-text">
            <span id="qc-modal-title">查询条件设置</span>
            <span className="text-xs font-normal text-figma-sub">
              数据集 <span className="text-figma-text">▣</span> {datasetName}
            </span>
          </div>
          <button type="button" className="shrink-0 rounded p-1 text-figma-sub hover:bg-black/[0.05]" onClick={onClose} aria-label="关闭">
            ✕
          </button>
        </div>

        <div className="min-h-0 flex-1 overflow-y-auto px-4 py-3 text-xs">
          <div className="mb-3 font-medium text-figma-text">选择关联图表</div>
          <div className="mb-2 flex flex-wrap items-center justify-between gap-2 text-[11px] text-figma-sub">
            <span>同数据集</span>
            <input
              type="search"
              placeholder="请输入图表名"
              className="w-40 rounded border border-figma-line px-2 py-1 text-xs outline-none focus:border-primary"
            />
          </div>
          <div className="flex flex-wrap gap-3 rounded border border-black/[0.06] bg-neutral-50/80 px-3 py-3">
            <label className="flex cursor-pointer items-center gap-1.5">
              <input type="checkbox" checked={allOn} onChange={toggleAll} />
              <span>全选</span>
            </label>
            {chartTitles.map((t) => (
              <label key={t} className="flex cursor-pointer items-center gap-1.5">
                <input type="checkbox" checked={!!selected[t]} onChange={() => toggleOne(t)} />
                <span className="max-w-[180px] truncate">{t}</span>
              </label>
            ))}
          </div>

          <div className="mt-5 font-medium text-figma-text">设置筛选条件</div>
          <div className="mt-2 flex items-start gap-2">
            <select className="rounded border border-figma-line bg-white px-2 py-1.5 text-xs" defaultValue="and">
              <option value="and">且</option>
              <option value="or">或</option>
            </select>
            <div className="min-w-0 flex-1 space-y-2 rounded border border-dashed border-figma-line bg-canvas/60 px-3 py-3">
              <div className="flex flex-wrap items-center gap-2">
                <span className="text-figma-sub">筛选字段</span>
                <select className="rounded border border-figma-line bg-white px-2 py-1 text-[11px]">
                  <option>请选择字段</option>
                </select>
                <span className="text-figma-sub">字段名称</span>
                <input type="text" placeholder="请输入" className="min-w-[100px] flex-1 rounded border border-figma-line px-2 py-1 text-[11px]" />
                <button type="button" className="text-figma-sub hover:text-red-600" title="删除">
                  🗑
                </button>
              </div>
              <div className="flex flex-wrap gap-2">
                <button type="button" className="rounded bg-primary px-2 py-1 text-[11px] font-medium text-white hover:opacity-95">
                  + 添加条件
                </button>
                <button type="button" className="rounded border border-primary bg-white px-2 py-1 text-[11px] font-medium text-primary hover:bg-figma-azure-8">
                  + 添加关系
                </button>
              </div>
            </div>
          </div>
        </div>

        <div className="border-t border-black/[0.06] bg-neutral-50/90 px-4 py-2 text-[11px] text-figma-sub">
          <span className="text-primary">💡</span> Tips: 复合查询控件仅对PC端生效，移动端不显示。
        </div>

        <div className="flex justify-end gap-2 border-t border-black/[0.06] px-4 py-3">
          <button type="button" className="rounded border border-figma-line bg-white px-4 py-2 text-xs font-medium text-figma-text hover:bg-neutral-50" onClick={onClose}>
            取消
          </button>
          <button
            type="button"
            className="rounded bg-primary px-4 py-2 text-xs font-medium text-white hover:opacity-95"
            onClick={() => {
              onConfirm?.();
              onClose();
            }}
          >
            确定
          </button>
        </div>
      </div>
    </div>
  );
}
