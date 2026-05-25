import { useEffect, useMemo, useState } from "react";
import {
  DEFAULT_CONFIG_DASHBOARD_ID,
  DEFAULT_QUERY_REPORT_ID,
  findReportTreeNode,
  REPORT_CONFIG_TREE,
  REPORT_QUERY_TREE,
  type ConfigAddMenuId,
  type ConfigMainView,
  type IntegratedTopNavId,
  type ReportTreeNode,
} from "./integratedReportConfig";
import { IntegratedReportHomePage } from "./IntegratedReportHomePage";
import { IntegratedReportShell } from "./IntegratedReportShell";
import { OrderReportQueryPage } from "./OrderReportQueryPage";
import { ReportConfigSidebar } from "./ReportConfigSidebar";
import { ReportQueryReplicaPage } from "./ReportQueryReplicaPage";
import { ReportQuerySidebar } from "./ReportQuerySidebar";
import { TemplateAnalysisPreviewPage } from "./TemplateAnalysisPreviewPage";
import { TemplatePickerPanel } from "./TemplatePickerPanel";
import { isPostEvaluationTemplate, isTemplateLinkedNode } from "./templateCatalogRouting";

export type IntegratedReportPlatformProps = {
  initialTopNav?: IntegratedTopNavId;
  onOpenTemplateEditor: (templateIdx: number, fromNav: IntegratedTopNavId) => void;
};

type CatalogRenderOptions = {
  configEditing: boolean;
  onConfigEditingChange: (editing: boolean) => void;
};

function renderCatalogContent(
  node: ReportTreeNode | null,
  context: "query" | "config",
  options: CatalogRenderOptions,
) {
  if (!node) {
    return (
      <div className="flex h-full items-center justify-center bg-white text-[13px] text-[#9CA3AF]">
        请选择左侧目录项
      </div>
    );
  }

  if (isTemplateLinkedNode(node)) {
    const tabLabel = node.dashTabLabel ?? node.label;
    const breadcrumb =
      context === "query"
        ? `报表查询 / 业务分析报表 / ${tabLabel}`
        : `报表配置 / 模板仪表板 / ${tabLabel}`;

    if (isPostEvaluationTemplate(node.templateId)) {
      return <ReportQueryReplicaPage reportTitle={tabLabel} breadcrumb={breadcrumb} />;
    }

    return (
      <TemplateAnalysisPreviewPage
        templateId={node.templateId}
        dashTabLabel={tabLabel}
        breadcrumb={breadcrumb}
        context={context}
        editing={context === "config" ? options.configEditing : false}
        onEditingChange={context === "config" ? options.onConfigEditingChange : undefined}
      />
    );
  }

  return <OrderReportQueryPage reportTitle={node.label} />;
}

export function IntegratedReportPlatform({
  initialTopNav = "home",
  onOpenTemplateEditor,
}: IntegratedReportPlatformProps) {
  const [topNav, setTopNav] = useState<IntegratedTopNavId>(initialTopNav);
  const [querySelectedId, setQuerySelectedId] = useState(DEFAULT_QUERY_REPORT_ID);
  const [configSelectedId, setConfigSelectedId] = useState(DEFAULT_CONFIG_DASHBOARD_ID);
  const [configMainView, setConfigMainView] = useState<ConfigMainView>("dashboard");
  const [configEditing, setConfigEditing] = useState(false);
  const [queryTreeQuery, setQueryTreeQuery] = useState("");
  const [configTreeQuery, setConfigTreeQuery] = useState("");

  useEffect(() => {
    setTopNav(initialTopNav);
  }, [initialTopNav]);

  const queryNode = useMemo(
    () => findReportTreeNode(querySelectedId, REPORT_QUERY_TREE),
    [querySelectedId],
  );
  const configNode = useMemo(
    () => findReportTreeNode(configSelectedId, REPORT_CONFIG_TREE),
    [configSelectedId],
  );

  const catalogOptions: CatalogRenderOptions = {
    configEditing,
    onConfigEditingChange: setConfigEditing,
  };

  const handleTopNavChange = (id: IntegratedTopNavId) => {
    setTopNav(id);
    if (id !== "reportConfig") {
      setConfigMainView("dashboard");
      setConfigEditing(false);
    }
  };

  const handleAddMenuSelect = (menuId: ConfigAddMenuId) => {
    if (menuId === "start-analysis") {
      setConfigMainView("dashboard");
      setConfigEditing(true);
    } else if (menuId === "template-table") {
      setConfigMainView("templatePicker");
      setConfigEditing(false);
    } else if (menuId === "new-dashboard") {
      setConfigSelectedId("dashboard-post-evaluation");
      setConfigMainView("dashboard");
      setConfigEditing(true);
    }
  };

  const sidebar =
    topNav === "reportQuery" ? (
      <ReportQuerySidebar
        selectedId={querySelectedId}
        onSelect={setQuerySelectedId}
        treeQuery={queryTreeQuery}
        onTreeQueryChange={setQueryTreeQuery}
      />
    ) : topNav === "reportConfig" ? (
      <ReportConfigSidebar
        selectedId={configSelectedId}
        onSelect={(id) => {
          setConfigSelectedId(id);
          setConfigMainView("dashboard");
          setConfigEditing(false);
        }}
        treeQuery={configTreeQuery}
        onTreeQueryChange={setConfigTreeQuery}
        onAddMenuSelect={handleAddMenuSelect}
      />
    ) : null;

  const mainContent = () => {
    if (topNav === "home") {
      return (
        <IntegratedReportHomePage onSelectTemplate={onOpenTemplateEditor} />
      );
    }
    if (topNav === "reportQuery") {
      return renderCatalogContent(queryNode, "query", catalogOptions);
    }
    if (topNav === "reportConfig") {
      if (configMainView === "templatePicker") {
        return (
          <TemplatePickerPanel
            onBack={() => setConfigMainView("dashboard")}
            onSelectTemplate={(idx) => onOpenTemplateEditor(idx, "reportConfig")}
          />
        );
      }
      return renderCatalogContent(configNode, "config", catalogOptions);
    }
    return (
      <div className="flex h-full items-center justify-center bg-white text-[13px] text-[#9CA3AF]">
        功能演示占位
      </div>
    );
  };

  return (
    <IntegratedReportShell
      topNav={topNav}
      onTopNavChange={handleTopNavChange}
      onBackToHome={() => setTopNav("home")}
      sidebar={sidebar}
    >
      {mainContent()}
    </IntegratedReportShell>
  );
}
