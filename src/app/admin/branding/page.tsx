"use client";

import BrandingForm from "@/components/admin/BrandingForm";
import PageHeader from "@/components/layout/PageHeader";
import Card from "@/components/ui/Card";
import Spinner from "@/components/ui/Spinner";
import { useAppDispatch, useAppSelector } from "@/store";
import { selectActiveOrg } from "@/store/selectors";
import { updateBranding } from "@/store/thunks";
import type { BrandingForm as BrandingValues } from "@/utils/schemas";

const BrandingPage = () => {
  const dispatch = useAppDispatch();
  const org = useAppSelector(selectActiveOrg);

  if (!org) return <Spinner full />;

  const handleSave = async (values: BrandingValues) => {
    await dispatch(updateBranding({ orgId: org.id, values })).unwrap();
  };

  return (
    <div className="mx-auto max-w-lg">
      <PageHeader title="Branding" subtitle="Your name, logo and colour across the app." />
      <Card>
        <BrandingForm key={org.id} org={org} onSave={handleSave} />
      </Card>
    </div>
  );
};

export default BrandingPage;
