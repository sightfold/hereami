import { ShieldCheck } from "lucide-react";
import Badge from "@/components/ui/Badge";
import type { AttendanceStatus, Tone } from "@/utils/types";

export const statusLooks: Record<AttendanceStatus, { tone: Tone; label: string }> = {
  onTime: { tone: "ok", label: "On time" },
  late: { tone: "warn", label: "Late" },
  override: { tone: "brand", label: "Admin Verified" },
};

const StatusBadge = ({ status }: { status: AttendanceStatus }) => (
  <Badge
    tone={statusLooks[status].tone}
    dot={status !== "override"}
    icon={<ShieldCheck className="size-3" />}
  >
    {statusLooks[status].label}
  </Badge>
);

export default StatusBadge;
