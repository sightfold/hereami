"use client";

import { CalendarDays, Star, Users } from "lucide-react";
import Badge from "@/components/ui/Badge";
import Card from "@/components/ui/Card";
import Empty from "@/components/ui/Empty";
import { useAppSelector } from "@/store";
import {
  selectAssignments,
  selectCurrentUser,
  selectDepartmentMap,
  selectDepartments,
  selectUpcoming,
} from "@/store/selectors";
import { formatDay } from "@/utils/date";
import type { Department } from "@/utils/types";

const listNames = (items: Department[]) =>
  new Intl.ListFormat("en").format(items.map((item) => item.name));

const DutiesPage = () => {
  const user = useAppSelector(selectCurrentUser);
  const upcoming = useAppSelector(selectUpcoming);
  const assignments = useAppSelector(selectAssignments);
  const departmentMap = useAppSelector(selectDepartmentMap);
  const departments = useAppSelector(selectDepartments);

  const duties = upcoming.flatMap((service) =>
    assignments
      .filter((slot) => slot.serviceId === service.id && slot.userId === user?.id)
      .map((slot) => ({ slot, service })),
  );
  const teams = departments.filter(
    (item) => item.roles.length === 0 && user?.departments.includes(item.id),
  );

  return (
    <div className="flex flex-col gap-4">
      <h1 className="pt-2 font-serif text-4xl tracking-tight">My duties</h1>
      {teams.length > 0 && (
        <Card className="flex items-start gap-3">
          <Users className="mt-0.5 size-4 shrink-0 text-muted" />
          <p className="text-sm">
            You serve with <span className="font-medium">{listNames(teams)}</span> at every service.
            Check in when you arrive.
          </p>
        </Card>
      )}
      {duties.length === 0 && teams.length === 0 && (
        <Empty icon={CalendarDays} text="You have no upcoming assignments." />
      )}
      {duties.map(({ slot, service }) => (
        <Card key={slot.id} className="flex flex-col gap-2">
          <div className="flex items-center justify-between">
            <p className="font-medium">{formatDay(service.date)}</p>
            {slot.isLead && (
              <Badge tone="gold" icon={<Star className="size-3" />}>
                Shift lead
              </Badge>
            )}
          </div>
          <p className="text-sm">
            {departmentMap.get(slot.departmentId)?.name ?? "Department"} · {slot.role}
          </p>
          <p className="font-mono text-xs text-muted">
            {service.name} · Call time {service.callTime} · Service {service.startTime}
          </p>
        </Card>
      ))}
    </div>
  );
};

export default DutiesPage;
