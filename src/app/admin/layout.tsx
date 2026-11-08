import type { ReactNode } from "react";
import AccessGuard from "@/components/layout/AccessGuard";
import AdminShell from "@/components/layout/AdminShell";

const AdminLayout = ({ children }: { children: ReactNode }) => (
  <AccessGuard area="admin">
    <AdminShell>{children}</AdminShell>
  </AccessGuard>
);

export default AdminLayout;
