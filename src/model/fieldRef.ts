/** 从数据面板拖入字段槽的引用 */

export type DimensionSemantic = "string" | "date";

export type FieldRef = {
  kind: "dimension" | "measure";
  key: string;
  label: string;
  semantic: DimensionSemantic | "number";
};

export const BI_FIELD_MIME = "application/bi-field";

export function serializeFieldRef(f: FieldRef): string {
  return JSON.stringify(f);
}

export function parseFieldRef(raw: string): FieldRef | null {
  try {
    const o = JSON.parse(raw) as FieldRef;
    if (o && (o.kind === "dimension" || o.kind === "measure") && typeof o.key === "string" && typeof o.label === "string") {
      const sem = o.semantic;
      if (sem !== "string" && sem !== "date" && sem !== "number") return null;
      return o as FieldRef;
    }
  } catch {
    /* ignore */
  }
  return null;
}
