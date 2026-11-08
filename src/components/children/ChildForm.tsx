"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { Controller, useForm, useWatch } from "react-hook-form";
import Button from "@/components/ui/Button";
import Field from "@/components/ui/Field";
import FormError from "@/components/ui/FormError";
import Input from "@/components/ui/Input";
import Select from "@/components/ui/Select";
import Textarea from "@/components/ui/Textarea";
import { useAppSelector } from "@/store";
import { selectChildClasses } from "@/store/selectors";
import { ageFromDob, classForAge, classLabel } from "@/utils/children";
import { withRootError } from "@/utils/error";
import { childSchema, type ChildForm as ChildValues } from "@/utils/schemas";

type ChildFormProps = { initial?: ChildValues; onSave: (values: ChildValues) => Promise<void> };

const blank: Partial<ChildValues> = {
  firstName: "",
  surname: "",
  dob: "",
  age: "",
  classId: "",
  parentName: "",
  parentPhone: "",
  notes: "",
};

const chooseOption = { value: "", label: "Choose" };

const genderOptions = [
  chooseOption,
  { value: "female", label: "Female" },
  { value: "male", label: "Male" },
];

const ChildForm = ({ initial, onSave }: ChildFormProps) => {
  const {
    control,
    register,
    handleSubmit,
    setError,
    setValue,
    formState: { errors, isSubmitting, dirtyFields },
  } = useForm<ChildValues>({
    resolver: zodResolver(childSchema),
    defaultValues: initial ?? blank,
  });
  const classes = useAppSelector(selectChildClasses);
  const dob = useWatch({ control, name: "dob" });

  const pickClass = (age: number) => {
    if (initial || dirtyFields.classId || Number.isNaN(age)) return;
    const match = classForAge(classes, age);
    if (match) setValue("classId", match.id, { shouldValidate: true });
  };

  const handleDob = (value: string) => {
    const age = ageFromDob(value);
    if (age === null) return;
    setValue("age", String(age), { shouldValidate: true });
    pickClass(age);
  };

  const onSubmit = withRootError(setError, onSave);

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col gap-4">
      <div className="grid grid-cols-2 gap-3">
        <Field label="First name" error={errors.firstName?.message}>
          <Input {...register("firstName")} />
        </Field>
        <Field label="Surname" error={errors.surname?.message}>
          <Input {...register("surname")} />
        </Field>
      </div>
      <Field label="Date of birth (optional)" error={errors.dob?.message}>
        <Input
          {...register("dob", { onChange: (event) => handleDob(event.target.value) })}
          type="date"
        />
      </Field>
      <div className="grid grid-cols-2 gap-3">
        <Field label="Age" error={errors.age?.message}>
          <Input
            {...register("age", { onChange: (event) => pickClass(Number(event.target.value)) })}
            inputMode="numeric"
            readOnly={Boolean(dob)}
          />
        </Field>
        <Field label="Gender" error={errors.gender?.message}>
          <Controller
            name="gender"
            control={control}
            render={({ field }) => (
              <Select {...field} value={field.value ?? ""} options={genderOptions} />
            )}
          />
        </Field>
      </div>
      <Field label="Class" error={errors.classId?.message}>
        <Controller
          name="classId"
          control={control}
          render={({ field }) => (
            <Select
              {...field}
              options={[
                chooseOption,
                ...classes.map((item) => ({ value: item.id, label: classLabel(item) })),
              ]}
            />
          )}
        />
      </Field>
      <Field label="Parent or guardian (optional)" error={errors.parentName?.message}>
        <Input {...register("parentName")} />
      </Field>
      <Field label="Parent's phone (optional)" error={errors.parentPhone?.message}>
        <Input {...register("parentPhone")} placeholder="+2348030000000" inputMode="tel" />
      </Field>
      <Field label="Notes (optional)" error={errors.notes?.message}>
        <Textarea {...register("notes")} placeholder="Allergies, pick-up details" />
      </Field>
      <FormError message={errors.root?.message} />
      <Button type="submit" disabled={isSubmitting}>
        Save child
      </Button>
    </form>
  );
};

export default ChildForm;
