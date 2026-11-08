"use client";

import Link from "next/link";
import { ShieldCheck, UsersRound } from "lucide-react";
import AwayGrid from "@/components/admin/AwayGrid";
import ChildrenSummary from "@/components/children/ChildrenSummary";
import DepartmentProgress from "@/components/admin/DepartmentProgress";
import TopCard from "@/components/leaderboard/TopCard";
import Greeting from "@/components/layout/Greeting";
import PersonCard from "@/components/people/PersonCard";
import { statusPills } from "@/components/people/statusPills";
import Button from "@/components/ui/Button";
import Card from "@/components/ui/Card";
import Empty from "@/components/ui/Empty";
import KpiStrip from "@/components/ui/KpiStrip";
import MiniBars from "@/components/ui/MiniBars";
import routePath from "@/constants/route.json";
import { useAppSelector } from "@/store";
import {
  selectCurrentUser,
  selectDepartmentNames,
  selectDepartments,
  selectPermissions,
  selectRecords,
  selectServices,
  selectToday,
  selectTodayService,
  selectUserMap,
  selectUsers,
} from "@/store/selectors";
import { formatDay, formatTime } from "@/utils/date";
import { rankStandings, servicesIn } from "@/utils/points";
import { changeOf, countStatus, onTimeShare } from "@/utils/stats";

const DashboardPage = () => {
  const me = useAppSelector(selectCurrentUser);
  const service = useAppSelector(selectTodayService);
  const services = useAppSelector(selectServices);
  const users = useAppSelector(selectUsers);
  const userMap = useAppSelector(selectUserMap);
  const records = useAppSelector(selectRecords);
  const departments = useAppSelector(selectDepartments);
  const departmentNames = useAppSelector(selectDepartmentNames);
  const permissions = useAppSelector(selectPermissions);

  const today = useAppSelector(selectToday);
  const pastServices = services.filter((item) => item.date <= today);
  const recordsOf = (serviceId?: string) =>
    records.filter((record) => record.serviceId === serviceId);
  const todayRecords = recordsOf(service?.id).toSorted((a, b) => a.time.localeCompare(b.time));
  const lastRecords = recordsOf(pastServices.findLast((item) => item.date < today)?.id);
  const counts = countStatus(todayRecords);
  const presentIds = new Set(todayRecords.map((record) => record.userId));
  const away = users.filter((user) => !presentIds.has(user.id));
  const [top] = rankStandings(users, servicesIn(services, "month", today), records, today);

  const kpis = [
    {
      label: "Checked in",
      value: todayRecords.length,
      unit: `/${users.length}`,
      delta: changeOf(todayRecords.length, lastRecords.length),
      caption: "vs last service",
      visual: <MiniBars values={pastServices.slice(-8).map((item) => recordsOf(item.id).length)} />,
    },
    {
      label: "On-time rate",
      value: onTimeShare(todayRecords),
      unit: "%",
      delta: changeOf(onTimeShare(todayRecords), onTimeShare(lastRecords)),
      caption: "vs last service",
    },
    { label: "Late", value: counts.late, caption: "after the grace period" },
    { label: "Manual", value: counts.override, caption: "approved by a lead" },
  ];

  return (
    <div className="mx-auto max-w-6xl">
      <Greeting
        name={me?.name}
        subtitle={
          service
            ? `${service.name} · ${formatDay(service.date)} · starts ${service.startTime}`
            : "No service today"
        }
        action={
          permissions.includes("attendance.override") && (
            <Link href={routePath.Admin.Override}>
              <Button size="sm">
                <ShieldCheck className="size-4" /> Manual check-in
              </Button>
            </Link>
          )
        }
      />
      <KpiStrip items={kpis} />
      <div className="mt-6 grid gap-6 lg:grid-cols-3">
        <Card className="lg:col-span-2">
          <div className="mb-4 flex items-center justify-between">
            <h2 className="text-sm font-semibold">Checked in today</h2>
            <span className="font-mono text-xs text-muted">{todayRecords.length} in</span>
          </div>
          {todayRecords.length === 0 ? (
            <Empty icon={UsersRound} text="Nobody has checked in yet." />
          ) : (
            <div className="grid grid-cols-3 gap-3 sm:grid-cols-4 xl:grid-cols-5">
              {todayRecords.map((record) => {
                const user = userMap.get(record.userId);
                return (
                  <PersonCard
                    key={record.id}
                    name={user?.name ?? "Unknown"}
                    photo={user?.photo}
                    subtitle={user ? departmentNames(user.departments) : ""}
                    pill={statusPills[record.status]}
                    tag={formatTime(record.time)}
                  />
                );
              })}
            </div>
          )}
        </Card>
        <div className="flex flex-col gap-6">
          {top && top.points > 0 && <TopCard standing={top} />}
          <Card>
            <h2 className="mb-4 text-sm font-semibold">By department</h2>
            <DepartmentProgress departments={departments} users={users} records={todayRecords} />
          </Card>
          {permissions.includes("children.view") && <ChildrenSummary />}
          <AwayGrid users={away} />
        </div>
      </div>
    </div>
  );
};

export default DashboardPage;
