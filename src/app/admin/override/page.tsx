"use client";

import OverrideForm from "@/components/admin/OverrideForm";
import RecordList from "@/components/admin/RecordList";
import PageHeader from "@/components/layout/PageHeader";
import Card from "@/components/ui/Card";
import PaperSheet from "@/components/ui/PaperSheet";
import { useAppSelector } from "@/store";
import { selectRecords, selectServiceMap, selectUserMap } from "@/store/selectors";
import { newestFirst } from "@/utils/stats";

const OverridePage = () => {
  const userMap = useAppSelector(selectUserMap);
  const serviceMap = useAppSelector(selectServiceMap);
  const overrides = useAppSelector(selectRecords)
    .filter((record) => record.status === "override")
    .toSorted(newestFirst)
    .slice(0, 8);

  return (
    <div className="mx-auto max-w-5xl">
      <PageHeader
        title="Manual check-in"
        subtitle="For members whose phone is lost, dead or can't get a location fix."
      />
      <div className="grid gap-6 lg:grid-cols-2">
        <Card>
          <OverrideForm />
        </Card>
        <PaperSheet title="Recent manual check-ins">
          <RecordList
            records={overrides}
            userMap={userMap}
            serviceMap={serviceMap}
            emptyText="No manual check-ins yet."
          />
        </PaperSheet>
      </div>
    </div>
  );
};

export default OverridePage;
