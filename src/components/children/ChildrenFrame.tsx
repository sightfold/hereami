"use client";

import type { ReactNode } from "react";
import ChildrenTabs from "@/components/children/ChildrenTabs";
import PageHeader from "@/components/layout/PageHeader";
import { useAppSelector } from "@/store";
import { selectOrgName } from "@/store/selectors";

const ChildrenFrame = ({ children }: { children: ReactNode }) => {
  const orgName = useAppSelector(selectOrgName);
  return (
    <div className="mx-auto max-w-5xl">
      <PageHeader title="Children's church" subtitle={`Registration at ${orgName}`} />
      <ChildrenTabs />
      {children}
    </div>
  );
};

export default ChildrenFrame;
