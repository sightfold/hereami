import { CheckCircle2, Clock, Sparkles } from "lucide-react";
import Badge from "@/components/ui/Badge";
import Card from "@/components/ui/Card";
import StatusBadge from "@/components/ui/StatusBadge";
import { formatClock } from "@/utils/date";
import { cn } from "@/utils/cn";
import { pointsFor } from "@/utils/points";
import type { Attendance, Service } from "@/utils/types";

const methodLabels: Record<Attendance["method"], string> = {
  gps: "Verified by GPS",
  qr: "Verified by check-in code",
  override: "Approved by Team Lead",
};

type CheckedInCardProps = { record: Attendance; service: Service };

const CheckedInCard = ({ record, service }: CheckedInCardProps) => {
  const isLate = record.status === "late";
  const Icon = isLate ? Clock : CheckCircle2;

  return (
    <Card className="flex flex-col items-center gap-3 py-8 text-center">
      <span
        className={cn(
          "flex size-20 items-center justify-center rounded-full",
          isLate ? "bg-warn-soft text-warn" : "bg-ok-soft text-ok",
        )}
      >
        <Icon className="size-10" />
      </span>
      <div>
        <p className="text-lg font-semibold">You&apos;re checked in</p>
        <p className="text-sm text-muted">at {formatClock(record.time)}</p>
      </div>
      <div className="flex gap-2">
        <StatusBadge status={record.status} />
        <Badge tone="gold" icon={<Sparkles className="size-3" />}>
          +{pointsFor(record, service)} pts
        </Badge>
      </div>
      <p className="text-xs text-muted">
        {methodLabels[record.method]}
        {record.distM !== undefined && ` · ${record.distM} m from church`}
      </p>
    </Card>
  );
};

export default CheckedInCard;
