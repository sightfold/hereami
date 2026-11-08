import type { Ref } from "react";
import { formatDay } from "@/utils/date";
import type { Assignment, Department, Service, User } from "@/utils/types";

type RosterSheetProps = {
  orgName: string;
  service: Service;
  slots: Assignment[];
  userMap: Map<string, User>;
  departments: Department[];
  ref?: Ref<HTMLDivElement>;
};

const rules = [
  "Arrive by call time and check in.",
  "Shift leads brief their department 15 minutes before service.",
  "Can't make it? Tell your shift lead at least 48 hours ahead.",
];

const teamNames = (userMap: Map<string, User>, departmentId: string) =>
  [...userMap.values()]
    .filter((user) => user.departments.includes(departmentId))
    .map((user) => user.name)
    .join(", ") || "—";

const RosterSheet = ({ orgName, service, slots, userMap, departments, ref }: RosterSheetProps) => (
  <div ref={ref} className="w-[800px] bg-white p-10 font-sans text-zinc-900">
    <div className="mb-6 flex items-end justify-between border-b-4 border-zinc-900 pb-4">
      <div>
        <h1 className="font-serif text-5xl">{orgName}</h1>
        <p className="mt-1 text-sm font-semibold uppercase tracking-widest text-zinc-500">
          Duty Roster
        </p>
      </div>
      <div className="text-right text-sm">
        <p className="font-semibold">{formatDay(service.date)}</p>
        <p className="text-zinc-500">
          {service.name} · Call {service.callTime} · Start {service.startTime}
        </p>
      </div>
    </div>
    <div className="grid grid-cols-2 gap-5">
      {departments.map((department) => (
        <div key={department.id} className="rounded-lg border border-zinc-200">
          <p className="rounded-t-lg bg-zinc-900 px-4 py-2 font-semibold text-white">
            {department.name}
          </p>
          {department.roles.length === 0 && (
            <div className="flex justify-between gap-4 border-t border-zinc-100 px-4 py-2 text-sm">
              <span className="shrink-0 text-zinc-500">Everyone</span>
              <span className="text-right font-medium">{teamNames(userMap, department.id)}</span>
            </div>
          )}
          {department.roles.map((role) => {
            const slot = slots.find(
              (item) => item.departmentId === department.id && item.role === role,
            );
            return (
              <div
                key={role}
                className="flex justify-between border-t border-zinc-100 px-4 py-2 text-sm"
              >
                <span className="text-zinc-500">{role}</span>
                <span className="font-medium">
                  {slot ? userMap.get(slot.userId)?.name : "—"}
                  {slot?.isLead && " ★"}
                </span>
              </div>
            );
          })}
        </div>
      ))}
    </div>
    <div className="mt-6 rounded-lg bg-zinc-50 p-4 text-xs text-zinc-600">
      <p className="mb-1 font-semibold text-zinc-800">Shift rules · ★ = shift lead</p>
      <ul className="list-inside list-disc space-y-0.5">
        {rules.map((rule) => (
          <li key={rule}>{rule}</li>
        ))}
      </ul>
    </div>
  </div>
);

export default RosterSheet;
