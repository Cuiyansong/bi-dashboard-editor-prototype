/**
 * Left chart library from Figma `2:7393` / `div.components-charts-all-group-list`
 * (extracted from cached MCP output for node `2:7361`).
 */
import type { WidgetType } from "../model/dashboardModel";

export type LeftLibraryItem = {
  label: string;
  /** Full Tailwind fragment on the sprite <img> (includes absolute + dimensions). */
  spriteClass: string;
  widgetType: WidgetType;
};

export type LeftLibrarySection = {
  title: string;
  items: LeftLibraryItem[];
};

function mapLabelToWidget(label: string, section: string): WidgetType {
  if (/热力地图|色彩地图|气泡地图|飞线地图|符号地图|楼宇热力/.test(label)) return "bar";
  if (/交叉|明细|多维|趋势分析|热力图/.test(label)) return "table";
  if (/水波|液/.test(label)) return "liquid";
  if (section === "线/面图" && (label === "堆积" || label === "百分比")) return "line";
  if (section === "柱/条图" && (label === "堆积" || label === "百分比")) return "bar";
  if (/柱|条|排行|瀑布|子弹|箱形|直方|饼|玫瑰|旭日|雷达|矩形树|漏斗|桑基|来源|对比|弧/.test(label)) return "bar";
  if (/线|面积|组合|散点|分面|气泡图/.test(label)) return "line";
  if (/翻牌|进度|仪表|指标看板|指标趋势|指标拆解|指标关系|词云|时间轴/.test(label)) return "kpi";
  return "kpi";
}

const SPRITES: string[] = [
  "absolute h-[10960%] left-[-213.33%] max-w-none top-[-5586.67%] w-[4346.67%]",
  "absolute h-[10960%] left-[-213.33%] max-w-none top-[-6000%] w-[4346.67%]",
  "absolute h-[10960%] left-[-213.33%] max-w-none top-[-6413.33%] w-[4346.67%]",
  "absolute h-[10960%] left-[-213.33%] max-w-none top-[-7240%] w-[4346.67%]",
  "absolute h-[10960%] left-[-213.33%] max-w-none top-[-6826.67%] w-[4346.67%]",
  "absolute h-[10960%] left-[-626.67%] max-w-none top-[-5586.67%] w-[4346.67%]",
  "absolute h-[10960%] left-[-626.67%] max-w-none top-[-6000%] w-[4346.67%]",
  "absolute h-[10960%] left-[-626.67%] max-w-none top-[-6413.33%] w-[4346.67%]",
  "absolute h-[10960%] left-[-626.67%] max-w-none top-[-6826.67%] w-[4346.67%]",
  "absolute h-[10960%] left-[-626.67%] max-w-none top-[-7240%] w-[4346.67%]",
  "absolute h-[10960%] left-[-626.67%] max-w-none top-[-7653.33%] w-[4346.67%]",
  "absolute h-[10960%] left-[-626.67%] max-w-none top-[-8066.67%] w-[4346.67%]",
  "absolute h-[10960%] left-[-626.67%] max-w-none top-[-8480%] w-[4346.67%]",
  "absolute h-[10960%] left-[-1040%] max-w-none top-[-5586.67%] w-[4346.67%]",
  "absolute h-[10960%] left-[-1040%] max-w-none top-[-6000%] w-[4346.67%]",
  "absolute h-[10960%] left-[-1040%] max-w-none top-[-6413.33%] w-[4346.67%]",
  "absolute h-[10960%] left-[-1040%] max-w-none top-[-6826.67%] w-[4346.67%]",
  "absolute h-[10960%] left-[-1040%] max-w-none top-[-7240%] w-[4346.67%]",
  "absolute h-[10960%] left-[-1453.33%] max-w-none top-[-5586.67%] w-[4346.67%]",
  "absolute h-[10960%] left-[-1453.33%] max-w-none top-[-6000%] w-[4346.67%]",
  "absolute h-[10960%] left-[-1453.33%] max-w-none top-[-6413.33%] w-[4346.67%]",
  "absolute h-[10960%] left-[-1453.33%] max-w-none top-[-6826.67%] w-[4346.67%]",
  "absolute h-[10960%] left-[-1453.33%] max-w-none top-[-7240%] w-[4346.67%]",
  "absolute h-[10960%] left-[-1453.33%] max-w-none top-[-7653.33%] w-[4346.67%]",
  "absolute h-[10960%] left-[-1453.33%] max-w-none top-[-8066.67%] w-[4346.67%]",
  "absolute h-[10960%] left-[-1453.33%] max-w-none top-[-8480%] w-[4346.67%]",
  "absolute h-[10960%] left-[-1453.33%] max-w-none top-[-8893.33%] w-[4346.67%]",
  "absolute h-[10960%] left-[-1453.33%] max-w-none top-[-9306.67%] w-[4346.67%]",
  "absolute h-[10960%] left-[-1453.33%] max-w-none top-[-9720%] w-[4346.67%]",
  "absolute h-[10960%] left-[-1453.33%] max-w-none top-[-10133.33%] w-[4346.67%]",
  "absolute h-[10960%] left-[-1453.33%] max-w-none top-[-10546.67%] w-[4346.67%]",
  "absolute h-[10960%] left-[-1866.67%] max-w-none top-[-5586.67%] w-[4346.67%]",
  "absolute h-[10960%] left-[-1866.67%] max-w-none top-[-6000%] w-[4346.67%]",
  "absolute h-[10960%] left-[-1866.67%] max-w-none top-[-6826.67%] w-[4346.67%]",
  "absolute h-[10960%] left-[-1866.67%] max-w-none top-[-6413.33%] w-[4346.67%]",
  "absolute h-[10960%] left-[-1866.67%] max-w-none top-[-7240%] w-[4346.67%]",
  "absolute h-[10960%] left-[-2280%] max-w-none top-[-5586.67%] w-[4346.67%]",
  "absolute h-[10960%] left-[-2280%] max-w-none top-[-6000%] w-[4346.67%]",
  "absolute h-[10960%] left-[-2280%] max-w-none top-[-6413.33%] w-[4346.67%]",
  "absolute h-[10960%] left-[-2693.33%] max-w-none top-[-5586.67%] w-[4346.67%]",
  "absolute h-[10960%] left-[-2693.33%] max-w-none top-[-6000%] w-[4346.67%]",
  "absolute h-[10960%] left-[-2693.33%] max-w-none top-[-6413.33%] w-[4346.67%]",
  "absolute h-[10960%] left-[-2693.33%] max-w-none top-[-6826.67%] w-[4346.67%]",
  "absolute h-[10960%] left-[-2693.33%] max-w-none top-[-7240%] w-[4346.67%]",
  "absolute h-[10960%] left-[-3106.67%] max-w-none top-[-5586.67%] w-[4346.67%]",
  "absolute h-[10960%] left-[-3106.67%] max-w-none top-[-6000%] w-[4346.67%]",
  "absolute h-[10960%] left-[-3106.67%] max-w-none top-[-6413.33%] w-[4346.67%]",
  "absolute h-[10960%] left-[-3106.67%] max-w-none top-[-7653.33%] w-[4346.67%]",
  "absolute h-[10960%] left-[-3106.67%] max-w-none top-[-6826.67%] w-[4346.67%]",
  "absolute h-[10960%] left-[-3106.67%] max-w-none top-[-7240%] w-[4346.67%]",
  "absolute h-[10960%] left-[-3520%] max-w-none top-[-5586.67%] w-[4346.67%]",
  "absolute h-[10960%] left-[-3520%] max-w-none top-[-6000%] w-[4346.67%]",
];

