import { differenceInYears, isValid, parseISO } from "date-fns";
import type { ChildForm } from "@/utils/schemas";
import type { Child, ChildClass, ChildInput } from "@/utils/types";

export type ChildSort = "serial" | "name" | "age";

export const childName = (child: Pick<Child, "firstName" | "surname">) =>
  `${child.firstName} ${child.surname}`;

export const classLabel = (item?: ChildClass) => (item ? `${item.emoji} ${item.name}` : "No class");

export const ageRange = (item: ChildClass) => `${item.minAge}–${item.maxAge} yrs`;

export const classForAge = (classes: ChildClass[], age: number) => {
  const sorted = classes.toSorted((a, b) => a.minAge - b.minAge);
  const match = sorted.find((item) => age >= item.minAge && age <= item.maxAge);
  if (match) return match;
  return age < (sorted[0]?.minAge ?? 0) ? sorted[0] : sorted.at(-1);
};

export const ageFromDob = (dob: string) => {
  const date = parseISO(dob);
  return isValid(date) ? differenceInYears(new Date(), date) : null;
};

export const matchesChild = (child: Child, query: string) => {
  const text = query.trim().toLowerCase();
  if (!text) return true;
  const names = [
    `${child.firstName} ${child.surname}`.toLowerCase(),
    `${child.surname} ${child.firstName}`.toLowerCase(),
  ];
  return names.some((name) => name.includes(text)) || String(child.serial) === text;
};

export const sortChildren = (children: Child[], sort: ChildSort) =>
  children.toSorted((a, b) => {
    if (sort === "age") return a.age - b.age || a.serial - b.serial;
    if (sort === "name") return childName(a).localeCompare(childName(b));
    return a.serial - b.serial;
  });

export const toChildInput = (values: ChildForm): ChildInput => ({
  firstName: values.firstName,
  surname: values.surname,
  dob: values.dob || undefined,
  age: Number(values.age),
  gender: values.gender,
  classId: values.classId,
  parentName: values.parentName || undefined,
  parentPhone: values.parentPhone || undefined,
  notes: values.notes || undefined,
});

export const toChildValues = (child: Child): ChildForm => ({
  firstName: child.firstName,
  surname: child.surname,
  dob: child.dob ?? "",
  age: String(child.age),
  gender: child.gender,
  classId: child.classId,
  parentName: child.parentName ?? "",
  parentPhone: child.parentPhone ?? "",
  notes: child.notes ?? "",
});
