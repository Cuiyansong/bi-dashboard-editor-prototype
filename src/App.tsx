import { useState } from "react";
import { EditorFrame } from "./replica/EditorFrame";
import type { IntegratedTopNavId } from "./replica/integratedReport/integratedReportConfig";
import { IntegratedReportPlatform } from "./replica/integratedReport/IntegratedReportPlatform";
import { ViewportScaledFrame } from "./replica/ViewportScaledFrame";

export type AppView = "editor" | "integratedReport";

type NavReturn = { view: "integratedReport"; nav: IntegratedTopNavId } | null;

export function App() {
  const [view, setView] = useState<AppView>("integratedReport");
  const [templateIdx, setTemplateIdx] = useState(0);
  const [integratedInitialNav, setIntegratedInitialNav] = useState<IntegratedTopNavId>("home");
  const [returnAfterEditor, setReturnAfterEditor] = useState<NavReturn>(null);

  const handleEditorBack = () => {
    if (returnAfterEditor?.view === "integratedReport") {
      setIntegratedInitialNav(returnAfterEditor.nav);
      setReturnAfterEditor(null);
      setView("integratedReport");
      return;
    }
    setReturnAfterEditor(null);
    setIntegratedInitialNav("home");
    setView("integratedReport");
  };

  return (
    <ViewportScaledFrame>
      {view === "editor" ? (
        <EditorFrame
          initialTemplateIdx={templateIdx}
          onBackToHome={handleEditorBack}
          backLabel={
            returnAfterEditor?.view === "integratedReport"
              ? returnAfterEditor.nav === "home"
                ? "← 返回首页"
                : "← 返回报表配置"
              : undefined
          }
        />
      ) : null}
      {view === "integratedReport" ? (
        <IntegratedReportPlatform
          initialTopNav={integratedInitialNav}
          onOpenTemplateEditor={(idx, fromNav) => {
            setReturnAfterEditor({ view: "integratedReport", nav: fromNav });
            setTemplateIdx(idx);
            setView("editor");
          }}
        />
      ) : null}
    </ViewportScaledFrame>
  );
}
