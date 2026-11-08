"use client";

import { History } from "lucide-react";
import Badge from "@/components/ui/Badge";
import Empty from "@/components/ui/Empty";
import KpiStrip from "@/components/ui/KpiStrip";
import PaperSheet from "@/components/ui/PaperSheet";
import StatusBadge from "@/components/ui/StatusBadge";
import { useAppSelector } from "@/store";
import {
  selectCurrentUser,
  selectRecords,
  selectServices,
  selectStandings,
  selectToday,
} from "@/store/selectors";
import { formatDay, formatTime } from "@/utils/date";
import { pointsFor } from "@/utils/points";
import { countStatus, percent } from "@/utils/stats";
import type { Service } from "@/utils/types";

const HistoryPage = () => {
  const user = useAppSelector(selectCurrentUser);
  const services = useAppSelector(selectServices);
  const records = useAppSelector(selectRecords);
  const standing = useAppSelector(selectStandings).find((item) => item.user.id === user?.id);

  const today = useAppSelector(selectToday);
  const pastServices = services.filter((service) => service.date <= today).reverse();
  const myRecords = records.filter((record) => record.userId === user?.id);
  const counts = countStatus(myRecords);
  const recordFor = (serviceId: string) =>
    myRecords.find((record) => record.serviceId === serviceId);
  const counted = pastServices.filter((service) => service.date < today || recordFor(service.id));

  const kpis = [
    {
      label: "Attended",
      value: myRecords.length,
      unit: `/${counted.length}`,
      caption: percent(myRecords.length, counted.length),
    },
    {
      label: "On time",
      value: percent(counts.onTime + counts.override, myRecords.length),
      caption: `${counts.late} late`,
    },
    { label: "Points", value: standing?.points ?? 0, caption: `Rank #${standing?.rank ?? "—"}` },
    { label: "Streak", value: standing?.streak ?? 0, caption: `Best ${standing?.bestStreak ?? 0}` },
  ];

  const trailFor = (service: Service) => {
    const record = recordFor(service.id);
    if (record)
      return (
        <div className="flex items-center gap-3">
          <StatusBadge status={record.status} />
          <span className="w-8 text-right font-mono text-xs text-gold">
            +{pointsFor(record, service)}
          </span>
        </div>
      );
    return service.date === today ? <Badge>Today</Badge> : <Badge tone="bad">Missed</Badge>;
  };

  return (
    <div className="flex flex-col gap-4 pt-2">
      <h1 className="font-serif text-4xl tracking-tight">My attendance</h1>
      <KpiStrip items={kpis} />
      {pastServices.length === 0 ? (
        <Empty icon={History} text="No services yet." />
      ) : (
        <PaperSheet title="My register">
          {pastServices.map((service) => {
            const record = recordFor(service.id);
            return (
              <div
                key={service.id}
                className="flex items-center justify-between gap-3 border-b border-rule-blue px-4 py-2.5"
              >
                <div>
                  <p className="font-serif text-lg leading-tight">{formatDay(service.date)}</p>
                  <p className="text-xs text-muted">
                    {record ? `Arrived ${formatTime(record.time)}` : service.name}
                  </p>
                </div>
                {trailFor(service)}
              </div>
            );
          })}
        </PaperSheet>
      )}
    </div>
  );
};

export default HistoryPage;
