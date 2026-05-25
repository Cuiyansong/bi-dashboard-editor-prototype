/** 考核分析：机构三维维度 */
export const ORG_PROVINCE_OPTIONS = ["华东省行", "华南省行", "华北省行", "西南省行"] as const;
export const ORG_BRANCH_OPTIONS = ["杭州分行", "南京分行", "广州分行", "成都分行", "武汉分行"] as const;
export const ORG_OUTLET_OPTIONS = [
  "西湖支行",
  "滨江支行",
  "天河支行",
  "高新支行",
  "江汉支行",
  "武侯支行",
] as const;

export const ASSESSMENT_DIMENSION_GROUPS = [
  { key: "province", label: "省行", options: ORG_PROVINCE_OPTIONS },
  { key: "branch", label: "二级行", options: ORG_BRANCH_OPTIONS },
  { key: "outlet", label: "网点", options: ORG_OUTLET_OPTIONS },
] as const;

export const ASSESSMENT_DASHBOARD_TABS = [
  "存款通报",
  "理财销量通报",
  "基金中收通报",
  "保险销售通报",
  "借记卡快捷支付考核",
  "信用卡通报",
  "消费贷款通报",
  "手机银行通报",
] as const;

/** 指标面板内 Tab：头寸 / 到期客群 / 保险 / 借记卡 / 个体经营者达标 */
export const ASSESSMENT_INDICATOR_TABS = [
  "头寸通报",
  "到期客群通报",
  "保险销售通报",
  "借记卡快捷支付通报",
  "个体经营者体现达标客户通报",
] as const;

export type AssessmentIndicatorTab = (typeof ASSESSMENT_INDICATOR_TABS)[number];

export type AssessmentIndicatorFieldGroup = {
  label: string;
  fields: readonly string[];
};

export type AssessmentIndicatorTabDef = {
  tab: AssessmentIndicatorTab;
  groups: readonly AssessmentIndicatorFieldGroup[];
};

const POSITION_INDICATORS = [
  "日均份额（较年初）",
  "日均份额（较上季）",
  "日均份额（较上月）",
  "日均份额（较上周）",
  "剪刀差",
  "时日份额剪刀差",
  "同业日均份额较上月",
] as const;

const MATURITY_COHORT_INDICATORS = [
  "金融资产余额（最新日）",
  "金融资产余额（上月末）",
  "金融资产余额增减",
  "金融资产承接率",
  "存款余额（最新日）",
  "存款余额（上月末）",
  "存款余额增减",
  "存款承接率",
] as const;

const INSURANCE_SALES_FIELDS = [
  "当日期缴销量",
  "当日趸交销量",
  "累计期缴2-5年不含",
  "累计期缴5年含及以上",
  "合计期缴销量",
  "趸交销量",
  "加权销量",
  "销量排名",
] as const;

const INSURANCE_INCOME_FIELDS = [
  "收入较上日",
  "累计收入",
  "二季度目标",
  "目标完成率",
  "收入排名",
] as const;

const DEBIT_YEAR_CUMULATIVE_FIELDS = [
  "当年累计交易额",
  "当年累计上年同期",
  "当年累计同比",
  "当年累计排名",
] as const;

const DEBIT_MONTH_CUMULATIVE_FIELDS = [
  "当月累计交易额",
  "当月累计环比",
  "当月累计排名",
] as const;

const DEBIT_DAILY_FIELDS = ["当日交易额", "当日环比", "当日排名"] as const;

const DEBIT_BIND_CARD_FIELDS = [
  "累计绑卡客户数",
  "截止2025年末存量",
  "当年净增",
  "绑卡增速",
  "绑卡排名",
] as const;

const SOLE_PROPRIETOR_FIELDS = [
  "上月达标数",
  "本月达标数",
  "本月达标率",
  "达标率排名",
  "参与抽奖人数",
  "参与率",
  "参与率排名",
] as const;

const ASSESSMENT_INDICATOR_TAB_DEFS: readonly AssessmentIndicatorTabDef[] = [
  {
    tab: "头寸通报",
    groups: [{ label: "头寸指标", fields: POSITION_INDICATORS }],
  },
  {
    tab: "到期客群通报",
    groups: [{ label: "到期客群指标", fields: MATURITY_COHORT_INDICATORS }],
  },
  {
    tab: "保险销售通报",
    groups: [
      { label: "销量", fields: INSURANCE_SALES_FIELDS },
      { label: "收入", fields: INSURANCE_INCOME_FIELDS },
    ],
  },
  {
    tab: "借记卡快捷支付通报",
    groups: [
      { label: "当年累计业务数据", fields: DEBIT_YEAR_CUMULATIVE_FIELDS },
      { label: "当月累计业务数据", fields: DEBIT_MONTH_CUMULATIVE_FIELDS },
      { label: "当日业务数据", fields: DEBIT_DAILY_FIELDS },
      { label: "绑卡维度", fields: DEBIT_BIND_CARD_FIELDS },
    ],
  },
  {
    tab: "个体经营者体现达标客户通报",
    groups: [{ label: "达标客户", fields: SOLE_PROPRIETOR_FIELDS }],
  },
];

const TAB_DEF_MAP = Object.fromEntries(
  ASSESSMENT_INDICATOR_TAB_DEFS.map((d) => [d.tab, d]),
) as Record<AssessmentIndicatorTab, AssessmentIndicatorTabDef>;

export function getAssessmentIndicatorFieldGroupsForTab(
  indicatorTabLabel: string,
): readonly AssessmentIndicatorFieldGroup[] {
  const def = TAB_DEF_MAP[indicatorTabLabel as AssessmentIndicatorTab];
  return def?.groups ?? ASSESSMENT_INDICATOR_TAB_DEFS[0]!.groups;
}

export function getAssessmentIndicatorFieldsForTab(indicatorTabLabel: string): readonly string[] {
  return getAssessmentIndicatorFieldGroupsForTab(indicatorTabLabel).flatMap((g) => g.fields);
}

export function getAllAssessmentIndicatorFields(): readonly string[] {
  return ASSESSMENT_INDICATOR_TAB_DEFS.flatMap((d) => d.groups.flatMap((g) => g.fields));
}

/** @deprecated 画布 Tab 切换不再驱动指标列表；保留供兼容引用 */
export function getAssessmentIndicatorsForTab(_tabLabel: string): readonly string[] {
  return getAllAssessmentIndicatorFields();
}

export function flattenOrgOptions(): string[] {
  return [...ORG_PROVINCE_OPTIONS, ...ORG_BRANCH_OPTIONS, ...ORG_OUTLET_OPTIONS];
}
