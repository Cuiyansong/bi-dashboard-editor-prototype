import { useMemo } from "react";
import {
  filterReportTree,
  type ReportTreeNode,
  type ReportTreeNodeKind,
} from "./integratedReportConfig";

function kindIcon(kind: ReportTreeNodeKind | undefined, expanded: boolean): string {
  if (kind === "folder") return expanded ? "▾" : "▸";
  if (kind === "dashboard") return "◫";
  return "·";
}

function TreeNodeRow({
  node,
  depth,
  selectedId,
  expandedIds,
  onToggle,
  onSelect,
  variant,
}: {
  node: ReportTreeNode;
  depth: number;
  selectedId: string;
  expandedIds: Set<string>;
  onToggle: (id: string) => void;
  onSelect: (id: string) => void;
  variant: "query" | "config";
}) {
  const hasChildren = Boolean(node.children?.length);
  const expanded = expandedIds.has(node.id);
  const selected = selectedId === node.id;
  const isFolder = node.kind === "folder" || hasChildren;

  const selectedCls =
    variant === "query"
      ? "bg-[#EFF6FF] font-medium text-[#2563EB]"
      : "bg-[#DBEAFE] font-medium text-[#2563EB]";
  const hoverCls = variant === "query" ? "hover:bg-[#F3F4F6]" : "hover:bg-[#E5E7EB]/50";

  return (
    <div>
      <button
        type="button"
        onClick={() => {
          if (isFolder) onToggle(node.id);
          else onSelect(node.id);
        }}
        className={`flex w-full items-center gap-1 py-1.5 pr-2 text-left text-[12px] ${hoverCls} ${
          selected && !isFolder ? selectedCls : "text-[#374151]"
        } ${isFolder ? "font-medium text-[#4B5563]" : ""}`}
        style={{ paddingLeft: 8 + depth * 14 }}
      >
        <span className="w-3 shrink-0 text-[10px] text-[#9CA3AF]" aria-hidden>
          {hasChildren ? kindIcon("folder", expanded) : kindIcon(node.kind, false)}
        </span>
        {!hasChildren && node.kind === "dashboard" ? (
          <span className="mr-0.5 text-[11px] text-[#6366F1]" aria-hidden>
            ◫
          </span>
        ) : null}
        {!hasChildren && node.kind === "report" ? (
          <span className="mr-0.5 text-[11px] text-[#64748B]" aria-hidden>
            📄
          </span>
        ) : null}
        <span className="truncate">{node.label}</span>
      </button>
      {hasChildren && expanded
        ? node.children!.map((child) => (
            <TreeNodeRow
              key={child.id}
              node={child}
              depth={depth + 1}
              selectedId={selectedId}
              expandedIds={expandedIds}
              onToggle={onToggle}
              onSelect={onSelect}
              variant={variant}
            />
          ))
        : null}
    </div>
  );
}

export function ReportTreeList({
  tree,
  selectedId,
  expandedIds,
  onToggle,
  onSelect,
  variant,
}: {
  tree: ReportTreeNode[];
  selectedId: string;
  expandedIds: Set<string>;
  onToggle: (id: string) => void;
  onSelect: (id: string) => void;
  variant: "query" | "config";
}) {
  return (
    <>
      {tree.map((node) => (
        <TreeNodeRow
          key={node.id}
          node={node}
          depth={0}
          selectedId={selectedId}
          expandedIds={expandedIds}
          onToggle={onToggle}
          onSelect={onSelect}
          variant={variant}
        />
      ))}
    </>
  );
}

export function useFilteredReportTree(tree: ReportTreeNode[], treeQuery: string) {
  return useMemo(() => filterReportTree(tree, treeQuery), [tree, treeQuery]);
}
