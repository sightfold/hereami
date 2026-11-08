"use client";

import Link from "next/link";
import { Sprout } from "lucide-react";
import Button from "@/components/ui/Button";
import Card from "@/components/ui/Card";
import routePath from "@/constants/route.json";
import { useAppSelector } from "@/store";
import { selectActiveChildren, selectChildMarks, selectTodayService } from "@/store/selectors";

const ChildrenSummary = () => {
  const service = useAppSelector(selectTodayService);
  const children = useAppSelector(selectActiveChildren);
  const marks = useAppSelector(selectChildMarks);
  const ids = new Set(children.map((child) => child.id));
  const today = marks.filter((mark) => mark.serviceId === service?.id && ids.has(mark.childId));
  const present = today.filter((mark) => mark.status === "present").length;

  return (
    <Card>
      <div className="mb-3 flex items-center gap-2">
        <Sprout className="size-4 text-muted" />
        <h2 className="text-sm font-semibold">Children&apos;s church</h2>
      </div>
      <p className="text-3xl font-semibold tracking-tight tabular-nums">
        {present}
        <span className="ml-0.5 text-lg font-normal text-muted">/{children.length}</span>
      </p>
      <p className="mt-1 text-xs text-muted">
        present today · {children.length - today.length} not marked
      </p>
      <Link href={routePath.Admin.ChildrenRegister} className="mt-3 block">
        <Button size="sm" variant="outline">
          Open register
        </Button>
      </Link>
    </Card>
  );
};

export default ChildrenSummary;
