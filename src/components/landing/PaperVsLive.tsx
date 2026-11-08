import { CheckCircle2, MapPin, Users } from "lucide-react";
import OrgMark from "@/components/layout/OrgMark";

const paperRows = [
  { name: "A. Eze", time: "8:50", isStruck: false },
  { name: "Tunde B.", time: "—", isStruck: false },
  { name: "G. Okon", time: "9:1?", isStruck: true },
  { name: "Grace Okon", time: "9:15", isStruck: false },
  { name: "S. U — see Bro. Paul", time: "", isStruck: false },
];

const PaperVsLive = () => (
  <div className="relative mx-auto w-full max-w-md pb-4 lg:mx-0 lg:ml-auto">
    <div
      aria-hidden
      className="w-[72%] -rotate-6 rounded-sm bg-[#f3ecd9] p-4 pb-24 text-zinc-700 shadow-lg ring-1 ring-black/5"
    >
      <p className="border-b-2 border-rose-300 pb-1 font-serif text-lg">Workers&apos; register</p>
      {paperRows.map(({ name, time, isStruck }) => (
        <p
          key={name}
          className="flex justify-between border-b border-sky-300/60 py-1.5 font-serif text-base"
        >
          <span className={isStruck ? "line-through" : undefined}>{name}</span>
          <span>{time}</span>
        </p>
      ))}
    </div>
    <figure className="relative -mt-64 mr-2 ml-auto w-64 rounded-[2.25rem] border-[6px] border-zinc-900 bg-card p-4 shadow-2xl dark:border-zinc-700">
      <div className="mx-auto mb-4 h-1.5 w-16 rounded-full bg-subtle" />
      <div className="flex items-center gap-2">
        <OrgMark name="Hope Tabernacle" color="#0f766e" className="size-6 rounded-md text-xs" />
        <span className="text-xs font-semibold">Hope Tabernacle</span>
      </div>
      <p className="mt-4 font-serif text-2xl leading-tight">Good morning, Ada</p>
      <p className="text-xs text-muted">Sunday Service · Starts 9:00</p>
      <div className="mt-5 flex flex-col items-center gap-2 rounded-2xl bg-subtle px-3 py-5 text-center">
        <span className="flex size-14 items-center justify-center rounded-full bg-ok-soft text-ok">
          <CheckCircle2 className="size-7" />
        </span>
        <p className="text-sm font-semibold">You&apos;re checked in</p>
        <p className="font-mono text-xs">8:50 AM · On time</p>
        <p className="flex items-center gap-1 text-[11px] text-muted">
          <MapPin className="size-3" /> Verified at church · 12 m away
        </p>
      </div>
      <p className="mt-3 flex items-center justify-center gap-1.5 text-[11px] text-muted">
        <Users className="size-3" /> Choir · 14 of 16 here
      </p>
      <figcaption className="sr-only">
        A member&apos;s phone after checking in, replacing the paper register
      </figcaption>
    </figure>
  </div>
);

export default PaperVsLive;
