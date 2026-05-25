import { useEffect, useState } from "react";
import {
  NUMERIC_OPERATORS,
  STRING_OPERATORS,
  defaultOperatorForType,
  inferFieldValueType,
  isRangeOperator,
  newFilterId,
  type FieldFilterCondition,
  type FieldFilterOperator,
  type FieldValueType,
  type FilterSource,
} from "../model/queryFieldFilters";

export type FieldFilterModalTarget = {
  fieldLabel: string;
  source: FilterSource;
  valueType?: FieldValueType;
  existing?: FieldFilterCondition;
};

export type FieldFilterConfigModalProps = {
  open: boolean;
  target: FieldFilterModalTarget | null;
  onClose: () => void;
  onConfirm: (condition: FieldFilterCondition) => void;
};

const inputCls =
  "h-8 rounded border border-[#D1D5DB] px-2 text-[12px] outline-none focus:border-[#1E40AF] focus:ring-1 focus:ring-[#1E40AF]/30";

export function FieldFilterConfigModal({
  open,
  target,
  onClose,
  onConfirm,
}: FieldFilterConfigModalProps) {
  const valueType = target?.valueType ?? (target ? inferFieldValueType(target.fieldLabel) : "string");
  const [operator, setOperator] = useState<FieldFilterOperator>(defaultOperatorForType(valueType));
  const [value, setValue] = useState("");
  const [valueEnd, setValueEnd] = useState("");

  useEffect(() => {
    if (!open || !target) return;
    const vt = target.valueType ?? inferFieldValueType(target.fieldLabel);
    if (target.existing) {
      setOperator(target.existing.operator);
      setValue(target.existing.value ?? "");
      setValueEnd(target.existing.valueEnd ?? "");
    } else {
      setOperator(defaultOperatorForType(vt));
      setValue("");
      setValueEnd("");
    }
  }, [open, target]);

  if (!open || !target) return null;

  const showRange = isRangeOperator(operator);
  const hideValue = valueType === "string" && operator === "empty";

  const handleConfirm = () => {
    onConfirm({
      id: target.existing?.id ?? newFilterId(),
      fieldLabel: target.fieldLabel,
      source: target.source,
      valueType,
      operator,
      value: hideValue ? undefined : value || undefined,
      valueEnd: showRange ? valueEnd || undefined : undefined,
    });
    onClose();
  };

  return (
    <div
      className="fixed inset-0 z-[70] flex items-center justify-center bg-black/40 p-4"
      role="dialog"
      aria-modal="true"
      aria-labelledby="field-filter-modal-title"
      onClick={onClose}
    >
      <div
        className="w-full max-w-md rounded-lg bg-white shadow-xl"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex items-center justify-between border-b border-[#E5E7EB] px-4 py-3">
          <h2 id="field-filter-modal-title" className="text-sm font-semibold text-[#0F172A]">
            筛选值设置
            <span className="ml-0.5 text-red-500">*</span>
          </h2>
          <button
            type="button"
            className="rounded p-1 text-[#64748B] hover:bg-black/[0.05]"
            onClick={onClose}
            aria-label="关闭"
          >
            ✕
          </button>
        </div>

        <div className="space-y-3 px-4 py-4">
          <p className="text-[12px] text-[#64748B]">字段：{target.fieldLabel}</p>
          {valueType === "date" ? (
            <div className="flex flex-wrap items-center gap-2">
              <input type="date" value={value} onChange={(e) => setValue(e.target.value)} className={inputCls} />
              <span className="text-[#9CA3AF]">-</span>
              <input type="date" value={valueEnd} onChange={(e) => setValueEnd(e.target.value)} className={inputCls} />
            </div>
          ) : (
            <div className="flex flex-wrap items-center gap-2">
              <select
                value={operator}
                onChange={(e) => setOperator(e.target.value as FieldFilterOperator)}
                className={inputCls}
              >
                {(valueType === "number" ? NUMERIC_OPERATORS : STRING_OPERATORS).map((op) => (
                  <option key={op.id} value={op.id}>
                    {op.label}
                  </option>
                ))}
              </select>
              {!hideValue ? (
                <>
                  <input
                    type="text"
                    value={value}
                    onChange={(e) => setValue(e.target.value)}
                    placeholder="请输入"
                    className={`min-w-[100px] flex-1 ${inputCls}`}
                  />
                  {showRange ? (
                    <>
                      <span className="text-[#9CA3AF]">-</span>
                      <input
                        type="text"
                        value={valueEnd}
                        onChange={(e) => setValueEnd(e.target.value)}
                        placeholder="请输入"
                        className={`min-w-[100px] flex-1 ${inputCls}`}
                      />
                    </>
                  ) : null}
                </>
              ) : null}
            </div>
          )}
        </div>

        <div className="flex justify-end gap-2 border-t border-[#E5E7EB] px-4 py-3">
          <button type="button" onClick={onClose} className="rounded border border-[#D1D5DB] bg-white px-4 py-2 text-xs font-medium text-[#374151] hover:bg-[#F9FAFB]">取消</button>
          <button type="button" onClick={handleConfirm} className="rounded bg-[#1E40AF] px-4 py-2 text-xs font-medium text-white hover:bg-[#1D4ED8]">确定</button>
        </div>
      </div>
    </div>
  );
}
