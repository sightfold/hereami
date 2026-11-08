import type { ReactNode } from "react";
import ChildrenFrame from "@/components/children/ChildrenFrame";

const ChildrenLayout = ({ children }: { children: ReactNode }) => (
  <ChildrenFrame>{children}</ChildrenFrame>
);

export default ChildrenLayout;
