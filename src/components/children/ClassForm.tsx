"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import Button from "@/components/ui/Button";
import Field from "@/components/ui/Field";
import FormError from "@/components/ui/FormError";
import Input from "@/components/ui/Input";
import { withRootError } from "@/utils/error";
import {
  childClassSchema,
  type ChildClassForm as ClassValues,
  type ChildClassInput,
} from "@/utils/schemas";

type ClassFormProps = {
  initial?: ClassValues;
  onSave: (values: ClassValues) => Promise<void>;
  onCancel: () => void;
};

const blank: ClassValues = { name: "", emoji: "🌱", minAge: 0, maxAge: 16 };

const ClassForm = ({ initial = blank, onSave, onCancel }: ClassFormProps) => {
  const {
    register,
    handleSubmit,
    setError,
    formState: { errors, isSubmitting },
  } = useForm<ChildClassInput, unknown, ClassValues>({
    resolver: zodResolver(childClassSchema),
    defaultValues: initial,
  });

  const onSubmit = withRootError(setError, onSave);

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col gap-4">
      <Field label="Class name" error={errors.name?.message}>
        <Input {...register("name")} />
      </Field>
      <Field label="Emoji" error={errors.emoji?.message}>
        <Input {...register("emoji")} />
      </Field>
      <div className="grid grid-cols-2 gap-3">
        <Field label="Youngest age" error={errors.minAge?.message}>
          <Input {...register("minAge")} inputMode="numeric" />
        </Field>
        <Field label="Oldest age" error={errors.maxAge?.message}>
          <Input {...register("maxAge")} inputMode="numeric" />
        </Field>
      </div>
      <FormError message={errors.root?.message} />
      <div className="flex gap-2">
        <Button type="button" variant="ghost" onClick={onCancel}>
          Cancel
        </Button>
        <Button type="submit" disabled={isSubmitting}>
          Save class
        </Button>
      </div>
    </form>
  );
};

export default ClassForm;
