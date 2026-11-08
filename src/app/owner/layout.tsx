import type { ReactNode } from "react";
import AccessGuard from "@/components/layout/AccessGuard";

const OwnerLayout = ({ children }: { children: ReactNode }) => (
  <AccessGuard area="owner">{children}</AccessGuard>
);

export default OwnerLayout;
