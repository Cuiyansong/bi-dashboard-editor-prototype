const TOKEN = {
  primary: "#1E40AF",
  primarySoft: "#EFF6FF",
  border: "#E2E8F0",
  borderStrong: "#CBD5E1",
  card: "#FFFFFF",
  text: "#0F172A",
} as const;

function CheckIcon() {
  return (
    <svg viewBox="0 0 12 12" className="h-2.5 w-2.5" aria-hidden>
      <path
        d="M2.5 6l2.2 2.2 4.8-4.8"
        fill="none"
        stroke="currentColor"
        strokeWidth="1.6"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}

function MoreVerticalIcon() {
  return (
    <svg viewBox="0 0 12 12" className="h-3 w-3" aria-hidden fill="currentColor">
      <circle cx="6" cy="2.5" r="1" />
      <circle cx="6" cy="6" r="1" />
      <circle cx="6" cy="9.5" r="1" />
    </svg>
  );
}

export type FilterableChipProps = {
  label: string;
  selected: boolean;
  onToggle: () => void;
  chipVariant: "dimension" | "measure";
  filterable?: boolean;
  hasFilter?: boolean;
  onOpenFilter?: () => void;
};

export function FilterableChip({
  label,
  selected,
  onToggle,
  chipVariant,
  filterable = true,
  hasFilter = false,
  onOpenFilter,
}: FilterableChipProps) {
  const isDimension = chipVariant === "dimension";

  return (
    <span
      className={`inline-flex max-w-full shrink-0 items-stretch overflow-hidden rounded-md border text-[11px] leading-tight ${
        hasFilter ? "ring-1 ring-[#1E40AF]/40" : ""
      }`}
      style={{
        borderColor: selected ? TOKEN.primary : TOKEN.border,
      }}
    >
      <button
        type="button"
        aria-pressed={isDimension ? selected : undefined}
        aria-checked={!isDimension ? selected : undefined}
        role={isDimension ? undefined : "checkbox"}
        onClick={onToggle}
        className="inline-flex min-w-0 flex-1 cursor-pointer items-center gap-1 px-2 py-[3px] transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-inset focus-visible:ring-[#1E40AF]/35"
        style={{
          background: isDimension
            ? selected
              ? TOKEN.primary
              : TOKEN.card
            : selected
              ? TOKEN.primarySoft
              : TOKEN.card,
          color: isDimension ? (selected ? "#FFFFFF" : TOKEN.text) : selected ? TOKEN.primary : TOKEN.text,
          fontWeight: isDimension && selected ? 500 : 400,
        }}
      >
        {!isDimension ? (
          <span
            aria-hidden
            className="inline-flex h-3 w-3 shrink-0 items-center justify-center rounded-sm border"
            style={{
              borderColor: selected ? TOKEN.primary : TOKEN.borderStrong,
              background: selected ? TOKEN.primary : "#FFFFFF",
              color: "#FFFFFF",
            }}
          >
            {selected ? <CheckIcon /> : null}
          </span>
        ) : null}
        <span className="truncate">{label}</span>
      </button>
      {filterable && onOpenFilter ? (
        <button
          type="button"
          aria-label={`配置筛选：${label}`}
          onClick={(e) => {
            e.stopPropagation();
            onOpenFilter();
          }}
          className="flex shrink-0 cursor-pointer items-center border-l px-1 transition-colors hover:bg-black/[0.04] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-inset focus-visible:ring-[#1E40AF]/35"
          style={{
            borderColor: selected && isDimension ? "rgba(255,255,255,0.25)" : TOKEN.border,
            color: isDimension && selected ? "rgba(255,255,255,0.9)" : "#64748B",
            background: isDimension
              ? selected
                ? TOKEN.primary
                : TOKEN.card
              : selected
                ? TOKEN.primarySoft
                : TOKEN.card,
          }}
        >
          <MoreVerticalIcon />
        </button>
      ) : null}
    </span>
  );
}
