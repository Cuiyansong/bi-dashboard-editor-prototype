export type FieldValueType = "number" | "string" | "date";

export type FilterSource = "dimension" | "measure" | "column";

export type NumericOperator =
  | "within"
  | "outside"
  | "eq"
  | "neq"
  | "gte"
  | "lte"
  | "lt"
  | "gt";

export type StringOperator =
  | "notExclude"
  | "contains"
  | "prefix"
  | "suffix"
  | "eq"
  | "empty";

export type FieldFilterOperator = NumericOperator | StringOperator | "dateRange";

export type FieldFilterCondition = {
  id: string;
  fieldLabel: string;
  source: FilterSource;
  valueType: FieldValueType;
  operator: FieldFilterOperator;
  value?: string;
  valueEnd?: string;
};

export const NUMERIC_OPERATORS: { id: NumericOperator; label: string }[] = [
  { id: "within", label: "区间内" },
  { id: "outside", label: "区间外" },
  { id: "eq", label: "相等" },
  { id: "neq", label: "不相等" },
  { id: "gte", label: "大于或等于" },
  { id: "lte", label: "小于或等于" },
  { id: "lt", label: "小于" },
  { id: "gt", label: "大于" },
];

export const STRING_OPERATORS: { id: StringOperator; label: string }[] = [
  { id: "notExclude", label: "不排除" },
  { id: "contains", label: "包含" },
  { id: "prefix", label: "前缀包含" },
  { id: "suffix", label: "后缀包含" },
  { id: "eq", label: "相等" },
  { id: "empty", label: "为空" },
];

let filterIdCounter = 0;

export function newFilterId(): string {
  filterIdCounter += 1;
  return `filter-${filterIdCounter}-${Date.now()}`;
}

export function inferFieldValueType(label: string): FieldValueType {
  if (/日期|时间/.test(label) || label === "交易时间" || label === "到期日期") {
    return "date";
  }
  if (/余额|金额|笔数|率|排名|销量|中收|同比|环比|占比|数量|存期/.test(label)) {
    return "number";
  }
  return "string";
}

export function defaultOperatorForType(valueType: FieldValueType): FieldFilterOperator {
  if (valueType === "date") return "dateRange";
  if (valueType === "number") return "within";
  return "contains";
}

export function operatorLabel(operator: FieldFilterOperator): string {
  if (operator === "dateRange") return "日期范围";
  const num = NUMERIC_OPERATORS.find((o) => o.id === operator);
  if (num) return num.label;
  const str = STRING_OPERATORS.find((o) => o.id === operator);
  if (str) return str.label;
  return operator;
}

export function formatFilterTag(cond: FieldFilterCondition): string {
  const op = operatorLabel(cond.operator);
  if (cond.operator === "dateRange") {
    const from = cond.value ?? "";
    const to = cond.valueEnd ?? "";
    if (from && to) return `${cond.fieldLabel} ${from} ~ ${to}`;
    return `${cond.fieldLabel} 日期范围`;
  }
  if (cond.operator === "empty") {
    return `${cond.fieldLabel} ${op}`;
  }
  if (cond.operator === "within" || cond.operator === "outside") {
    const a = cond.value ?? "";
    const b = cond.valueEnd ?? "";
    return `${cond.fieldLabel} ${op} ${a} - ${b}`;
  }
  const v = cond.value ?? "";
  return `${cond.fieldLabel} ${op} ${v}`.trim();
}

export function isRangeOperator(operator: FieldFilterOperator): boolean {
  return operator === "within" || operator === "outside" || operator === "dateRange";
}

export function hasFilterForField(filters: FieldFilterCondition[], fieldLabel: string): boolean {
  return filters.some((f) => f.fieldLabel === fieldLabel);
}
