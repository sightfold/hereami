"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import Link from "next/link";
import { useForm } from "react-hook-form";
import AuthFrame from "@/components/layout/AuthFrame";
import GuestGuard from "@/components/layout/GuestGuard";
import Button from "@/components/ui/Button";
import Field from "@/components/ui/Field";
import FormError from "@/components/ui/FormError";
import Input from "@/components/ui/Input";
import PasswordInput from "@/components/ui/PasswordInput";
import routePath from "@/constants/route.json";
import { useAppDispatch } from "@/store";
import { signIn } from "@/store/thunks";
import { withRootError } from "@/utils/error";
import { signInSchema, type SignInForm } from "@/utils/schemas";

const LoginPage = () => {
  const dispatch = useAppDispatch();
  const {
    register,
    handleSubmit,
    setError,
    formState: { errors, isSubmitting },
  } = useForm<SignInForm>({ resolver: zodResolver(signInSchema) });

  const onSubmit = withRootError(setError, (values: SignInForm) =>
    dispatch(signIn(values)).unwrap(),
  );

  return (
    <GuestGuard>
      <AuthFrame title="Sign in" subtitle="Welcome back. Use your organization email.">
        <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col gap-4">
          <Field label="Email" error={errors.email?.message}>
            <Input {...register("email")} type="email" autoComplete="email" />
          </Field>
          <Field label="Password" error={errors.password?.message}>
            <PasswordInput {...register("password")} autoComplete="current-password" />
          </Field>
          <FormError message={errors.root?.message} />
          <Button type="submit" disabled={isSubmitting}>
            Sign in
          </Button>
        </form>
        <p className="mt-4 text-center text-sm text-muted">
          New here?{" "}
          <Link href={routePath.Auth.Signup} className="font-medium text-fg underline">
            Register your organization
          </Link>
        </p>
      </AuthFrame>
    </GuestGuard>
  );
};

export default LoginPage;
