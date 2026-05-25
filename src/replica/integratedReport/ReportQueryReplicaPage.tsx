import { useMemo, useState } from "react";
import { POST_EVAL_INDICATOR_FIELDS } from "../postEvaluationQueryConfig";
import { PlatformWatermark } from "./PlatformWatermark";
import {
  POST_EVAL_PAGE_SIZE,
  POST_EVAL_REPORT_ROWS,
  POST_EVAL_TOTAL_ROWS,
  type PostEvaluationReportRow,
} from "./mockPostEvaluationReportData";
type ReportQueryReplicaPageProps = {
  reportTitle: string;
  /** 报表配置-新增 等场景下的面包屑前缀 */
  breadcrumb?: string;
};

function formatCell(v: number | null): string {
  if (v === null || Number.isNaN(v)) return "-";
  return v.toLocaleString("zh-CN", { minimumFractionDigits: 0, maximumFractionDigits: 2 });
}

export function ReportQueryReplicaPage({ reportTitle, breadcrumb }: ReportQueryReplicaPageProps) {
  const [dateFrom, setDateFrom] = useState("2026-04-28");
  const [dateTo, setDateTo] = useState("2026-04-28");
  const [page, setPage] = useState(1);

  const totalPages = Math.ceil(POST_EVAL_TOTAL_ROWS / POST_EVAL_PAGE_SIZE);
  const rows = useMemo(() => {
    const start = (page - 1) * POST_EVAL_PAGE_SIZE;
    if (start >= POST_EVAL_REPORT_ROWS.length) {
      return POST_EVAL_REPORT_ROWS.slice(0, Math.min(12, POST_EVAL_REPORT_ROWS.length));
    }
    return POST_EVAL_REPORT_ROWS.slice(start, start + POST_EVAL_PAGE_SIZE);
  }, [page]);

  return (
    <div className="flex h-full min-h-0 flex-col bg-white">
      {breadcrumb ? (
        <div className="shrink-0 border-b border-[#E5E7EB] bg-[#FAFAFA] px-4 py-2 text-[12px] text-[#6B7280]">
          {breadcrumb}
        </div>
      ) : null}

      <div className="flex shrink-0 items-center gap-2 border-b border-[#E5E7EB] px-4 py-2">
        <span className="rounded-t border border-b-0 border-[#D1D5DB] bg-white px-3 py-1 text-[12px] font-medium text-[#2563EB]">
          {reportTitle}
        </span>
      </div>

      <div className="flex shrink-0 flex-wrap items-center gap-3 border-b border-[#E5E7EB] px-4 py-3">
        <span className="text-[12px] text-[#374151]">日期</span>
        <input
          type="date"
          value={dateFrom}
          onChange={(e) => setDateFrom(e.target.value)}
          className="h-8 rounded border border-[#D1D5DB] px-2 text-[12px]"
        />
        <span className="text-[#9CA3AF]">→</span>
        <input
          type="date"
          value={dateTo}
          onChange={(e) => setDateTo(e.target.value)}
          className="h-8 rounded border border-[#D1D5DB] px-2 text-[12px]"
        />
        <div className="flex-1" />
        <button
          type="button"
          className="rounded bg-[#2563EB] px-5 py-1.5 text-[12px] font-medium text-white hover:bg-[#1D4ED8]"
        >
          查询
        </button>
      </div>

      <div className="relative min-h-0 flex-1 overflow-auto">
        <PlatformWatermark />
        <table className="w-full min-w-max border-collapse text-[12px] text-[#374151]">
          <thead className="sticky top-0 z-[1] bg-[#F9FAFB]">
            <tr className="border-b border-[#E5E7EB]">
              <th className="px-4 py-2 text-left font-medium text-[#6B7280]">客户号</th>
              {POST_EVAL_INDICATOR_FIELDS.map((f) => (
                <th key={f} className="px-4 py-2 text-right font-medium text-[#6B7280]">
                  {f}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {rows.map((row: PostEvaluationReportRow) => (
              <tr key={row.customerId} className="border-b border-[#F3F4F6] hover:bg-[#F9FAFB]">
                <td className="px-4 py-2 tabular-nums">{row.customerId}</td>
                {POST_EVAL_INDICATOR_FIELDS.map((f) => (
                  <td key={f} className="px-4 py-2 text-right tabular-nums">
                    {formatCell(row.values[f])}
                  </td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <div className="flex shrink-0 items-center justify-end gap-3 border-t border-[#E5E7EB] px-4 py-2 text-[12px] text-[#6B7280]">
        <span>总计 {POST_EVAL_TOTAL_ROWS} 条</span>
        <div className="flex items-center gap-1">
          <PagerBtn disabled={page <= 1} onClick={() => setPage((p) => p - 1)}>
            ‹
          </PagerBtn>
          {Array.from({ length: Math.min(5, totalPages) }, (_, i) => i + 1).map((p) => (
            <PagerBtn key={p} active={p === page} onClick={() => setPage(p)}>
              {p}
            </PagerBtn>
          ))}
          {totalPages > 5 ? <span className="px-1">…</span> : null}
          {totalPages > 5 ? (
            <PagerBtn active={page === totalPages} onClick={() => setPage(totalPages)}>
              {totalPages}
            </PagerBtn>
          ) : null}
          <PagerBtn disabled={page >= totalPages} onClick={() => setPage((p) => p + 1)}>
            ›
          </PagerBtn>
        </div>
      </div>
    </div>
  );
}

function PagerBtn({
  children,
  active,
  disabled,
  onClick,
}: {
  children: React.ReactNode;
  active?: boolean;
  disabled?: boolean;
  onClick?: () => void;
}) {
  return (
    <button
      type="button"
      disabled={disabled}
      onClick={onClick}
      className={`min-w-[28px] rounded border px-1.5 py-0.5 ${
        active
          ? "border-[#2563EB] bg-[#EFF6FF] text-[#2563EB]"
          : "border-[#E5E7EB] bg-white hover:bg-[#F9FAFB]"
      } ${disabled ? "cursor-not-allowed opacity-40" : ""}`}
    >
      {children}
    </button>
  );
}
