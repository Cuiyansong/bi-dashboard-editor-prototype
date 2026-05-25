import { useState } from "react";
import { collectExpandableIds, REPORT_QUERY_TREE } from "./integratedReportConfig";
import { ReportTreeList, useFilteredReportTree } from "./ReportTreeSidebar";

export function ReportQuerySidebar({
  selectedId,
  onSelect,
  treeQuery,
  onTreeQueryChange,
}: {
  selectedId: string;
  onSelect: (id: string) => void;
  treeQuery: string;
  onTreeQueryChange: (q: string) => void;
}) {
  const [expandedIds, setExpandedIds] = useState<Set<string>>(
    () => new Set(collectExpandableIds(REPORT_QUERY_TREE)),
  );
  const filteredTree = useFilteredReportTree(REPORT_QUERY_TREE, treeQuery);

  return (
    <aside className="flex w-[240px] shrink-0 flex-col border-r border-[#E5E7EB] bg-white">
      <div className="border-b border-[#E5E7EB] px-3 py-2.5">
        <div className="mb-2 flex items-center justify-between">
          <span className="text-[12px] font-medium text-[#374151]">仪表板 &amp; 数据表</span>
          <span className="text-[#9CA3AF]" aria-hidden>
            🔍
          </span>
        </div>
        <input
          type="search"
          value={treeQuery}
          onChange={(e) => onTreeQueryChange(e.target.value)}
          placeholder="搜索名称关键字"
          className="w-full rounded border border-[#D1D5DB] px-2 py-1.5 text-[12px]"
        />
      </div>
      <div className="min-h-0 flex-1 overflow-y-auto py-1 [scrollbar-width:thin]">
        <ReportTreeList
          tree={filteredTree}
          selectedId={selectedId}
          expandedIds={expandedIds}
          onToggle={(id) =>
            setExpandedIds((prev) => {
              const next = new Set(prev);
              if (next.has(id)) next.delete(id);
              else next.add(id);
              return next;
            })
          }
          onSelect={onSelect}
          variant="query"
        />
      </div>
    </aside>
  );
}
