/** 编辑器界面模式：复杂版展示全部工具按钮；简单版仅隐藏工具栏右侧图标区与顶栏「页面设置」 */
export type EditorUiMode = "simple" | "complex";

/** 进入编辑器时的默认界面模式 */
export const DEFAULT_EDITOR_UI_MODE: EditorUiMode = "complex";

export function isComplexEditorMode(mode: EditorUiMode): boolean {
  return mode === "complex";
}
