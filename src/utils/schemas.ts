import { isValid, parseISO } from "date-fns";
import { z } from "zod";
import { maxChildAge } from "@/constants/children";
import { passwordRules } from "@/constants/password";
import type { Permission } from "@/utils/types";

const email = z.string().trim().pipe(z.email("Enter a valid email"));

const phone = z
  .string()
  .trim()
  .regex(/^\+?\d{10,14}$/, "Enter a valid phone number");

const strongPassword = passwordRules.reduce(
  (schema, rule) => schema.regex(rule.pattern, `Password needs ${rule.label.toLowerCase()}`),
  z.string(),
);

const brandColor = z.string().regex(/^#[0-9a-fA-F]{6}$/, "Pick a colour");

export const overrideSchema = z.object({
  userId: z.string().min(1, "Choose a member"),
  serviceId: z.string().min(1, "Choose a service"),
  reason: z.string().trim().min(5, "Give a short reason (at least 5 characters)"),
});

export type OverrideForm = z.infer<typeof overrideSchema>;

export const settingsSchema = z.object({
  lat: z.coerce.number().min(-90).max(90),
  lng: z.coerce.number().min(-180).max(180),
  radiusM: z.coerce.number().int().min(10, "At least 10 m").max(500, "At most 500 m"),
  lateAfterMin: z.coerce.number().int().min(0).max(120),
});

export type SettingsInput = z.input<typeof settingsSchema>;
export type SettingsForm = z.output<typeof settingsSchema>;

export const memberSchema = z.object({
  name: z.string().trim().min(2, "Enter a name"),
  email,
  phone,
  role: z.string().min(1, "Choose a role"),
  departments: z.array(z.string()).min(1, "Pick a department"),
});

export type MemberForm = z.infer<typeof memberSchema>;

export const departmentSchema = z.object({
  name: z.string().trim().min(2, "Enter a department name"),
  roles: z.array(z.string().trim().min(1)),
});

export type DepartmentForm = z.infer<typeof departmentSchema>;

export const signInSchema = z.object({
  email,
  password: strongPassword,
});

export type SignInForm = z.infer<typeof signInSchema>;

export const signUpSchema = z.object({
  orgName: z.string().trim().min(2, "Enter your organization's name"),
  name: z.string().trim().min(2, "Enter your name"),
  email,
  phone,
  password: strongPassword,
});

export type SignUpForm = z.infer<typeof signUpSchema>;

export const brandingSchema = z.object({
  name: z.string().trim().min(2, "Enter the organization's name"),
  brandColor,
  logo: z.string().optional(),
});

export type BrandingForm = z.infer<typeof brandingSchema>;

export const onboardSchema = brandingSchema.extend({
  contactName: z.string().trim().min(2, "Enter the first admin's name"),
  contactEmail: email,
  contactPhone: phone,
});

export type OnboardForm = z.infer<typeof onboardSchema>;

export const roleSchema = z.object({
  name: z.string().trim().min(2, "Enter a role name"),
  permissions: z.array(z.custom<Permission>()),
});

export type RoleForm = z.infer<typeof roleSchema>;

const isPastDate = (value: string) => {
  const date = parseISO(value);
  return isValid(date) && date <= new Date();
};

export const childSchema = z.object({
  firstName: z.string().trim().min(1, "Enter the first name").max(50, "Keep it under 50 letters"),
  surname: z.string().trim().min(1, "Enter the surname").max(50, "Keep it under 50 letters"),
  dob: z.string().refine((value) => !value || isPastDate(value), "Enter a date that has passed"),
  age: z
    .string()
    .trim()
    .regex(/^\d{1,2}$/, "Enter the age")
    .refine((value) => Number(value) <= maxChildAge, `Age must be ${maxChildAge} or under`),
  gender: z.enum(["male", "female"], { error: "Choose male or female" }),
  classId: z.string().min(1, "Choose a class"),
  parentName: z.string().trim().max(200, "Keep it under 200 letters"),
  parentPhone: z
    .string()
    .trim()
    .refine((value) => !value || /^\+?\d{10,14}$/.test(value), "Enter a valid phone number"),
  notes: z.string().trim().max(500, "Keep it under 500 letters"),
});

export type ChildForm = z.infer<typeof childSchema>;

export const childClassSchema = z
  .object({
    name: z.string().trim().min(2, "Enter a class name"),
    emoji: z.string().trim().min(1, "Add an emoji").max(8, "Use one emoji"),
    minAge: z.coerce.number().int().min(0, "0 or more").max(maxChildAge),
    maxAge: z.coerce.number().int().min(0).max(maxChildAge, `${maxChildAge} or under`),
  })
  .refine((value) => value.minAge <= value.maxAge, {
    path: ["maxAge"],
    message: "Must not be below the youngest age",
  });

export type ChildClassInput = z.input<typeof childClassSchema>;
export type ChildClassForm = z.output<typeof childClassSchema>;
