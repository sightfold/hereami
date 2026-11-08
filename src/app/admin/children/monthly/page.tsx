"use client";

import { useState } from "react";
import { addMonths, format, isSameMonth, parseISO } from "date-fns";
import IconButton from "@mui/material/IconButton";
import { ChevronLeft, ChevronRight, FileDown, FileText, Sprout } from "lucide-react";
import ClassSelect, { allClasses } from "@/components/children/ClassSelect";
import MonthGrid from "@/components/children/MonthGrid";
import Button from "@/components/ui/Button";
import Empty from "@/components/ui/Empty";
import { useAppSelector } from "@/store";
import {
  selectActiveChildren,
  selectChildClasses,
  selectChildMarks,
  selectHeldServices,
  selectOrgName,
} from "@/store/selectors";
import { buildGrid, exportGridCsv, exportGridPdf } from "@/utils/childExport";
import { toMarkMap } from "@/utils/childScore";
import { sortChildren } from "@/utils/children";

const ChildrenMonthlyPage = () => {
  const children = useAppSelector(selectActiveChildren);
  const classes = useAppSelector(selectChildClasses);
  const marks = useAppSelector(selectChildMarks);
  const services = useAppSelector(selectHeldServices);
  const orgName = useAppSelector(selectOrgName);
  const [classId, setClassId] = useState(allClasses);
  const [month, setMonth] = useState(() => new Date());

  const inMonth = services.filter((service) => isSameMonth(parseISO(service.date), month));
  const inClass = children.filter((child) => classId === allClasses || child.classId === classId);
  const grid = buildGrid(sortChildren(inClass, "serial"), inMonth, toMarkMap(marks));
  const className = classes.find((item) => item.id === classId)?.name ?? "All classes";
  const monthName = format(month, "MMMM yyyy");
  const fileName = `register-${className.toLowerCase().replaceAll(" ", "-")}-${format(month, "yyyy-MM")}`;

  return (
    <>
      <div className="mb-3 grid grid-cols-1 items-end gap-3 sm:grid-cols-3">
        <ClassSelect value={classId} onChange={setClassId} />
        <div className="flex items-center justify-between rounded-xl border border-line bg-card px-1 py-0.5">
          <IconButton
            size="small"
            aria-label="Previous month"
            onClick={() => setMonth(addMonths(month, -1))}
          >
            <ChevronLeft className="size-4" />
          </IconButton>
          <span className="text-sm font-medium">{monthName}</span>
          <IconButton
            size="small"
            aria-label="Next month"
            disabled={isSameMonth(month, new Date())}
            onClick={() => setMonth(addMonths(month, 1))}
          >
            <ChevronRight className="size-4" />
          </IconButton>
        </div>
        <div className="flex gap-2">
          <Button size="sm" variant="outline" onClick={() => exportGridCsv(grid, fileName)}>
            <FileDown className="size-4" /> CSV
          </Button>
          <Button
            size="sm"
            variant="outline"
            onClick={() =>
              exportGridPdf(grid, `${orgName} · ${className} · ${monthName}`, fileName)
            }
          >
            <FileText className="size-4" /> PDF
          </Button>
        </div>
      </div>
      <p className="mb-3 text-xs text-muted">Exports use P for present and A for absent.</p>
      {grid.rows.length === 0 ? (
        <Empty icon={Sprout} text="No children in this class yet." />
      ) : (
        <MonthGrid grid={grid} />
      )}
    </>
  );
};

export default ChildrenMonthlyPage;
