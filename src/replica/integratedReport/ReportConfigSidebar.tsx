import { useRef, useState } from "react";
import {
  collectExpandableIds,
  CONFIG_ADD_MENU_ITEMS,
  REPORT_CONFIG_TREE,
  type ConfigAddMenuId,
} from "./integratedReportConfig";
import { ReportTreeList, useFilteredReportTree } from "./ReportTreeSidebar";

export function ReportConfigSidebar({
  selectedId,
  onSelect,
  treeQuery,
  onTreeQueryChange,
  onAddMenuSelect,
}: {
  selectedId: string;
  onSelect: (id: string) => void;
  treeQuery: string;
  onTreeQueryChange: (q: string) => void;
  onAddMenuSelect: (id: ConfigAddMenuId) => void;
}) {
  const [sidebarTab, setSidebarTab] = useState<"catalog" | "demo">("catalog");
  const [addMenuOpen, setAddMenuOpen] = useState(false);
  const [expandedIds, setExpandedIds] = useState<Set<string>>(
    () => new Set(collectExpandableIds(REPORT_CONFIG_TREE)),
  );
  const addBtnRef = useRef<HTMLButtonElement>(null);
  const filteredTree = useFilteredReportTree(REPORT_CONFIG_TREE, treeQuery);

  return (
    <aside className="flex w-[260px] shrink-0 flex-col border-r border-[#E5E7EB] bg-[#FAFAFA]">
      <div className="flex border-b border-[#E5E7EB]">
        {(["catalog", "demo"] as const).map((tab) => (
          <button
            key={tab}
            type="button"
            onClick={() => setSidebarTab(tab)}
            className={`flex-1 py-2 text-center text-[12px] ${
              sidebarTab === tab
                ? "border-b-2 border-[#2563EB] font-medium text-[#2563EB]"
                : "text-[#6B7280] hover:text-[#374151]"
            }`}
          >
            {tab === "catalog" ? "目录" : "演示"}
          </button>
        ))}
      </div>

      <div className="border-b border-[#E5E7EB] px-3 py-2.5">
        <div className="mb-2 flex items-center justify-between gap-2">
          <span className="text-[12px] font-medium text-[#374151]">仪表板 &amp; 数据图表</span>
          <div className="relative flex items-center gap-1">
            <button
              ref={addBtnRef}
              type="button"
              onClick={() => setAddMenuOpen((o) => !o)}
              className="flex h-6 w-6 items-center justify-center rounded border border-[#D1D5DB] bg-white text-[14px] text-[#374151] hover:bg-[#F3F4F6]"
              aria-label="新建"
            >
              +
            </button>
            <button
              type="button"
              className="flex h-6 w-6 items-center justify-center rounded text-[#9CA3AF] hover:bg-[#F3F4F6]"
              aria-label="更多"
            >
              ⋮
            </button>
            {addMenuOpen ? (
              <>
                <button
                  type="button"
                  aria-label="关闭菜单"
                  className="fixed inset-0 z-10 cursor-default"
                  onClick={() => setAddMenuOpen(false)}
                />
                <div className="absolute right-0 top-full z-20 mt-1 min-w-[140px] rounded border border-[#E5E7EB] bg-white py-1 shadow-lg">
                  {CONFIG_ADD_MENU_ITEMS.map((item) => (
                    <button
                      key={item.id}
                      type="button"
                      onClick={() => {
                        setAddMenuOpen(false);
                        onAddMenuSelect(item.id);
                      }}
                      className="block w-full px-3 py-1.5 text-left text-[12px] text-[#374151] hover:bg-[#EFF6FF] hover:text-[#2563EB]"
                    >
                      {item.label}
                    </button>
                  ))}
                </div>
              </>
            ) : null}
          </div>
        </div>
        <input
          type="search"
          value={treeQuery}
          onChange={(e) => onTreeQueryChange(e.target.value)}
          placeholder="搜索名称关键字"
          className="w-full rounded border border-[#D1D5DB] bg-white px-2 py-1.5 text-[12px]"
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
          variant="config"
        />
      </div>
    </aside>
  );
}
