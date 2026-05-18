import { useCallback, useEffect, useRef, useState } from "react";

const itemBase =
  "flex w-full items-center justify-between gap-3 px-3 py-2 text-left text-[12px] text-figma-text transition hover:bg-neutral-50";

function MenuSep() {
  return <div className="my-0.5 border-t border-neutral-100" role="separator" />;
}

export type WidgetCanvasMoreMenuProps = {
  widgetId: string;
  onDelete: (id: string) => void;
};

export function WidgetCanvasMoreMenu({ widgetId, onDelete }: WidgetCanvasMoreMenuProps) {
  const [open, setOpen] = useState(false);
  const rootRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    if (!open) return;
    const onDoc = (e: MouseEvent) => {
      if (!rootRef.current?.contains(e.target as Node)) setOpen(false);
    };
    document.addEventListener("mousedown", onDoc);
    return () => document.removeEventListener("mousedown", onDoc);
  }, [open]);

  const close = useCallback(() => setOpen(false), []);

  const onDeleteClick = useCallback(() => {
    onDelete(widgetId);
    close();
  }, [widgetId, onDelete, close]);

  return (
    <div className="relative shrink-0" ref={rootRef}>
      <button
        type="button"
        title="更多"
        aria-expanded={open}
        aria-haspopup="menu"
        onClick={(e) => {
          e.stopPropagation();
          setOpen((v) => !v);
        }}
        className="flex h-6 w-6 items-center justify-center rounded text-figma-sub hover:bg-black/[0.06] hover:text-figma-text"
      >
        <span className="select-none text-base leading-none">⋯</span>
      </button>
      {open ? (
        <div
          role="menu"
          className="absolute right-0 top-full z-[80] mt-0.5 min-w-[220px] overflow-hidden rounded-lg border border-black/[0.08] bg-white py-1 shadow-lg"
          onClick={(e) => e.stopPropagation()}
        >
          <button type="button" role="menuitem" className={itemBase} onClick={close}>
            <span>移动到</span>
            <span className="text-figma-sub">›</span>
          </button>
          <MenuSep />
          <button type="button" role="menuitem" className={itemBase} onClick={close}>
            <span>隐藏</span>
          </button>
          <button type="button" role="menuitem" className={itemBase} onClick={close}>
            <span>复制</span>
            <span className="font-['Inter',sans-serif] text-[11px] text-figma-sub">Ctrl C</span>
          </button>
          <button type="button" role="menuitem" className={itemBase} onClick={close}>
            <span>粘贴</span>
            <span className="font-['Inter',sans-serif] text-[11px] text-figma-sub">Ctrl V</span>
          </button>
          <MenuSep />
          <button type="button" role="menuitem" className={itemBase} onClick={close}>
            <span>插入查询条件</span>
          </button>
          <MenuSep />
          <button type="button" role="menuitem" className={itemBase} onClick={close}>
            <span>导出</span>
          </button>
          <button type="button" role="menuitem" disabled className={`${itemBase} cursor-not-allowed opacity-45 hover:bg-transparent`}>
            <span>区块嵌入</span>
          </button>
          <MenuSep />
          <button type="button" role="menuitem" className={`${itemBase} text-red-600 hover:bg-red-50`} onClick={onDeleteClick}>
            <span>删除</span>
            <span className="text-[11px] text-figma-sub">←</span>
          </button>
        </div>
      ) : null}
    </div>
  );
}
