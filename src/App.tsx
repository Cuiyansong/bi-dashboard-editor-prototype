import { EditorFrame } from "./replica/EditorFrame";
import { ViewportScaledFrame } from "./replica/ViewportScaledFrame";

export function App() {
  return (
    <ViewportScaledFrame>
      <EditorFrame />
    </ViewportScaledFrame>
  );
}
