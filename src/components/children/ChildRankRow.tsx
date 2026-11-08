import Avatar from "@/components/ui/Avatar";
import Badge from "@/components/ui/Badge";
import { streakBadgeAt } from "@/constants/children";
import { childName } from "@/utils/children";
import type { ChildStats } from "@/utils/childScore";

const ChildRankRow = ({ stats, rank }: { stats: ChildStats; rank: number }) => (
  <li className="flex items-center gap-3 px-3 py-2.5">
    <span className="w-6 shrink-0 text-center font-mono text-xs text-muted">{rank}</span>
    <Avatar name={childName(stats.child)} />
    <div className="min-w-0 flex-1">
      <p className="truncate text-sm font-medium">{childName(stats.child)}</p>
      <p className="truncate text-xs text-muted">
        {stats.level.emoji} {stats.level.name} · {stats.attended}/{stats.held} ({stats.percent}%)
      </p>
    </div>
    {stats.isPerfect && <Badge tone="gold">Perfect</Badge>}
    {stats.isOnStreak && (
      <span title={`${streakBadgeAt}+ in a row`}>
        <Badge tone="brand">🔥 {stats.streak}</Badge>
      </span>
    )}
    <span className="w-10 shrink-0 text-right text-sm font-semibold tabular-nums">
      {stats.points}
    </span>
  </li>
);

export default ChildRankRow;
