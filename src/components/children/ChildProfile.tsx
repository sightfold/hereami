"use client";

import { Phone } from "lucide-react";
import Avatar from "@/components/ui/Avatar";
import Badge from "@/components/ui/Badge";
import Button from "@/components/ui/Button";
import { useAppSelector } from "@/store";
import { selectChildClasses, selectChildMarks, selectHeldServices } from "@/store/selectors";
import { markOf, rankChildren, toMarkMap } from "@/utils/childScore";
import { childName, classLabel } from "@/utils/children";
import { formatShortDay } from "@/utils/date";
import type { Child } from "@/utils/types";

const historySize = 8;

type ChildProfileProps = {
  child: Child;
  canManage: boolean;
  onEdit: () => void;
  onArchive: () => void;
};

const ChildProfile = ({ child, canManage, onEdit, onArchive }: ChildProfileProps) => {
  const classes = useAppSelector(selectChildClasses);
  const marks = useAppSelector(selectChildMarks);
  const services = useAppSelector(selectHeldServices);
  const [stats] = rankChildren([child], services, marks);
  const map = toMarkMap(marks);
  const history = services
    .filter((service) => markOf(map, service.id, child.id))
    .slice(-historySize)
    .toReversed();
  const items = [
    { label: "Points", value: stats.points },
    { label: "Attended", value: `${stats.percent}%` },
    { label: "Streak", value: stats.streak },
  ];

  return (
    <div className="flex flex-col gap-4">
      <div className="flex items-center gap-3">
        <Avatar name={childName(child)} className="size-14 text-base" />
        <div className="min-w-0">
          <p className="truncate font-semibold">{childName(child)}</p>
          <p className="text-xs text-muted">
            S/N {child.serial} · {child.age} yrs · {child.gender === "male" ? "Boy" : "Girl"}
          </p>
          <p className="text-xs text-muted">
            {classLabel(classes.find((item) => item.id === child.classId))}
          </p>
        </div>
      </div>
      <div className="grid grid-cols-3 gap-2">
        {items.map((item) => (
          <div key={item.label} className="rounded-xl bg-subtle py-2 text-center">
            <p className="font-semibold tabular-nums">{item.value}</p>
            <p className="text-[11px] text-muted">{item.label}</p>
          </div>
        ))}
      </div>
      <div className="text-sm">
        <p className="font-medium">{child.parentName ?? "No parent on file"}</p>
        {child.parentPhone && (
          <a
            href={`tel:${child.parentPhone}`}
            className="mt-0.5 inline-flex items-center gap-1 text-muted hover:text-fg"
          >
            <Phone className="size-3.5" /> {child.parentPhone}
          </a>
        )}
        {child.notes && <p className="mt-2 text-muted">{child.notes}</p>}
      </div>
      {history.length > 0 && (
        <div className="flex flex-wrap gap-1.5">
          {history.map((service) => {
            const isPresent = markOf(map, service.id, child.id) === "present";
            return (
              <Badge key={service.id} tone={isPresent ? "ok" : "bad"}>
                {formatShortDay(service.date)}
              </Badge>
            );
          })}
        </div>
      )}
      {canManage && (
        <div className="flex gap-2">
          <Button variant="outline" onClick={onEdit}>
            Edit
          </Button>
          <Button variant="ghost" onClick={onArchive}>
            {child.archived ? "Restore" : "Archive"}
          </Button>
        </div>
      )}
    </div>
  );
};

export default ChildProfile;
