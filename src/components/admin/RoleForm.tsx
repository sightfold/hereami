"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import Checkbox from "@mui/material/Checkbox";
import FormControlLabel from "@mui/material/FormControlLabel";
import { useForm } from "react-hook-form";
import Button from "@/components/ui/Button";
import Field from "@/components/ui/Field";
import FormError from "@/components/ui/FormError";
import Input from "@/components/ui/Input";
import { permissionList } from "@/constants/permissions";
import { withRootError } from "@/utils/error";
import { roleSchema, type RoleForm as RoleValues } from "@/utils/schemas";

type RoleFormProps = {
  initial?: RoleValues;
  onSave: (values: RoleValues) => Promise<void>;
};

const blank: RoleValues = { name: "", permissions: [] };

const RoleForm = ({ initial = blank, onSave }: RoleFormProps) => {
  const {
    register,
    handleSubmit,
    setError,
    formState: { errors, isSubmitting },
  } = useForm<RoleValues>({ resolver: zodResolver(roleSchema), defaultValues: initial });
  const permissionsField = register("permissions");

  const onSubmit = withRootError(setError, onSave);

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col gap-4">
      <Field label="Role name" error={errors.name?.message}>
        <Input {...register("name")} placeholder="e.g. Secretary" />
      </Field>
      <fieldset className="flex flex-col gap-1.5 text-sm">
        <legend className="mb-1.5 font-medium">What this role can do</legend>
        {permissionList.map(({ id, label, hint }) => (
          <FormControlLabel
            key={id}
            className="m-0 rounded-lg border border-line py-1 pr-3"
            label={
              <span className="block leading-tight">
                <span className="block text-sm">{label}</span>
                <span className="block text-xs text-muted">{hint}</span>
              </span>
            }
            control={
              <Checkbox
                size="small"
                value={id}
                defaultChecked={initial.permissions.includes(id)}
                slotProps={{ input: permissionsField }}
              />
            }
          />
        ))}
      </fieldset>
      <FormError message={errors.root?.message} />
      <Button type="submit" disabled={isSubmitting}>
        Save role
      </Button>
    </form>
  );
};

export default RoleForm;
