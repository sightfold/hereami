import { ClipboardList } from "lucide-react";
import Avatar from "@/components/ui/Avatar";
import Empty from "@/components/ui/Empty";
import StatusBadge from "@/components/ui/StatusBadge";
import { formatShortDay, formatTime } from "@/utils/date";
import type { Attendance, Service, User } from "@/utils/types";

type RecordListProps = {
  records: Attendance[];
  userMap: Map<string, User>;
  serviceMap: Map<string, Service>;
  emptyText: string;
};

const RecordList = ({ records, userMap, serviceMap, emptyText }: RecordListProps) => {
  if (records.length === 0) return <Empty icon={ClipboardList} text={emptyText} />;

  return (
    <ul>
      {records.map((record) => {
        const user = userMap.get(record.userId);
        const name = user?.name ?? "Unknown";
        const service = serviceMap.get(record.serviceId);
        return (
          <li
            key={record.id}
            className="flex items-center gap-3 border-b border-rule-blue px-4 py-2.5"
          >
            <Avatar name={name} src={user?.photo} />
            <div className="min-w-0 flex-1">
              <p className="truncate font-serif text-lg leading-tight">{name}</p>
              <p className="truncate text-xs text-muted">{record.reason}</p>
            </div>
            <div className="flex flex-col items-end gap-1">
              <StatusBadge status={record.status} />
              <span className="font-mono text-[11px] text-muted">
                {service && formatShortDay(service.date)} · {formatTime(record.time)}
              </span>
            </div>
          </li>
        );
      })}
    </ul>
  );
};

export default RecordList;
