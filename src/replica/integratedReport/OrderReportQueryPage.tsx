import { useState } from "react";
import {
  ORDER_REPORT_COLUMNS,
  ORDER_REPORT_ROWS,
  ORDER_REPORT_TOTAL,
  type OrderReportRow,
} from "./mockOrderReportData";
import { PlatformWatermark } from "./PlatformWatermark";

type OrderReportQueryPageProps = {
  reportTitle: string;
};

export function OrderReportQueryPage({ reportTitle }: OrderReportQueryPageProps) {
  const [usernameOp, setUsernameOp] = useState("包含");
  const [username, setUsername] = useState("");
  const [dateFrom, setDateFrom] = useState("");
  const [dateTo, setDateTo] = useState("");

  const handleReset = () => {
    setUsernameOp("包含");
    setUsername("");
    setDateFrom("");
    setDateTo("");
  };

  return (
    <div className="flex h-full min-h-0 flex-col bg-white">
      <div className="flex shrink-0 items-end gap-0 border-b border-[#E5E7EB] px-4 pt-2">
        <span className="rounded-t border border-b-0 border-[#D1D5DB] bg-white px-4 py-1.5 text-[13px] font-medium text-[#2563EB]">
          {reportTitle}
        </span>
      </div>

      <div className="flex shrink-0 flex-wrap items-center gap-4 border-b border-[#E5E7EB] px-4 py-3">
        <div className="flex items-center gap-2">
          <span className="text-[12px] text-[#374151]">用户名</span>
          <select
            value={usernameOp}
            onChange={(e) => setUsernameOp(e.target.value)}
            className="h-8 rounded border border-[#D1D5DB] bg-white px-2 text-[12px] text-[#374151]"
          >
            <option>包含</option>
            <option>等于</option>
            <option>开头是</option>
          </select>
          <input
            type="text"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            placeholder=""
            className="h-8 w-[160px] rounded border border-[#D1D5DB] px-2 text-[12px]"
          />
        </div>

        <div className="flex items-center gap-2">
          <span className="text-[12px] text-[#374151]">update_time</span>
          <div className="flex items-center gap-1">
            <input
              type="date"
              value={dateFrom}
              onChange={(e) => setDateFrom(e.target.value)}
              placeholder="开始日期"
              className="h-8 w-[130px] rounded border border-[#D1D5DB] px-2 text-[12px]"
            />
            <span className="text-[#9CA3AF]">-</span>
            <input
              type="date"
              value={dateTo}
              onChange={(e) => setDateTo(e.target.value)}
              placeholder="结束日期"
              className="h-8 w-[130px] rounded border border-[#D1D5DB] px-2 text-[12px]"
            />
            <span className="text-[#9CA3AF]" aria-hidden>
              📅
            </span>
          </div>
        </div>

        <div className="flex-1" />

        <button
          type="button"
          className="rounded bg-[#2563EB] px-5 py-1.5 text-[12px] font-medium text-white hover:bg-[#1D4ED8]"
        >
          查询
        </button>
        <button
          type="button"
          onClick={handleReset}
          className="rounded border border-[#D1D5DB] bg-white px-5 py-1.5 text-[12px] text-[#374151] hover:bg-[#F9FAFB]"
        >
          重置
        </button>
      </div>

      <div className="relative min-h-0 flex-1 overflow-auto">
        <PlatformWatermark />
        <table className="w-full min-w-max border-collapse text-[12px] text-[#374151]">
          <thead className="sticky top-0 z-[1] bg-[#F9FAFB]">
            <tr className="border-b border-[#E5E7EB]">
              {ORDER_REPORT_COLUMNS.map((col) => (
                <th key={col.key} className="px-4 py-2.5 text-left font-medium text-[#6B7280]">
                  {col.label}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {ORDER_REPORT_ROWS.map((row) => (
              <tr key={row.orderNo} className="border-b border-[#F3F4F6] hover:bg-[#F9FAFB]">
                {ORDER_REPORT_COLUMNS.map((col) => (
                  <td key={col.key} className="px-4 py-2 tabular-nums">
                    {row[col.key as keyof OrderReportRow]}
                  </td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <div className="flex shrink-0 items-center justify-end gap-3 border-t border-[#E5E7EB] px-4 py-2 text-[12px] text-[#6B7280]">
        <span>总计 {ORDER_REPORT_TOTAL} 条</span>
        <div className="flex items-center gap-1">
          <PagerBtn active>1</PagerBtn>
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