const LABELS: string[] = [
  "交叉表",
  "明细表",
  "趋势分析",
  "多维分析",
  "热力图",
  "指标看板",
  "指标趋势",
  "翻牌器",
  "进度条",
  "仪表盘",
  "水波图",
  "指标拆解",
  "指标关系",
  "线图",
  "面积图",
  "堆积",
  "百分比",
  "组合图",
  "柱图",
  "堆积",
  "百分比",
  "环形柱图",
  "排行榜",
  "条形图",
  "堆积",
  "百分比",
  "动态条形",
  "瀑布图",
  "子弹图",
  "箱形图",
  "直方图",
  "饼图",
  "玫瑰图",
  "旭日图",
  "雷达图",
  "矩形树图",
  "气泡图",
  "散点图",
  "分面散点",
  "漏斗图",
  "对比漏斗",
  "来源去向",
  "桑基图",
  "弧线图",
  "色彩地图",
  "气泡地图",
  "热力地图",
  "楼宇热力",
  "飞线地图",
  "符号地图",
  "词云图",
  "时间轴",
];

const SECTION_TITLES = [
  "表格",
  "指标",
  "线/面图",
  "柱/条图",
  "饼/环形",
  "气泡/散点",
  "漏斗/转化关系",
  "地理",
  "其他",
] as const;

const SECTION_COUNTS = [5, 8, 5, 13, 5, 3, 5, 6, 2] as const;

function buildCatalog(): LeftLibrarySection[] {
  let i = 0;
  return SECTION_TITLES.map((title, si) => {
    const n = SECTION_COUNTS[si]!;
    const items: LeftLibraryItem[] = [];
    for (let j = 0; j < n; j++) {
      const label = LABELS[i]!;
      const spriteClass = SPRITES[i]!;
      items.push({ label, spriteClass, widgetType: mapLabelToWidget(label, title) });
      i++;
    }
    return { title, items };
  });
}

export const LEFT_LIBRARY_CATALOG: LeftLibrarySection[] = buildCatalog();
