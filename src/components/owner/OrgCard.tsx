import { Eye, Palette, ShieldCheck } from "lucide-react";
import OrgMark from "@/components/layout/OrgMark";
import Badge from "@/components/ui/Badge";
import Button from "@/components/ui/Button";
import Card from "@/components/ui/Card";
import { countOf } from "@/utils/count";
import type { Organization, OrgStats, OrgStatus } from "@/utils/types";

const statusTone = { active: "ok", suspended: "bad" } as const;
const statusLabel: Record<OrgStatus, string> = {
  active: "Active",
  suspended: "Suspended",
};

type OrgCardProps = {
  org: Organization;
  stats?: OrgStats;
  onFullAccess: () => void;
  onViewAs: () => void;
  onCustomize: () => void;
  onStatus: (status: OrgStatus) => void;
};

const OrgCard = ({ org, stats, onFullAccess, onViewAs, onCustomize, onStatus }: OrgCardProps) => (
  <Card className="flex flex-col gap-3">
    <div className="flex items-start gap-3">
      <OrgMark name={org.name} logo={org.logo} color={org.brandColor} className="size-11 text-lg" />
      <div className="min-w-0 flex-1">
        <h3 className="truncate font-semibold">{org.name}</h3>
        <p className="truncate text-xs text-muted">
          {org.contactName} · {org.contactEmail}
        </p>
      </div>
      <Badge tone={statusTone[org.status]} dot>
        {statusLabel[org.status]}
      </Badge>
    </div>
    <p className="text-sm text-muted">
      {countOf(stats?.members ?? 0, "member")} · {countOf(stats?.admins ?? 0, "admin")}
    </p>
    <div className="flex flex-wrap gap-2">
      <Button
        variant="outline"
        size="sm"
        startIcon={<ShieldCheck className="size-4" />}
        onClick={onFullAccess}
      >
        Full access
      </Button>
      <Button variant="outline" size="sm" startIcon={<Eye className="size-4" />} onClick={onViewAs}>
        View as…
      </Button>
      <Button
        variant="outline"
        size="sm"
        startIcon={<Palette className="size-4" />}
        onClick={onCustomize}
      >
        Customize
      </Button>
      {org.status === "active" ? (
        <Button variant="ghost" size="sm" onClick={() => onStatus("suspended")}>
          Suspend
        </Button>
      ) : (
        <Button size="sm" onClick={() => onStatus("active")}>
          Reactivate
        </Button>
      )}
    </div>
  </Card>
);

export default OrgCard;
