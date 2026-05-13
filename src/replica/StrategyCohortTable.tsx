import type { CohortTrackingMockRow } from "../model/templateDatasets";

function cohortRowSpans(rows: CohortTrackingMockRow[]): number[] {
  const spans = new Array(rows.length).fill(0);
  let i = 0;
  while (i < rows.length) {
    let j = i + 1;
    while (j < rows.length && rows[j]!.cohort === rows[i]!.cohort) j++;
    const n = j - i;
    spans[i] = n;
    i = j;
  }
  return spans;
}

const green = "text-emerald-600 font-medium tabular-nums";

export function StrategyCohortTable({ rows }: { rows: CohortTrackingMockRow[] }) {
  const spans = cohortRowSpans(rows);
  return (
    <div className="max-h-[min(420px,70vh)] overflow-auto px-3 pb-3 pt-2">
      <div className="mb-2 flex flex-wrap items-center justify-between gap-2">
        <h2 className="text-sm font-semibold text-figma-text">客群策略全周期追踪看板</h2>
        <div className="flex items-center gap-2 text-xs text-figma-sub">
          <span>时间周期:</span>
          <span className="rounded border border-figma-line bg-white px-2 py-0.5 text-figma-text">近30天</span>
        </div>
      </div>
      <div className="overflow-hidden rounded-lg border border-black/[0.08] text-[12px]">
        <table className="w-full border-collapse text-left">
          <thead>
            <tr className="border-b border-primary bg-figma-azure-6 text-[11px] font-medium text-figma-text">
              <th className="w-10 px-2 py-2 text-center">序号</th>
              <th className="min-w-[100px] px-2 py-2">客群名称</th>
              <th className="min-w-[88px] px-2 py-2">指标名</th>
              <th className="px-2 py-2 text-right">指标期初值</th>
              <th className="px-2 py-2 text-right">指标期末值</th>
              <th className="px-2 py-2 text-right">变动值</th>
              <th className="px-2 py-2 text-right">变动率</th>
              <th className="min-w-[88px] px-2 py-2">客群策略</th>
            </tr>
          </thead>
          <tbody>
            {rows.map((row, idx) => (
              <tr key={idx} className={`border-b border-black/[0.06] last:border-b-0 ${idx % 2 === 1 ? "bg-figma-azure-6/30" : "bg-white"}`}>
                <td className="px-2 py-1.5 text-center tabular-nums text-figma-sub">{idx + 1}</td>
                {spans[idx]! > 0 ? (
                  <td className="px-2 py-1.5 align-top font-medium text-figma-text" rowSpan={spans[idx]}>
                    {row.cohort}
                  </td>
                ) : null}
                <td className="px-2 py-1.5 text-figma-text">{row.metric}</td>
                <td className="px-2 py-1.5 text-right tabular-nums text-figma-text">{row.open}</td>
                <td className="px-2 py-1.5 text-right tabular-nums text-figma-text">{row.close}</td>
                <td className={`px-2 py-1.5 text-right ${green}`}>{row.delta}</td>
                <td className={`px-2 py-1.5 text-right ${green}`}>{row.rate}</td>
                {spans[idx]! > 0 ? (
                  <td className="px-2 py-1.5 align-top" rowSpan={spans[idx]}>
                    <button type="button" className="inline-flex items-center gap-1 text-primary hover:underline">
                      <span aria-hidden>🔍</span>
                      查看策略
                    </button>
                  </td>
                ) : null}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
