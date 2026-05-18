import { useState } from "react";
import { EditorFrame } from "./replica/EditorFrame";
import { HomePage } from "./replica/HomePage";
import { ViewportScaledFrame } from "./replica/ViewportScaledFrame";

export function App() {
  const [view, setView] = useState<"home" | "editor">("home");
  const [templateIdx, setTemplateIdx] = useState(0);

  return (
    <ViewportScaledFrame>
      {view === "home" ? (
        <HomePage
          onSelectTemplate={(idx) => {
            setTemplateIdx(idx);
            setView("editor");
          }}
        />
      ) : (
        <EditorFrame
          initialTemplateIdx={templateIdx}
          onBackToHome={() => setView("home")}
        />
      )}
    </ViewportScaledFrame>
  );
}
