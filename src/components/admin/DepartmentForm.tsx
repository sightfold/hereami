"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { Controller, useForm } from "react-hook-form";
import Button from "@/components/ui/Button";
import Field from "@/components/ui/Field";
import Input from "@/components/ui/Input";
import TagInput from "@/components/ui/TagInput";
import { departmentSchema, type DepartmentForm as DepartmentValues } from "@/utils/schemas";
import type { Department, DepartmentInput } from "@/utils/types";

type DepartmentFormProps = {
  initial?: Department;
  takenNames: string[];
  onSave: (input: DepartmentInput) => Promise<void>;
};

const DepartmentForm = ({ initial, takenNames, onSave }: DepartmentFormProps) => {
  const {
    register,
    control,
    handleSubmit,
    setError,
    formState: { errors, isSubmitting },
  } = useForm<DepartmentValues>({
    resolver: zodResolver(departmentSchema),
    defaultValues: {
      name: initial?.name ?? "",
      roles: initial?.roles ?? [],
      units: initial?.units.map((unit) => unit.name) ?? [],
    },
  });

  const onSubmit = async ({ name, roles, units }: DepartmentValues) => {
    if (takenNames.includes(name.toLowerCase())) {
      setError("name", { message: "A department with this name already exists" });
      return;
    }
    await onSave({ name, roles, units });
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col gap-4">
      <Field label="Department name" error={errors.name?.message}>
        <Input {...register("name")} placeholder="e.g. Lighting" />
      </Field>
      <Field label="Roles (optional)" error={errors.roles?.message}>
        <Controller
          control={control}
          name="roles"
          render={({ field }) => (
            <TagInput
              value={field.value}
              onChange={field.onChange}
              placeholder="e.g. Lighting Desk"
            />
          )}
        />
      </Field>
      <p className="-mt-2 text-xs text-muted">
        Press Enter or comma after each role. Each role becomes a slot on the duty roster. Leave it
        empty if the whole department serves every service. Removing a role clears anyone rostered
        in it.
      </p>
      <Field label="Units (optional)" error={errors.units?.message}>
        <Controller
          control={control}
          name="units"
          render={({ field }) => (
            <TagInput value={field.value} onChange={field.onChange} placeholder="e.g. Sopranos" />
          )}
        />
      </Field>
      <p className="-mt-2 text-xs text-muted">
        Smaller teams inside this department. Members of the department can also belong to a unit.
        Removing a unit takes its members out of it.
      </p>
      <Button type="submit" disabled={isSubmitting}>
        Save department
      </Button>
    </form>
  );
};

export default DepartmentForm;
