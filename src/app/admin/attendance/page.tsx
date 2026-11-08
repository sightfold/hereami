"use client";

import { useState } from "react";
import AttendanceTable from "@/components/admin/AttendanceTable";
import PageHeader from "@/components/layout/PageHeader";
import KpiStrip from "@/components/ui/KpiStrip";
import PaperSheet from "@/components/ui/PaperSheet";
import Select from "@/components/ui/Select";
import { useAppSelector } from "@/store";
import {
  selectDepartments,
  selectHeldServices,
  selectRecords,
  selectServiceMap,
  selectUserMap,
} from "@/store/selectors";
import { formatDay } from "@/utils/date";
import { isEarly } from "@/utils/points";
import { countStatus, newestFirst, onTimeShare } from "@/utils/stats";

const anyValue = "all";

const statusOptions = [
  { value: "onTime", label: "On time" },
  { value: "late", label: "Late" },
  { value: "override", label: "Admin Verified" },
];

const AttendancePage = () => {
  const records = useAppSelector(selectRecords);
  const userMap = useAppSelector(selectUserMap);
  const serviceMap = useAppSelector(selectServiceMap);
  const departments = useAppSelector(selectDepartments);
  const pastServices = useAppSelector(selectHeldServices).toReversed();

  const [serviceId, setServiceId] = useState(anyValue);
  const [departmentId, setDepartmentId] = useState(anyValue);
  const [status, setStatus] = useState(anyValue);

  const shown = records
    .filter((record) => serviceId === anyValue || record.serviceId === serviceId)
    .filter((record) => status === anyValue || record.status === status)
    .filter(
      (record) =>
        departmentId === anyValue || userMap.get(record.userId)?.departments.includes(departmentId),
    )
    .toSorted(newestFirst);
  const counts = countStatus(shown);
  const earlyCount = shown.filter((record) => {
    const service = serviceMap.get(record.serviceId);
    return !!service && isEarly(record, service);
  }).length;

  const kpis = [
    { label: "Records", value: shown.length, caption: "matching filters" },
    { label: "On-time rate", value: onTimeShare(shown), unit: "%", caption: "incl. verified" },
    { label: "Early birds", value: earlyCount, caption: "30+ min before service" },
    { label: "Late", value: counts.late, caption: "after the grace period" },
  ];

  return (
    <div className="mx-auto max-w-6xl">
      <PageHeader title="Attendance" subtitle="Every check-in, with how early people arrived." />
      <div className="mb-4">
        <KpiStrip items={kpis} />
      </div>
      <div className="mb-4 grid gap-3 sm:grid-cols-3">
        <Select
          value={serviceId}
          onChange={setServiceId}
          aria-label="Service"
          options={[
            { value: anyValue, label: "All services" },
            ...pastServices.map((service) => ({
              value: service.id,
              label: formatDay(service.date),
            })),
          ]}
        />
        <Select
          value={departmentId}
          onChange={setDepartmentId}
          aria-label="Department"
          options={[
            { value: anyValue, label: "All departments" },
            ...departments.map((item) => ({ value: item.id, label: item.name })),
          ]}
        />
        <Select
          value={status}
          onChange={setStatus}
          aria-label="Status"
          options={[{ value: anyValue, label: "All statuses" }, ...statusOptions]}
        />
      </div>
      <PaperSheet title="Attendance register" meta={`${shown.length} entries`}>
        <AttendanceTable records={shown} userMap={userMap} serviceMap={serviceMap} />
      </PaperSheet>
    </div>
  );
};

export default AttendancePage;
