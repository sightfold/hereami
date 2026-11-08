"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import Checkbox from "@mui/material/Checkbox";
import FormControlLabel from "@mui/material/FormControlLabel";
import { Controller, useForm, useWatch } from "react-hook-form";
import UnitFields from "@/components/admin/UnitFields";
import Button from "@/components/ui/Button";
import Field from "@/components/ui/Field";
import FormError from "@/components/ui/FormError";
import Input from "@/components/ui/Input";
import Select from "@/components/ui/Select";
import { memberRoleId } from "@/constants/permissions";
import { useAppSelector } from "@/store";
import { selectDepartments, selectPermissions, selectRoles } from "@/store/selectors";
import { withRootError } from "@/utils/error";
import { memberSchema, type MemberForm as MemberValues } from "@/utils/schemas";

type MemberFormProps = {
  initial?: MemberValues;
  onSave: (values: MemberValues) => Promise<void>;
  onRemove?: () => Promise<void>;
  isRoleLocked?: boolean;
};

const blank: MemberValues = {
  name: "",
  email: "",
  phone: "",
  role: memberRoleId,
  departments: [],
  units: [],
};

const toList = (value: string[] | string | false | undefined) => {
  if (!value) return [];
  return Array.isArray(value) ? value : [value];
};

const MemberForm = ({ initial = blank, onSave, onRemove, isRoleLocked }: MemberFormProps) => {
  const {
    control,
    register,
    handleSubmit,
    setError,
    formState: { errors, isSubmitting },
  } = useForm<MemberValues>({ resolver: zodResolver(memberSchema), defaultValues: initial });
  const departments = useAppSelector(selectDepartments);
  const roles = useAppSelector(selectRoles);
  const canAssignRoles = useAppSelector(selectPermissions).includes("roles.manage");
  const departmentsField = register("departments");
  const checkedIds = toList(useWatch({ control, name: "departments" }));
  const checkedDepartments = departments.filter((department) => checkedIds.includes(department.id));

  const onSubmit = withRootError(setError, (values: MemberValues) => {
    const allowed = new Set(
      checkedDepartments.flatMap((item) => item.units.map((unit) => unit.id)),
    );
    return onSave({ ...values, units: toList(values.units).filter((id) => allowed.has(id)) });
  });

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col gap-4">
      <Field label="Full name" error={errors.name?.message}>
        <Input {...register("name")} />
      </Field>
      <Field label="Email" error={errors.email?.message}>
        <Input {...register("email")} type="email" autoComplete="off" />
      </Field>
      <Field label="Phone" error={errors.phone?.message}>
        <Input {...register("phone")} placeholder="+2348030000000" inputMode="tel" />
      </Field>
      {isRoleLocked && (
        <Field label="Role">
          <p className="text-sm text-muted">
            Primary administrator. This role can&apos;t be changed.
          </p>
        </Field>
      )}
      {canAssignRoles && !isRoleLocked && (
        <Field label="Role" error={errors.role?.message}>
          <Controller
            name="role"
            control={control}
            render={({ field }) => (
              <Select
                {...field}
                options={roles.map(({ id, name }) => ({ value: id, label: name }))}
              />
            )}
          />
        </Field>
      )}
      <fieldset className="flex flex-col gap-1.5 text-sm">
        <legend className="mb-1.5 font-medium">Departments</legend>
        <div className="grid grid-cols-2 gap-2">
          {departments.map(({ id, name }) => (
            <FormControlLabel
              key={id}
              label={name}
              className="m-0 rounded-lg border border-line pr-3"
              control={
                <Checkbox
                  size="small"
                  value={id}
                  defaultChecked={initial.departments.includes(id)}
                  slotProps={{ input: departmentsField }}
                />
              }
            />
          ))}
        </div>
        {departments.length === 0 && (
          <span className="text-xs text-muted">
            Add a department in Settings before adding people.
          </span>
        )}
        {errors.departments && (
          <span className="text-xs text-bad">{errors.departments.message}</span>
        )}
      </fieldset>
      <UnitFields
        departments={checkedDepartments}
        initialUnits={initial.units}
        field={register("units")}
      />
      <FormError message={errors.root?.message} />
      <Button type="submit" disabled={isSubmitting}>
        Save member
      </Button>
      {onRemove && (
        <Button type="button" variant="ghost" onClick={withRootError(setError, onRemove)}>
          Remove from organization
        </Button>
      )}
    </form>
  );
};

export default MemberForm;
