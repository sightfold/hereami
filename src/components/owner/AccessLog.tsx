import Card from "@/components/ui/Card";
import { useAppSelector } from "@/store";
import { selectAuditLog } from "@/store/selectors";
import { formatClock, formatDay } from "@/utils/date";

const AccessLog = () => {
  const entries = useAppSelector(selectAuditLog).slice(0, 8);

  return (
    <Card>
      <h2 className="font-semibold">Access log</h2>
      <p className="mb-3 text-xs text-muted">Each time you enter an organization is recorded.</p>
      {entries.length === 0 ? (
        <p className="text-sm text-muted">Nothing yet.</p>
      ) : (
        <ul className="flex flex-col divide-y divide-line">
          {entries.map(({ id, orgName, target, time }) => (
            <li key={id} className="py-2 text-sm">
              <p className="truncate font-medium">{orgName}</p>
              <p className="text-xs text-muted">
                {target} · {formatDay(time)}, {formatClock(time)}
              </p>
            </li>
          ))}
        </ul>
      )}
    </Card>
  );
};

export default AccessLog;
