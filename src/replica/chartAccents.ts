/** 看板卡片用色：在单模板主色之外增加色相变化，避免一屏同色 */
export const CARD_ACCENT_PALETTE = [
  "#1677ff",
  "#08979c",
  "#722ed1",
  "#fa8c16",
  "#13c2c2",
  "#eb2f96",
  "#52c41a",
  "#2f54eb",
  "#f5222d",
  "#faad14",
];

export function cardAccentForIndex(index: number, tabIndex: number): string {
  return CARD_ACCENT_PALETTE[(index + tabIndex * 2) % CARD_ACCENT_PALETTE.length];
}
