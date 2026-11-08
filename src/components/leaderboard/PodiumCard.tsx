import StatTrio from "@/components/leaderboard/StatTrio";
import Trophy, { type Place } from "@/components/leaderboard/Trophy";
import Avatar from "@/components/ui/Avatar";
import { cn } from "@/utils/cn";
import type { Standing } from "@/utils/points";

export const podiumThemes: Record<Place, string> = {
  1: "from-orange-500/90 via-orange-900 to-stone-950 ring-orange-300/40 md:order-2 md:min-h-96",
  2: "from-zinc-400/70 via-zinc-800 to-zinc-950 ring-zinc-200/25 md:order-1 md:min-h-80",
  3: "from-rose-700/90 via-rose-950 to-stone-950 ring-rose-200/25 md:order-3 md:min-h-80",
};

type PodiumCardProps = { standing: Standing; isMe: boolean };

const PodiumCard = ({ standing, isMe }: PodiumCardProps) => {
  const { user, points } = standing;
  const place = standing.rank as Place;
  const [first, ...rest] = user.name.split(" ");
  return (
    <div
      className={cn(
        "relative flex min-h-64 flex-col gap-4 overflow-hidden rounded-3xl bg-linear-to-b p-5 text-white shadow-2xl ring-1",
        podiumThemes[place],
        isMe && "ring-2 ring-amber-300",
      )}
    >
      <div className="flex items-start justify-between gap-3">
        <div>
          <p className="font-display text-5xl leading-none tabular-nums">{points}</p>
          <p className="mt-1 text-[10px] font-semibold tracking-[0.25em] text-white/60">SCORE</p>
        </div>
        <Avatar
          name={user.name}
          src={user.photo}
          className="size-16 text-base ring-2 ring-white/40"
        />
      </div>
      <StatTrio standing={standing} isStacked />
      <div className="mt-auto flex items-end justify-between gap-2">
        <p className="min-w-0 font-display text-3xl leading-[0.95] tracking-wide uppercase">
          {first}
          <br />
          {rest.join(" ")}
          {isMe && (
            <span className="mt-1 block font-sans text-xs tracking-normal text-amber-300 normal-case">
              That&apos;s you
            </span>
          )}
        </p>
        <Trophy place={place} className="-mr-2 -mb-2 h-28 w-24 shrink-0 drop-shadow-xl" />
      </div>
    </div>
  );
};

export default PodiumCard;
