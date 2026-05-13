/** 部分环境下 drop 时 getData(customMime) 为空，用 dragstart 暂存作回退 */

let stagedBiWidgetJson: string | null = null;

export function stageBiWidgetDrag(json: string) {
  stagedBiWidgetJson = json;
}

export function takeStagedBiWidgetDrag(): string | null {
  const j = stagedBiWidgetJson;
  stagedBiWidgetJson = null;
  return j;
}

export function clearStagedBiWidgetDrag() {
  stagedBiWidgetJson = null;
}

export const BI_WIDGET_MIME = "application/bi-widget";
