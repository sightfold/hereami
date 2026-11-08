"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { FormProvider, useForm } from "react-hook-form";
import BrandFields from "@/components/admin/BrandFields";
import Button from "@/components/ui/Button";
import Field from "@/components/ui/Field";
import FormError from "@/components/ui/FormError";
import Input from "@/components/ui/Input";
import { withRootError } from "@/utils/error";
import { onboardSchema, type OnboardForm } from "@/utils/schemas";

const blank: OnboardForm = {
  name: "",
  brandColor: "#161616",
  contactName: "",
  contactEmail: "",
  contactPhone: "",
};

const OrgForm = ({ onSave }: { onSave: (values: OnboardForm) => Promise<void> }) => {
  const form = useForm<OnboardForm>({
    resolver: zodResolver(onboardSchema),
    defaultValues: blank,
  });
  const {
    register,
    formState: { errors, isSubmitting },
  } = form;

  const onSubmit = withRootError(form.setError, onSave);

  return (
    <FormProvider {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="flex flex-col gap-4">
        <BrandFields />
        <h3 className="border-t border-line pt-4 text-sm font-semibold">First administrator</h3>
        <Field label="Full name" error={errors.contactName?.message}>
          <Input {...register("contactName")} />
        </Field>
        <Field label="Email" error={errors.contactEmail?.message}>
          <Input {...register("contactEmail")} type="email" autoComplete="off" />
        </Field>
        <Field label="Phone" error={errors.contactPhone?.message}>
          <Input {...register("contactPhone")} placeholder="+2348030000000" inputMode="tel" />
        </Field>
        <FormError message={errors.root?.message} />
        <Button type="submit" disabled={isSubmitting}>
          Onboard organization
        </Button>
      </form>
    </FormProvider>
  );
};

export default OrgForm;
