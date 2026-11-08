import { Check } from "lucide-react";

const answers = [
  "Which posts are covered right now, and which aren't",
  "Turnout for each department, this week and last",
  "Who has been away, and for how long, so someone can call",
  "On-time rate compared with the last service",
  "Who serves faithfully, week after week",
];

const departments = [
  { name: "Choir", present: 14, total: 16 },
  { name: "Ushers", present: 9, total: 12 },
  { name: "Media", present: 7, total: 8 },
  { name: "Children's church", present: 5, total: 10 },
];

const Visibility = () => (
  <section className="bg-zinc-950 text-zinc-50">
    <div className="mx-auto grid max-w-6xl items-center gap-12 px-4 py-14 sm:py-20 lg:grid-cols-2">
      <div>
        <h2 className="font-serif text-4xl tracking-tight sm:text-5xl">
          Know your people, not just your numbers
        </h2>
        <ul className="mt-8 flex flex-col gap-3">
          {answers.map((answer) => (
            <li key={answer} className="flex items-start gap-3 text-sm sm:text-base">
              <Check className="mt-0.5 size-4 shrink-0 text-[#3fb68b]" />
              {answer}
            </li>
          ))}
        </ul>
      </div>
      <div className="rounded-2xl border border-white/10 bg-white/5 p-5">
        <div className="flex items-center justify-between text-sm">
          <p className="font-semibold">By department</p>
          <p className="text-xs text-zinc-400">Sample data</p>
        </div>
        <ul className="mt-5 flex flex-col gap-4">
          {departments.map(({ name, present, total }) => (
            <li key={name} className="text-sm">
              <div className="mb-1.5 flex justify-between">
                <span>{name}</span>
                <span className="font-mono text-zinc-400">
                  {present}/{total}
                </span>
              </div>
              <div className="h-1.5 rounded-full bg-white/10">
                <div
                  className="h-full rounded-full bg-[#3fb68b]"
                  style={{ width: `${(present / total) * 100}%` }}
                />
              </div>
            </li>
          ))}
        </ul>
      </div>
    </div>
  </section>
);

export default Visibility;
