import { useRef } from "react";
import {
  createEmptyCustomerIdUpload,
  mockParseCustomerIdExcel,
  POST_EVAL_CUSTOMER_IDS,
  type CustomerIdUploadState,
} from "./postEvaluationQueryConfig";

const TOKEN = {
  primary: "#1E40AF",
  primarySoft: "#EFF6FF",
  surfaceAlt: "#F1F5F9",
  card: "#FFFFFF",
  border: "#E2E8F0",
  text: "#0F172A",
  textMuted: "#64748B",
  textDim: "#94A3B8",
};

function ExcelFileIcon() {
  return (
    <svg viewBox="0 0 24 24" className="h-8 w-8 shrink-0" aria-hidden>
      <rect x="4" y="2" width="16" height="20" rx="2" fill="#DCFCE7" stroke="#16A34A" strokeWidth="1.2" />
      <path d="M8 7h8M8 11h8M8 15h5" stroke="#16A34A" strokeWidth="1.2" strokeLinecap="round" />
      <text x="12" y="19" textAnchor="middle" fill="#16A34A" fontSize="5" fontWeight="700">
        XLS
      </text>
    </svg>
  );
}

export type CustomerIdExcelUploadPanelProps = {
  value: CustomerIdUploadState;
  onChange: (next: CustomerIdUploadState) => void;
};

export function CustomerIdExcelUploadPanel({ value, onChange }: CustomerIdExcelUploadPanelProps) {
  const inputRef = useRef<HTMLInputElement>(null);
  const uploaded = value.fileName != null;
  const previewIds = POST_EVAL_CUSTOMER_IDS.slice(0, 3);

  const openFilePicker = () => inputRef.current?.click();

  const handleFile = (file: File | undefined) => {
    if (!file) return;
    const lower = file.name.toLowerCase();
    if (!lower.endsWith(".xlsx") && !lower.endsWith(".xls")) return;
    onChange(mockParseCustomerIdExcel(file));
  };

  return (
    <section
      className="flex h-full min-w-0 flex-col rounded-lg border"
      style={{ borderColor: TOKEN.border, background: TOKEN.card }}
    >
      <div
        className="flex items-center gap-2 rounded-t-lg border-b px-3 py-2"
        style={{ borderColor: TOKEN.border, background: TOKEN.surfaceAlt }}
      >
        <span
          className="rounded px-1.5 py-0.5 text-[10px] font-medium tabular-nums"
          style={{
            background: uploaded ? TOKEN.primarySoft : TOKEN.surfaceAlt,
            color: uploaded ? TOKEN.primary : TOKEN.textMuted,
            border: `1px solid ${TOKEN.border}`,
          }}
        >
          {uploaded ? `${value.rowCount} 条` : "未上传"}
        </span>
        <h3 className="text-[13px] font-semibold" style={{ color: TOKEN.text }}>
          客户号导入
        </h3>
      </div>

      <div className="flex flex-col gap-3 p-3">
        <input
          ref={inputRef}
          type="file"
          accept=".xlsx,.xls,application/vnd.ms-excel,application/vnd.openxmlformats-officedocument.spreadsheetml.sheet"
          className="hidden"
          onChange={(e) => {
            handleFile(e.target.files?.[0]);
            e.target.value = "";
          }}
        />

        {uploaded ? (
          <div
            className="rounded-lg border p-3"
            style={{ borderColor: TOKEN.border, background: TOKEN.surfaceAlt }}
          >
            <div className="flex items-start gap-3">
              <ExcelFileIcon />
              <div className="min-w-0 flex-1">
                <p className="truncate text-[12px] font-medium" style={{ color: TOKEN.text }}>
                  {value.fileName}
                </p>
                <p className="mt-0.5 text-[11px]" style={{ color: TOKEN.textMuted }}>
                  共 {value.rowCount.toLocaleString("zh-CN")} 条客户号
                </p>
                <p className="mt-2 text-[10px] leading-relaxed" style={{ color: TOKEN.textDim }}>
                  预览：{previewIds.join("、")} … 等 {value.rowCount.toLocaleString("zh-CN")} 条
                </p>
              </div>
            </div>
            <div className="mt-3 flex flex-wrap gap-2 border-t pt-3" style={{ borderColor: TOKEN.border }}>
              <button
                type="button"
                onClick={() => onChange(createEmptyCustomerIdUpload())}
                className="rounded-md border px-2.5 py-1 text-[11px] transition-colors hover:bg-white"
                style={{ borderColor: TOKEN.border, color: TOKEN.textMuted }}
              >
                删除
              </button>
              <button
                type="button"
                onClick={openFilePicker}
                className="rounded-md border px-2.5 py-1 text-[11px] font-medium transition-colors hover:bg-white"
                style={{ borderColor: TOKEN.primary, color: TOKEN.primary, background: TOKEN.primarySoft }}
              >
                重新上传
              </button>
            </div>
          </div>
        ) : (
          <button
            type="button"
            onClick={openFilePicker}
            className="flex w-full flex-col items-center justify-center rounded-lg border border-dashed px-4 py-8 text-center transition-colors hover:border-[#93C5FD] hover:bg-[#EFF6FF]/50"
            style={{ borderColor: TOKEN.border, background: TOKEN.card }}
          >
            <ExcelFileIcon />
            <p className="mt-3 text-[12px] font-medium" style={{ color: TOKEN.text }}>
              点击或拖拽上传 Excel
            </p>
            <p className="mt-1 text-[11px]" style={{ color: TOKEN.textDim }}>
              支持 .xlsx / .xls，需包含「客户号」列
            </p>
          </button>
        )}

        <p className="text-[10px] leading-relaxed" style={{ color: TOKEN.textDim }}>
          客户号数量较多，请通过 Excel 批量导入，不支持在界面逐条勾选。
        </p>
      </div>
    </section>
  );
}
