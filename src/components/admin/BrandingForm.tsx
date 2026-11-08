"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { FormProvider, useForm } from "react-hook-form";
import BrandFields from "@/components/admin/BrandFields";
import Button from "@/components/ui/Button";
import FormError from "@/components/ui/FormError";
import { withRootError } from "@/utils/error";
import { brandingSchema, type BrandingForm as BrandingValues } from "@/utils/schemas";
import type { Organization } from "@/utils/types";

type BrandingFormProps = {
  org: Organization;
  onSave: (values: BrandingValues) => Promise<void>;
};

const BrandingForm = ({ org, onSave }: BrandingFormProps) => {
  const form = useForm<BrandingValues>({
    resolver: zodResolver(brandingSchema),
    defaultValues: { name: org.name, brandColor: org.brandColor ?? "#161616", logo: org.logo },
  });
  const { errors, isSubmitting, isSubmitSuccessful } = form.formState;

  const onSubmit = withRootError(form.setError, onSave);

  return (
    <FormProvider {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="flex flex-col gap-4">
        <BrandFields />
        <FormError message={errors.root?.message} />
        {isSubmitSuccessful && <p className="text-sm text-ok">Saved.</p>}
        <Button type="submit" disabled={isSubmitting}>
          Save branding
        </Button>
      </form>
    </FormProvider>
  );
};

export default BrandingForm;
