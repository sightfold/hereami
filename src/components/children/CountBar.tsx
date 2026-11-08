import { cn } from "@/utils/cn";

type CountBarProps = { present: number; absent: number; total: number };

const CountBar = ({ present, absent, total }: CountBarProps) => {
  const items = [
    { label: "Present", value: present, tone: "text-ok" },
    { label: "Absent", value: absent, tone: "text-bad" },
    { label: "Not marked", value: total - present - absent, tone: "text-muted" },
    { label: "Total", value: total, tone: "text-fg" },
  ];
  return (
    <div className="sticky top-(--banner-h) z-10 mb-3 grid grid-cols-4 paper rounded-md border border-line py-2.5">
      {items.map((item) => (
        <div key={item.label} className="min-w-0 px-1 text-center">
          <p className={cn("text-xl font-semibold tabular-nums", item.tone)}>{item.value}</p>
          <p className="truncate text-[11px] text-muted">{item.label}</p>
        </div>
      ))}
    </div>
  );
};

export default CountBar;
