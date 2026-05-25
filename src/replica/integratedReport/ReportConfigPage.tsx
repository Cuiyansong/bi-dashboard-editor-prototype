import { useState } from "react";
import { PlatformWatermark } from "./PlatformWatermark";

type ReportConfigPageProps = {
  dashboardTitle: string;
};

const CONFIG_TABLE_ROWS = [{ orgName: "山西分行南分行", suprOrgName: "山西分行" }];

export function ReportConfigPage({ dashboardTitle }: ReportConfigPageProps) {
  const [org1, setOrg1] = useState("山西分行");
  const [org2, setOrg2] = useState("山西分行");

  return (
    <div className="flex h-full min-h-0 flex-col bg-white">
      <div className="flex shrink-0 items-end gap-0 border-b border-[#E5E7EB] px-4 pt-2">
        <span className="rounded-t border border-b-0 border-[#D1D5DB] bg-white px-4 py-1.5 text-[13px] font-medium text-[#2563EB]">
          {dashboardTitle}
        </span>
      </div>

      <div className="flex shrink-0 items-center justify-between border-b border-[#E5E7EB] px-4 py-3">
        <div className="flex items-center gap-2">
          <h2 className="text-[15px] font-semibold text-[#111827]">{dashboardTitle}</h2>
          <button
            type="button"
            aria-label="编辑"
            className="text-[14px] text-[#9CA3AF] hover:text-[#2563EB]"
          >
            ✎
          </button>
        </div>
      </div>

      <div className="flex shrink-0 flex-wrap items-center gap-4 border-b border-[#E5E7EB] px-4 py-3">
        <div className="flex items-center gap-2">
          <span className="text-[12px] text-[#374151]">机构：</span>
          <select
            value={org1}
            onChange={(e) => setOrg1(e.target.value)}
            className="h-8 min-w-[120px] rounded border border-[#D1D5DB] px-2 text-[12px]"
          >
            <option>山西分行</option>
            <option>北京分行</option>
          </select>
        </div>
        <div className="flex items-center gap-2">
          <span className="text-[12px] text-[#374151]">机构：</span>
          <select
            value={org2}
            onChange={(e) => setOrg2(e.target.value)}
            className="h-8 min-w-[120px] rounded border border-[#D1D5DB] px-2 text-[12px]"
          >
            <option>山西分行</option>
            <option>北京分行</option>
          </select>
        </div>
        <div className="flex-1" />
        <button
          type="button"
          className="rounded bg-[#2563EB] px-6 py-1.5 text-[12px] font-medium text-white hover:bg-[#1D4ED8]"
        >
          下载按钮
        </button>
      </div>

      <div className="relative min-h-0 flex-1 overflow-auto">
        <PlatformWatermark />
        <table className="w-full border-collapse text-[12px] text-[#374151]">
          <thead className="sticky top-0 z-[1] bg-[#F9FAFB]">
            <tr className="border-b border-[#E5E7EB]">
              <th className="px-4 py-2.5 text-left font-medium text-[#6B7280]">org_name</th>
              <th className="px-4 py-2.5 text-left font-medium text-[#6B7280]">supr_org_name</th>
            </tr>
          </thead>
          <tbody>
            {CONFIG_TABLE_ROWS.map((row) => (
              <tr key={row.orgName} className="border-b border-[#F3F4F6] hover:bg-[#F9FAFB]">
                <td className="px-4 py-2">{row.orgName}</td>
                <td className="px-4 py-2">{row.suprOrgName}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <div className="flex shrink-0 items-center justify-end gap-3 border-t border-[#E5E7EB] px-4 py-2 text-[12px] text-[#6B7280]">
        <span>总计 1 条</span>
        <button
          type="button"
          className="min-w-[28px] rounded border border-[#2563EB] bg-[#EFF6FF] px-1.5 py-0.5 text-[#2563EB]"
        >
          1
        </button>
      </div>
    </div>
  );
}
