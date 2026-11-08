"use client";

import { useState } from "react";
import { zodResolver } from "@hookform/resolvers/zod";
import { Controller, useForm, useWatch } from "react-hook-form";
import { ShieldCheck } from "lucide-react";
import Button from "@/components/ui/Button";
import Field from "@/components/ui/Field";
import Select from "@/components/ui/Select";
import Textarea from "@/components/ui/Textarea";
import { useAppDispatch, useAppSelector } from "@/store";
import { selectHeldServices, selectRecords, selectUsers } from "@/store/selectors";
import { overrideCheckIn } from "@/store/thunks";
import { formatDay } from "@/utils/date";
import { overrideSchema, type OverrideForm as OverrideValues } from "@/utils/schemas";

const OverrideForm = () => {
  const dispatch = useAppDispatch();
  const users = useAppSelector(selectUsers);
  const records = useAppSelector(selectRecords);
  const services = useAppSelector(selectHeldServices);
  const [notice, setNotice] = useState("");

  const {
    register,
    handleSubmit,
    control,
    reset,
    setError,
    formState: { errors, isSubmitting },
  } = useForm<OverrideValues>({
    resolver: zodResolver(overrideSchema),
    defaultValues: { userId: "", serviceId: services.at(-1)?.id ?? "", reason: "" },
  });

  const serviceId = useWatch({ control, name: "serviceId" });
  const checkedIds = new Set(
    records.filter((record) => record.serviceId === serviceId).map((record) => record.userId),
  );
  const pending = users.filter((user) => !checkedIds.has(user.id));

  const onSubmit = async (values: OverrideValues) => {
    const result = await dispatch(overrideCheckIn(values));
    if (overrideCheckIn.rejected.match(result)) {
      setError("userId", { message: result.error.message });
      return;
    }
    const name = users.find((user) => user.id === values.userId)?.name;
    setNotice(`${name} checked in as Admin Verified.`);
    reset({ userId: "", serviceId: values.serviceId, reason: "" });
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col gap-4">
      <Field label="Service" error={errors.serviceId?.message}>
        <Controller
          name="serviceId"
          control={control}
          render={({ field }) => (
            <Select
              {...field}
              options={services.toReversed().map((service) => ({
                value: service.id,
                label: `${formatDay(service.date)} · ${service.name}`,
              }))}
            />
          )}
        />
      </Field>
      <Field label="Member" error={errors.userId?.message}>
        <Controller
          name="userId"
          control={control}
          render={({ field }) => (
            <Select
              {...field}
              onOpen={() => setNotice("")}
              options={[
                { value: "", label: `Choose a member (${pending.length} not checked in)` },
                ...pending.map((user) => ({ value: user.id, label: user.name })),
              ]}
            />
          )}
        />
      </Field>
      <Field label="Reason" error={errors.reason?.message}>
        <Textarea
          {...register("reason")}
          placeholder="e.g. Phone battery died, confirmed at media desk"
        />
      </Field>
      {notice && <p className="rounded-lg bg-ok-soft px-3 py-2 text-sm text-ok">{notice}</p>}
      <Button type="submit" disabled={isSubmitting}>
        <ShieldCheck className="size-4" />
        Approve Manual Check-In
      </Button>
    </form>
  );
};

export default OverrideForm;
