import type { ReactNode } from "react";
import AccessGuard from "@/components/layout/AccessGuard";
import MemberShell from "@/components/layout/MemberShell";

const MemberLayout = ({ children }: { children: ReactNode }) => (
  <AccessGuard area="member">
    <MemberShell>{children}</MemberShell>
  </AccessGuard>
);

export default MemberLayout;
