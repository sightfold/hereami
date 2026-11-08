"use client";

import { CalendarX } from "lucide-react";
import CodeDisplay from "@/components/admin/CodeDisplay";
import PageHeader from "@/components/layout/PageHeader";
import Empty from "@/components/ui/Empty";
import { useAppSelector } from "@/store";
import { selectActiveOrg, selectTodayService } from "@/store/selectors";

const CheckInCodePage = () => {
  const org = useAppSelector(selectActiveOrg);
  const service = useAppSelector(selectTodayService);

  return (
    <div className="mx-auto max-w-xl">
      <PageHeader
        title="Check-in code"
        subtitle="Show this on a screen inside the church. Members whose GPS can't reach them scan it to check in. It changes every 30 seconds, so a photo of it soon stops working."
      />
      {org && service ? (
        <CodeDisplay orgId={org.id} service={service} />
      ) : (
        <Empty icon={CalendarX} text="No service scheduled today, so there's no code to show." />
      )}
    </div>
  );
};

export default CheckInCodePage;
