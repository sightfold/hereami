import { podiumThemes } from "@/components/leaderboard/PodiumCard";
import Trophy, { type Place } from "@/components/leaderboard/Trophy";
import Avatar from "@/components/ui/Avatar";
import { cn } from "@/utils/cn";
import { childName } from "@/utils/children";
import type { ChildStats } from "@/utils/childScore";

const ChildPodium = ({ stats, place }: { stats: ChildStats; place: Place }) => (
  <div
    className={cn(
      "relative flex min-h-56 flex-col gap-3 overflow-hidden rounded-3xl bg-linear-to-b p-5 text-white shadow-2xl ring-1",
      podiumThemes[place],
    )}
  >
    <div className="flex items-start justify-between gap-3">
      <div>
        <p className="font-display text-5xl leading-none tabular-nums">{stats.points}</p>
        <p className="mt-1 text-[10px] font-semibold tracking-[0.25em] text-white/60">POINTS</p>
      </div>
      <Avatar name={childName(stats.child)} className="size-14 text-base ring-2 ring-white/40" />
    </div>
    <p className="text-xs text-white/70">
      {stats.level.emoji} {stats.level.name} · {stats.percent}% · {stats.streak} streak
    </p>
    <div className="mt-auto flex flex-wrap-reverse items-end justify-between gap-2">
      <p className="font-display text-3xl leading-[0.95] tracking-wide wrap-anywhere uppercase">
        {stats.child.firstName}
        <br />
        {stats.child.surname}
      </p>
      <Trophy place={place} className="ml-auto h-20 w-16 shrink-0 drop-shadow-xl" />
    </div>
  </div>
);

export default ChildPodium;
