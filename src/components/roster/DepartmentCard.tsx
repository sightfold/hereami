import SlotRow from "@/components/roster/SlotRow";
import WholeTeam from "@/components/roster/WholeTeam";
import Card from "@/components/ui/Card";
import type { Assignment, Conflict, Department, User } from "@/utils/types";

type DepartmentCardProps = {
  department: Department;
  slots: Assignment[];
  users: User[];
  conflicts: Conflict[];
  onPick: (role: string, userId: string) => void;
  onToggleLead: (slot: Assignment) => void;
};

const DepartmentCard = ({
  department,
  slots,
  users,
  conflicts,
  onPick,
  onToggleLead,
}: DepartmentCardProps) => {
  const members = users.filter((user) => user.departments.includes(department.id));
  const others = users.filter((user) => !user.departments.includes(department.id));
  const flaggedIds = new Set(
    conflicts.filter((item) => item.kind !== "noLead").map((item) => item.userId),
  );

  return (
    <Card>
      <h3 className="mb-3 font-semibold">{department.name}</h3>
      {department.roles.length === 0 && <WholeTeam members={members} />}
      <div className="flex flex-col gap-2 empty:hidden">
        {department.roles.map((role) => {
          const slot = slots.find((item) => item.role === role);
          return (
            <SlotRow
              key={role}
              role={role}
              slot={slot}
              members={members}
              others={others}
              hasIssue={!!slot && flaggedIds.has(slot.userId)}
              onPick={(userId) => onPick(role, userId)}
              onToggleLead={() => slot && onToggleLead(slot)}
            />
          );
        })}
      </div>
    </Card>
  );
};

export default DepartmentCard;
