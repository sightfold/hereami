import type { ReactNode } from "react";
import { differenceInMinutes, parseISO } from "date-fns";
import Avatar from "@/components/ui/Avatar";
import PaperSheet from "@/components/ui/PaperSheet";
import Sheet from "@/components/ui/Sheet";
import StatusBadge from "@/components/ui/StatusBadge";
import { methodLabels } from "@/constants/attendance";
import { useAppSelector } from "@/store";
import { selectDepartmentNames } from "@/store/selectors";
import { formatDay, formatTime, toDateTime } from "@/utils/date";
import { pointsFor } from "@/utils/points";
import type { Attendance, Service, User } from "@/utils/types";

type AttendanceDetailProps = {
  record: Attendance;
  userMap: Map<string, User>;
  serviceMap: Map<string, Service>;
  onClose: () => void;
};

const timingOf = (record: Attendance, service: Service) => {
  const minutes = differenceInMinutes(
    parseISO(record.time),
    toDateTime(service.date, service.startTime),
  );
  if (minutes === 0) return "At the start";
  return `${Math.abs(minutes)} min ${minutes < 0 ? "before" : "after"} start`;
};

const Row = ({ label, children }: { label: string; children: ReactNode }) => (
  <div className="flex items-baseline justify-between gap-6 border-b border-rule-blue px-4 py-2 last:border-b-0">
    <dt className="shrink-0 text-muted">{label}</dt>
    <dd className="text-right">{children}</dd>
  </div>
);

const AttendanceDetail = ({ record, userMap, serviceMap, onClose }: AttendanceDetailProps) => {
  const departmentNames = useAppSelector(selectDepartmentNames);
  const user = userMap.get(record.userId);
  const service = serviceMap.get(record.serviceId);
  const isManual = record.method === "override";

  return (
    <Sheet open title="Attendance entry" onClose={onClose}>
      <PaperSheet title={service?.name ?? "Service"} meta={service && formatDay(service.date)}>
        <div className="flex items-center gap-3 border-b border-rule-blue px-4 py-3">
          <Avatar name={user?.name ?? "?"} src={user?.photo} className="size-10" />
          <div className="min-w-0">
            <p className="text-lg leading-tight">{user?.name}</p>
            <p className="text-sm text-muted">{user && departmentNames(user.departments)}</p>
          </div>
        </div>
        <dl>
          <Row label="Status">
            <StatusBadge status={record.status} />
          </Row>
          <Row label="Arrived">{formatTime(record.time)}</Row>
          {service && <Row label="Timing">{timingOf(record, service)}</Row>}
          {service && <Row label="Call time">{service.callTime}</Row>}
          {service && <Row label="Service starts">{service.startTime}</Row>}
          <Row label="Method">{methodLabels[record.method]}</Row>
          {record.distM !== undefined && <Row label="Distance">{record.distM} m from church</Row>}
          {isManual && (
            <Row label="Approved by">{userMap.get(record.approvedBy ?? "")?.name ?? "Admin"}</Row>
          )}
          {isManual && <Row label="Reason">{record.reason ?? "—"}</Row>}
          {service && <Row label="Points">+{pointsFor(record, service)}</Row>}
        </dl>
      </PaperSheet>
    </Sheet>
  );
};

export default AttendanceDetail;
