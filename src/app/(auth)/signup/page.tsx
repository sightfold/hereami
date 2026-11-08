"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import Link from "next/link";
import { useForm, useWatch } from "react-hook-form";
import AuthFrame from "@/components/layout/AuthFrame";
import GuestGuard from "@/components/layout/GuestGuard";
import Button from "@/components/ui/Button";
import Field from "@/components/ui/Field";
import FormError from "@/components/ui/FormError";
import Input from "@/components/ui/Input";
import PasswordInput from "@/components/ui/PasswordInput";
import PasswordRules from "@/components/ui/PasswordRules";
import routePath from "@/constants/route.json";
import { useAppDispatch } from "@/store";
import { signUp } from "@/store/thunks";
import { withRootError } from "@/utils/error";
import { signUpSchema, type SignUpForm } from "@/utils/schemas";

const SignupPage = () => {
  const dispatch = useAppDispatch();
  const {
    register,
    handleSubmit,
    setError,
    control,
    formState: { errors, isSubmitting },
  } = useForm<SignUpForm>({ resolver: zodResolver(signUpSchema) });
  const password = useWatch({ control, name: "password" }) ?? "";

  const onSubmit = withRootError(setError, (values: SignUpForm) =>
    dispatch(signUp(values)).unwrap(),
  );

  return (
    <GuestGuard>
      <AuthFrame
        title="Register your organization"
        subtitle="You become its first administrator. It goes live as soon as you sign up."
      >
        <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col gap-4">
          <Field label="Organization name" error={errors.orgName?.message}>
            <Input {...register("orgName")} placeholder="e.g. Grace Chapel" />
          </Field>
          <Field label="Your full name" error={errors.name?.message}>
            <Input {...register("name")} autoComplete="name" />
          </Field>
          <Field label="Email" error={errors.email?.message}>
            <Input {...register("email")} type="email" autoComplete="email" />
          </Field>
          <Field label="Phone" error={errors.phone?.message}>
            <Input {...register("phone")} placeholder="+2348030000000" inputMode="tel" />
          </Field>
          <Field label="Password" error={errors.password?.message}>
            <PasswordInput {...register("password")} autoComplete="new-password" />
          </Field>
          <PasswordRules value={password} />
          <FormError message={errors.root?.message} />
          <Button type="submit" disabled={isSubmitting}>
            Create account
          </Button>
          <p className="text-center text-xs text-muted">
            Demo mode: your password is not stored, and all data stays in this browser.
          </p>
        </form>
        <p className="mt-4 text-center text-sm text-muted">
          Already registered?{" "}
          <Link href={routePath.Auth.Login} className="font-medium text-fg underline">
            Sign in
          </Link>
        </p>
      </AuthFrame>
    </GuestGuard>
  );
};

export default SignupPage;
