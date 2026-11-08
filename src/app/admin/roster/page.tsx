"use client";

import { useRef, useState } from "react";
import { CalendarX, Star } from "lucide-react";
import ConflictList from "@/components/roster/ConflictList";
import DepartmentCard from "@/components/roster/DepartmentCard";
import ExportMenu from "@/components/roster/ExportMenu";
import RosterSheet from "@/components/roster/RosterSheet";
import PageHeader from "@/components/layout/PageHeader";
import Empty from "@/components/ui/Empty";
import { useRunAction } from "@/components/ui/ErrorNotice";
import Segmented from "@/components/ui/Segmented";
import { useAppDispatch, useAppSelector } from "@/store";
import {
  selectAssignments,
  selectDepartments,
  selectOrgName,
  selectUpcoming,
  selectUserMap,
  selectUsers,
} from "@/store/selectors";
import { addAssignment, removeAssignment, updateAssignment } from "@/store/thunks";
import { formatShortDay } from "@/utils/date";
import { findConflicts } from "@/utils/roster";
import type { Assignment } from "@/utils/types";

const RosterPage = () => {
  const dispatch = useAppDispatch();
  const run = useRunAction();
  const upcoming = useAppSelector(selectUpcoming);
  const assignments = useAppSelector(selectAssignments);
  const users = useAppSelector(selectUsers);
  const userMap = useAppSelector(selectUserMap);
  const departments = useAppSelector(selectDepartments);
  const orgName = useAppSelector(selectOrgName);
  const sheetRef = useRef<HTMLDivElement>(null);
  const [pickedId, setPickedId] = useState<string | null>(null);

  const service = upcoming.find((item) => item.id === pickedId) ?? upcoming[0];
  if (!service) return <Empty icon={CalendarX} text="No upcoming services to roster." />;

  const slots = assignments.filter((slot) => slot.serviceId === service.id);
  const conflicts = findConflicts(slots, users, departments);

  const handlePick = (departmentId: string, role: string, userId: string) => {
    const slot = slots.find((item) => item.departmentId === departmentId && item.role === role);
    if (!userId && slot) run(dispatch(removeAssignment(slot.id)));
    else if (slot) run(dispatch(updateAssignment({ ...slot, userId })));
    else if (userId)
      run(
        dispatch(
          addAssignment({ serviceId: service.id, departmentId, role, userId, isLead: false }),
        ),
      );
  };

  const handleToggleLead = (slot: Assignment) => {
    run(dispatch(updateAssignment({ ...slot, isLead: !slot.isLead })));
  };

  return (
    <div className="mx-auto max-w-6xl">
      <PageHeader
        title="Duty roster"
        subtitle="Assign each role and star one shift lead per department."
        action={<ExportMenu sheetRef={sheetRef} fileName={`roster-${service.date}`} />}
      />
      <div className="mb-4 overflow-x-auto pb-1">
        <Segmented
          label="Service"
          value={service.id}
          options={upcoming.map((item) => ({ value: item.id, label: formatShortDay(item.date) }))}
          onChange={setPickedId}
        />
      </div>
      <p className="mb-4 flex items-start gap-2 rounded-xl bg-gold-soft px-3 py-2 text-sm">
        <Star className="mt-0.5 size-4 shrink-0 fill-current text-gold" />
        <span>
          <span className="font-medium">Star = shift lead.</span> The shift lead briefs their
          department before service and is the go-to person if something goes wrong. Tap the star
          next to a name to pick one lead for each department.
        </span>
      </p>
      <div className="mb-4">
        <ConflictList conflicts={conflicts} />
      </div>
      <div className="grid gap-4 md:grid-cols-2">
        {departments.map((department) => (
          <DepartmentCard
            key={department.id}
            department={department}
            slots={slots.filter((slot) => slot.departmentId === department.id)}
            users={users}
            conflicts={conflicts}
            onPick={(role, userId) => handlePick(department.id, role, userId)}
            onToggleLead={handleToggleLead}
          />
        ))}
      </div>
      <div aria-hidden className="pointer-events-none fixed top-0 -left-[9999px]">
        <RosterSheet
          ref={sheetRef}
          orgName={orgName}
          service={service}
          slots={slots}
          userMap={userMap}
          departments={departments}
        />
      </div>
    </div>
  );
};

export default RosterPage;
