"use client";

import { useState } from "react";
import Table from "@mui/material/Table";
import TableBody from "@mui/material/TableBody";
import TableCell from "@mui/material/TableCell";
import TableContainer from "@mui/material/TableContainer";
import TableHead from "@mui/material/TableHead";
import TablePagination from "@mui/material/TablePagination";
import TableRow from "@mui/material/TableRow";
import { ClipboardList } from "lucide-react";
import AttendanceDetail from "@/components/admin/AttendanceDetail";
import { methodLabels } from "@/constants/attendance";
import Avatar from "@/components/ui/Avatar";
import Empty from "@/components/ui/Empty";
import StatusBadge from "@/components/ui/StatusBadge";
import { useAppSelector } from "@/store";
import { selectDepartmentNames } from "@/store/selectors";
import { formatShortDay, formatTime } from "@/utils/date";
import { pointsFor } from "@/utils/points";
import type { Attendance, Service, User } from "@/utils/types";

type AttendanceTableProps = {
  records: Attendance[];
  userMap: Map<string, User>;
  serviceMap: Map<string, Service>;
};

const headers = ["Member", "Service", "Arrived", "Method", "Status", "Points"];
const pageSize = 10;
const cellClass = "border-rule-blue px-3 py-2.5";
const inkClass = "text-base whitespace-nowrap";

const AttendanceTable = ({ records, userMap, serviceMap }: AttendanceTableProps) => {
  const [page, setPage] = useState(0);
  const [selected, setSelected] = useState<Attendance | null>(null);
  const departmentNames = useAppSelector(selectDepartmentNames);
  const lastPage = Math.max(0, Math.ceil(records.length / pageSize) - 1);
  const current = Math.min(page, lastPage);

  if (records.length === 0)
    return <Empty icon={ClipboardList} text="No records match these filters." />;

  return (
    <>
      <TableContainer>
        <Table size="small">
          <TableHead>
            <TableRow>
              {headers.map((header) => (
                <TableCell key={header} className={`${cellClass} text-sm text-muted`}>
                  {header}
                </TableCell>
              ))}
            </TableRow>
          </TableHead>
          <TableBody>
            {records.slice(current * pageSize, (current + 1) * pageSize).map((record) => {
              const user = userMap.get(record.userId);
              const service = serviceMap.get(record.serviceId);
              return (
                <TableRow
                  key={record.id}
                  hover
                  tabIndex={0}
                  aria-haspopup="dialog"
                  className="cursor-pointer"
                  onClick={() => setSelected(record)}
                  onKeyDown={(event) => {
                    if (event.key !== "Enter" && event.key !== " ") return;
                    event.preventDefault();
                    setSelected(record);
                  }}
                >
                  <TableCell className={cellClass}>
                    <div className="flex items-center gap-2.5">
                      <Avatar name={user?.name ?? "?"} src={user?.photo} className="size-8" />
                      <div>
                        <p className="text-lg leading-tight whitespace-nowrap">{user?.name}</p>
                        <p className="text-sm text-muted">
                          {user && departmentNames(user.departments)}
                        </p>
                      </div>
                    </div>
                  </TableCell>
                  <TableCell className={`${cellClass} ${inkClass}`}>
                    {service && formatShortDay(service.date)}
                  </TableCell>
                  <TableCell className={`${cellClass} ${inkClass}`}>
                    {formatTime(record.time)}
                  </TableCell>
                  <TableCell className={`${cellClass} ${inkClass}`}>
                    {methodLabels[record.method]}
                  </TableCell>
                  <TableCell className={cellClass}>
                    <StatusBadge status={record.status} />
                  </TableCell>
                  <TableCell className={`${cellClass} ${inkClass}`}>
                    {service && `+${pointsFor(record, service)}`}
                  </TableCell>
                </TableRow>
              );
            })}
          </TableBody>
        </Table>
      </TableContainer>
      <TablePagination
        component="div"
        count={records.length}
        page={current}
        rowsPerPage={pageSize}
        rowsPerPageOptions={[pageSize]}
        onPageChange={(_, next) => setPage(next)}
        className="text-muted"
      />
      {selected && (
        <AttendanceDetail
          record={selected}
          userMap={userMap}
          serviceMap={serviceMap}
          onClose={() => setSelected(null)}
        />
      )}
    </>
  );
};

export default AttendanceTable;
