import OrgMark from "@/components/layout/OrgMark";

const samples = [
  { name: "Hope Tabernacle", color: "#0f766e" },
  { name: "Mount Zion Parish", color: "#7c2d12" },
  { name: "New Dawn Assembly", color: "#3730a3" },
];

const WhiteLabel = () => (
  <section className="border-y border-line bg-card">
    <div className="mx-auto grid max-w-6xl items-center gap-10 px-4 py-14 sm:py-20 lg:grid-cols-2">
      <div>
        <h2 className="font-serif text-4xl tracking-tight sm:text-5xl">
          Your name on it, not ours
        </h2>
        <p className="mt-4 max-w-lg text-muted">
          Your church&apos;s logo, name and colour appear across the app, so workers see their own
          house, not ours. Your records are kept separate from every other church.
        </p>
      </div>
      <ul className="flex flex-col gap-3">
        {samples.map(({ name, color }) => (
          <li
            key={name}
            className="flex items-center gap-3 rounded-2xl border border-line bg-bg p-3"
          >
            <OrgMark name={name} color={color} className="size-10" />
            <span className="min-w-0 flex-1 truncate font-medium">{name}</span>
            <span
              style={{ backgroundColor: color }}
              className="shrink-0 rounded-full px-3 py-1 text-xs font-medium text-white"
            >
              Check in
            </span>
          </li>
        ))}
        <li className="text-right text-[11px] text-muted">Example organizations</li>
      </ul>
    </div>
  </section>
);

export default WhiteLabel;
