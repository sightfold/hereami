"use client";

import { useState } from "react";
import { Search, Sprout } from "lucide-react";
import ClassSelect, { allClasses } from "@/components/children/ClassSelect";
import CountBar from "@/components/children/CountBar";
import FollowUpList from "@/components/children/FollowUpList";
import MarkToggle from "@/components/children/MarkToggle";
import Avatar from "@/components/ui/Avatar";
import Empty from "@/components/ui/Empty";
import { useRunAction } from "@/components/ui/ErrorNotice";
import Field from "@/components/ui/Field";
import Input from "@/components/ui/Input";
import PaperSheet from "@/components/ui/PaperSheet";
import Select from "@/components/ui/Select";
import { useAppDispatch, useAppSelector } from "@/store";
import {
  selectActiveChildren,
  selectChildMarks,
  selectHeldServices,
  selectPermissions,
  selectTodayService,
} from "@/store/selectors";
import { setChildMark } from "@/store/thunks";
import { cn } from "@/utils/cn";
import { markOf, toMarkMap } from "@/utils/childScore";
import { childName, matchesChild, sortChildren } from "@/utils/children";
import { formatDay } from "@/utils/date";
import type { MarkStatus } from "@/utils/types";

const rowTones: Record<MarkStatus, string> = { present: "bg-ok-soft/50", absent: "bg-bad-soft/50" };

const ChildrenRegisterPage = () => {
  const dispatch = useAppDispatch();
  const run = useRunAction();
  const children = useAppSelector(selectActiveChildren);
  const marks = useAppSelector(selectChildMarks);
  const services = useAppSelector(selectHeldServices);
  const today = useAppSelector(selectTodayService);
  const permissions = useAppSelector(selectPermissions);
  const [classId, setClassId] = useState(allClasses);
  const [picked, setPicked] = useState<string | null>(null);
  const [query, setQuery] = useState("");

  const serviceId = picked ?? today?.id ?? services.at(-1)?.id ?? "";
  const service = services.find((item) => item.id === serviceId);
  const inClass = children.filter((child) => classId === allClasses || child.classId === classId);
  const shown = sortChildren(inClass, "serial").filter((child) => matchesChild(child, query));
  const map = toMarkMap(marks);
  const statusOf = (childId: string) => markOf(map, serviceId, childId);
  const countOf = (status: MarkStatus) =>
    inClass.filter((child) => statusOf(child.id) === status).length;

  return (
    <>
      <div className="mb-4 grid grid-cols-1 gap-3 sm:grid-cols-3">
        <ClassSelect value={classId} onChange={setClassId} />
        <Field label="Service">
          <Select
            value={serviceId}
            onChange={setPicked}
            options={services
              .toReversed()
              .map((service) => ({ value: service.id, label: formatDay(service.date) }))}
          />
        </Field>
        <Field label="Find a child">
          <Input
            value={query}
            onChange={(event) => setQuery(event.target.value)}
            placeholder="Name or S/N"
            startAdornment={<Search className="mr-2 size-4 text-muted" />}
          />
        </Field>
      </div>
      <CountBar present={countOf("present")} absent={countOf("absent")} total={inClass.length} />
      {shown.length === 0 ? (
        <Empty icon={Sprout} text="No children to show here yet." />
      ) : (
        <PaperSheet title="Children's register" meta={service && formatDay(service.date)}>
          <ul>
            {shown.map((child) => {
              const status = statusOf(child.id);
              return (
                <li
                  key={child.id}
                  className={cn(
                    "flex items-center gap-3 border-b border-rule-blue px-4 py-2",
                    status && rowTones[status],
                  )}
                >
                  <Avatar name={childName(child)} />
                  <div className="min-w-0 flex-1">
                    <p className="truncate font-serif text-lg leading-tight">{childName(child)}</p>
                    <p className="text-xs text-muted">
                      S/N {child.serial} · {child.age} yrs
                    </p>
                  </div>
                  <MarkToggle
                    name={childName(child)}
                    value={status}
                    isDisabled={!permissions.includes("children.mark")}
                    onChange={(next) =>
                      run(dispatch(setChildMark({ childId: child.id, serviceId, status: next })))
                    }
                  />
                </li>
              );
            })}
          </ul>
        </PaperSheet>
      )}
      {permissions.includes("children.view") && (
        <FollowUpList childList={inClass} services={services} marks={marks} />
      )}
    </>
  );
};

export default ChildrenRegisterPage;
