import { useCallback, useEffect, useId, useRef, useState, type ReactNode, type RefObject } from "react";
import { CUSTOMER_FILTER_DEFS, type CustomerFilterState } from "../model/customerFilters";
import { MultiSelectChipGroup } from "./MultiSelectChipGroup";

export type FilterPopoverProps = {
  values: CustomerFilterState;
  onChange: (filterId: keyof CustomerFilterState, value: string[]) => void;
  trigger: (props: {
    open: boolean;
    panelId: string;
    onToggle: () => void;
    triggerRef: RefObject<HTMLButtonElement | null>;
  }) => ReactNode;
};

export function FilterPopoverPanel({
  values,
  onChange,
  panelId,
}: {
  values: CustomerFilterState;
  onChange: FilterPopoverProps["onChange"];
  panelId: string;
}) {
  return (
    <div
      id={panelId}
      role="dialog"
      aria-label="筛选条件"
      className="w-[min(100vw-2rem,360px)] rounded-lg border border-figma-line bg-white p-3 shadow-lg"
      onClick={(e) => e.stopPropagation()}
    >
      <div className="flex flex-col gap-4">
        {CUSTOMER_FILTER_DEFS.map((f) => (
          <fieldset key={f.id} className="min-w-0 border-0 p-0">
            <legend className="mb-1.5 font-['Inter',sans-serif] text-xs font-medium text-figma-text">{f.label}</legend>
            <MultiSelectChipGroup
              label={f.label}
              options={f.options}
              selected={values[f.id] ?? [...f.options]}
              onChange={(next) => onChange(f.id, next)}
              size="compact"
              hideLabel
            />
          </fieldset>
        ))}
      </div>
    </div>
  );
}

export function FilterPopover({ values, onChange, trigger }: FilterPopoverProps) {
  const [open, setOpen] = useState(false);
  const rootRef = useRef<HTMLDivElement>(null);
  const triggerRef = useRef<HTMLButtonElement>(null);
  const panelRef = useRef<HTMLDivElement>(null);
  const panelId = useId();

  const close = useCallback(() => setOpen(false), []);

  useEffect(() => {
    if (!open) return;
    const onDocMouse = (e: MouseEvent) => {
      if (!rootRef.current?.contains(e.target as Node)) close();
    };
    const onDocKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        e.preventDefault();
        close();
        triggerRef.current?.focus();
      }
    };
    document.addEventListener("mousedown", onDocMouse);
    document.addEventListener("keydown", onDocKey);
    const t = window.setTimeout(() => {
      panelRef.current?.querySelector<HTMLElement>("button, input")?.focus();
    }, 0);
    return () => {
      document.removeEventListener("mousedown", onDocMouse);
      document.removeEventListener("keydown", onDocKey);
      window.clearTimeout(t);
    };
  }, [open, close]);

  const onToggle = () => setOpen((v) => !v);

  return (
    <div ref={rootRef} className="relative inline-flex min-w-0">
      {trigger({ open, panelId, onToggle, triggerRef })}
      {open ? (
        <div
          ref={panelRef}
          className="absolute left-0 top-full z-50 mt-1"
          style={{ overscrollBehavior: "contain" }}
        >
          <FilterPopoverPanel values={values} onChange={onChange} panelId={panelId} />
        </div>
      ) : null}
    </div>
  );
}
