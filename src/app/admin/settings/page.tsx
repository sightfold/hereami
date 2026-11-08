"use client";

import DepartmentSettings from "@/components/admin/DepartmentSettings";
import SettingsForm from "@/components/admin/SettingsForm";
import PageHeader from "@/components/layout/PageHeader";
import Card from "@/components/ui/Card";
import { useAppSelector } from "@/store";
import { selectPermissions } from "@/store/selectors";

const SettingsPage = () => {
  const permissions = useAppSelector(selectPermissions);

  return (
    <div className="mx-auto flex max-w-2xl flex-col gap-6">
      <PageHeader title="Settings" subtitle="Geofence, check-in rules and departments." />
      {permissions.includes("settings.manage") && (
        <Card>
          <SettingsForm />
        </Card>
      )}
      {permissions.includes("departments.manage") && (
        <Card>
          <DepartmentSettings />
        </Card>
      )}
    </div>
  );
};

export default SettingsPage;
