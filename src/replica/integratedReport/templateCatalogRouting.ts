import type { CanvasWidget } from "../../model/dashboardModel";
import { TEMPLATES } from "../../model/dashboardModel";

export type TemplateAnalysisMode = "customer" | "product" | "assessment" | "benefit" | "postEvaluation";

const TEMPLATE_ANALYSIS_MODE: Record<string, TemplateAnalysisMode> = {
  "report-kpi": "assessment",
  strategy: "benefit",
  "self-service-query": "customer",
  "product-analysis": "product",
  "post-evaluation": "postEvaluation",
};

export function getAnalysisModeForTemplate(templateId: string): TemplateAnalysisMode | null {
  return TEMPLATE_ANALYSIS_MODE[templateId] ?? null;
}

export function isPostEvaluationTemplate(templateId: string): boolean {
  return templateId === "post-evaluation";
}

export function isTemplateLinkedNode(node: { templateId?: string }): node is { templateId: string } {
  return node.templateId != null && node.templateId.length > 0;
}

export function buildPreviewWidget(templateId: string, title: string): CanvasWidget {
  const analysisMode = getAnalysisModeForTemplate(templateId);
  const template = TEMPLATES.find((t) => t.id === templateId);
  return {
    id: `preview-${templateId}`,
    type: "table",
    title: title || template?.name || "分析预览",
    colSpan: 2,
    replicaLayout: "selfServiceQuery",
    libraryLabel: template?.name,
    analysisMode: analysisMode ?? "customer",
  };
}
