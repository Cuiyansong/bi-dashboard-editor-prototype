import { SelfServiceQueryBoardCard } from "../SelfServiceQueryBoardCard";
import { buildPreviewWidget } from "./templateCatalogRouting";

export type TemplateAnalysisPreviewPageProps = {
  templateId: string;
  dashTabLabel: string;
  breadcrumb?: string;
  context: "query" | "config";
  editing?: boolean;
  onEditingChange?: (editing: boolean) => void;
};

export function TemplateAnalysisPreviewPage({
  templateId,
  dashTabLabel,
  breadcrumb,
  context,
  editing = false,
  onEditingChange,
}: TemplateAnalysisPreviewPageProps) {
  const widget = buildPreviewWidget(templateId, dashTabLabel);
  const displayMode = context === "query" ? "view" : editing ? "configure" : "view";
  const showEditToggle = context === "config" && onEditingChange != null;

  return (
    <div className="flex h-full min-h-0 flex-col bg-[#F3F4F6]">
      {breadcrumb ? (
        <div className="flex shrink-0 items-center justify-between gap-3 border-b border-[#E5E7EB] bg-[#FAFAFA] px-4 py-2">
          <span className="text-[12px] text-[#6B7280]">{breadcrumb}</span>
          {showEditToggle ? (
            <button
              type="button"
              onClick={() => onEditingChange(!editing)}
              className={
                editing
                  ? "rounded-md bg-[#1E40AF] px-3 py-1.5 text-[12px] font-medium text-white hover:bg-[#1D4ED8]"
                  : "rounded-md border border-[#1E40AF] bg-white px-3 py-1.5 text-[12px] font-medium text-[#1E40AF] hover:bg-[#EFF6FF]"
              }
            >
              {editing ? "完成" : "编辑"}
            </button>
          ) : null}
        </div>
      ) : null}
      <div className="min-h-0 flex-1 overflow-auto p-3">
        <SelfServiceQueryBoardCard w={widget} dashTabLabel={dashTabLabel} displayMode={displayMode} />
      </div>
    </div>
  );
}
