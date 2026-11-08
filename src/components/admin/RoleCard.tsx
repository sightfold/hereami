import { Lock } from "lucide-react";
import Badge from "@/components/ui/Badge";
import Button from "@/components/ui/Button";
import Card from "@/components/ui/Card";
import { adminRoleId, permissionList } from "@/constants/permissions";
import { peopleCount } from "@/utils/count";
import type { OrgRole } from "@/utils/types";

type RoleCardProps = {
  role: OrgRole;
  people: number;
  onEdit: () => void;
  onRemove: () => void;
};

const summaryOf = (role: OrgRole) => {
  if (role.id === adminRoleId) return "Full access to everything in this organization.";
  const labels = permissionList
    .filter(({ id }) => role.permissions.includes(id))
    .map(({ label }) => label);
  return labels.length > 0 ? labels.join(", ") : "Member screens only: check-in, history, duties.";
};

const RoleCard = ({ role, people, onEdit, onRemove }: RoleCardProps) => {
  const isLocked = role.id === adminRoleId;

  return (
    <Card className="flex flex-col gap-3">
      <div className="flex items-start justify-between gap-3">
        <div className="min-w-0">
          <h2 className="truncate font-semibold">{role.name}</h2>
          <p className="text-xs text-muted">{peopleCount(people)}</p>
        </div>
        {isLocked && (
          <Badge icon={<Lock className="size-3" />} tone="neutral">
            Locked
          </Badge>
        )}
      </div>
      <p className="flex-1 text-sm text-muted">{summaryOf(role)}</p>
      {!isLocked && (
        <div className="flex gap-2">
          <Button variant="outline" size="sm" onClick={onEdit}>
            Edit
          </Button>
          {!role.isSystem && (
            <Button variant="ghost" size="sm" onClick={onRemove}>
              Delete
            </Button>
          )}
        </div>
      )}
    </Card>
  );
};

export default RoleCard;
