"use client";

import { useState } from "react";
import { Building2, Plus } from "lucide-react";
import { useRouter } from "next/navigation";
import { useStore } from "react-redux";
import BrandingForm from "@/components/admin/BrandingForm";
import Logo from "@/components/layout/Logo";
import PageHeader from "@/components/layout/PageHeader";
import SignOutButton from "@/components/layout/SignOutButton";
import ThemeToggle from "@/components/layout/ThemeToggle";
import AccessLog from "@/components/owner/AccessLog";
import OrgCard from "@/components/owner/OrgCard";
import OrgForm from "@/components/owner/OrgForm";
import ViewAsPicker from "@/components/owner/ViewAsPicker";
import Button from "@/components/ui/Button";
import Card from "@/components/ui/Card";
import { useConfirm } from "@/components/ui/ConfirmProvider";
import Empty from "@/components/ui/Empty";
import FormError from "@/components/ui/FormError";
import Sheet from "@/components/ui/Sheet";
import type { RootState } from "@/store";
import { useAppDispatch, useAppSelector } from "@/store";
import { selectHomePath, selectOrganizations, selectOrgStats } from "@/store/selectors";
import { onboardOrganization, setOrgStatus, startSimulation, updateBranding } from "@/store/thunks";
import { errorMessage } from "@/utils/error";
import type { BrandingForm as BrandingValues, OnboardForm } from "@/utils/schemas";
import type { Organization, OrgStatus } from "@/utils/types";

type Panel = { kind: "onboard" } | { kind: "viewAs" | "brand"; org: Organization } | null;

const panelTitles = { onboard: "Onboard an organization", viewAs: "View as", brand: "Customize" };

const OwnerPage = () => {
  const dispatch = useAppDispatch();
  const confirm = useConfirm();
  const store = useStore<RootState>();
  const router = useRouter();
  const organizations = useAppSelector(selectOrganizations);
  const stats = useAppSelector(selectOrgStats);
  const [panel, setPanel] = useState<Panel>(null);
  const [error, setError] = useState("");

  const attempt = async (action: () => Promise<unknown>) => {
    try {
      await action();
      setError("");
    } catch (failure) {
      setError(errorMessage(failure));
    }
  };

  const enter = (orgId: string, userId?: string) =>
    attempt(async () => {
      await dispatch(startSimulation({ orgId, userId })).unwrap();
      router.push(selectHomePath(store.getState()));
    });

  const changeStatus = async (org: Organization, status: OrgStatus) => {
    const isSuspending = status === "suspended";
    if (
      isSuspending &&
      !(await confirm({
        title: `Suspend ${org.name}?`,
        message: "Its members will be signed out of the app until you reactivate it.",
        confirmLabel: "Suspend",
        isDanger: true,
      }))
    ) {
      return;
    }
    attempt(() => dispatch(setOrgStatus({ orgId: org.id, status })).unwrap());
  };

  const handleOnboard = async (values: OnboardForm) => {
    await dispatch(onboardOrganization(values)).unwrap();
    setPanel(null);
  };

  const handleBranding = async (orgId: string, values: BrandingValues) => {
    await dispatch(updateBranding({ orgId, values })).unwrap();
    setPanel(null);
  };

  const summary = [
    { label: "Organizations", value: organizations.length },
    { label: "Active", value: organizations.filter((org) => org.status === "active").length },
    {
      label: "Suspended",
      value: organizations.filter((org) => org.status === "suspended").length,
    },
    {
      label: "Members",
      value: Object.values(stats).reduce((total, item) => total + item.members, 0),
    },
  ];

  return (
    <div className="mx-auto max-w-5xl px-4 py-5">
      <header className="mb-8 flex items-center justify-between">
        <Logo platform />
        <div className="flex items-center gap-1">
          <ThemeToggle />
          <SignOutButton />
        </div>
      </header>
      <PageHeader
        title="Organizations"
        subtitle="Onboard, customize and enter any organization."
        action={
          <Button
            startIcon={<Plus className="size-4" />}
            onClick={() => setPanel({ kind: "onboard" })}
          >
            Onboard
          </Button>
        }
      />
      <dl className="mb-6 grid grid-cols-2 gap-3 sm:grid-cols-4">
        {summary.map(({ label, value }) => (
          <Card key={label} className="py-3">
            <dd className="font-mono text-2xl font-semibold tabular-nums">{value}</dd>
            <dt className="text-xs text-muted">{label}</dt>
          </Card>
        ))}
      </dl>
      <div className="mb-4 empty:hidden">
        <FormError message={error} />
      </div>
      <div className="grid grid-cols-1 items-start gap-6 lg:grid-cols-[minmax(0,1fr)_20rem]">
        <section className="flex flex-col gap-4">
          {organizations.length === 0 && <Empty icon={Building2} text="No organizations yet." />}
          {organizations.map((org) => (
            <OrgCard
              key={org.id}
              org={org}
              stats={stats[org.id]}
              onFullAccess={() => enter(org.id)}
              onViewAs={() => setPanel({ kind: "viewAs", org })}
              onCustomize={() => setPanel({ kind: "brand", org })}
              onStatus={(status) => changeStatus(org, status)}
            />
          ))}
        </section>
        <aside className="flex flex-col gap-4">
          <AccessLog />
        </aside>
      </div>
      <Sheet
        open={!!panel}
        title={panel ? panelTitles[panel.kind] : ""}
        onClose={() => setPanel(null)}
      >
        {panel?.kind === "onboard" && <OrgForm onSave={handleOnboard} />}
        {panel?.kind === "viewAs" && (
          <ViewAsPicker
            people={stats[panel.org.id]?.people ?? []}
            onPick={(userId) => enter(panel.org.id, userId)}
          />
        )}
        {panel?.kind === "brand" && (
          <BrandingForm org={panel.org} onSave={(values) => handleBranding(panel.org.id, values)} />
        )}
      </Sheet>
    </div>
  );
};

export default OwnerPage;
