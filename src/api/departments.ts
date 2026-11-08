import { run, runOne, supabase } from "@/api/client";
import { toDepartment } from "@/api/mappers";
import { requireOrgId } from "@/api/session";
import type { DepartmentInput } from "@/utils/types";

const sameName = (left: string, right: string) => left.toLowerCase() === right.toLowerCase();

const unitsOf = (departmentId: string) =>
  run(supabase.from("units").select().eq("department_id", departmentId).order("created_at"));

const insertUnits = async (departmentId: string, names: string[]) => {
  if (names.length === 0) return;
  const orgId = requireOrgId();
  await run(
    supabase
      .from("units")
      .insert(names.map((name) => ({ org_id: orgId, department_id: departmentId, name }))),
  );
};

export const addDepartment = async ({ units, ...input }: DepartmentInput) => {
  const row = await runOne(
    supabase
      .from("departments")
      .insert({ ...input, org_id: requireOrgId() })
      .select(),
  );
  await insertUnits(row.id, units);
  return toDepartment(row, await unitsOf(row.id));
};

export const updateDepartment = async ({
  id,
  units,
  ...input
}: DepartmentInput & { id: string }) => {
  const row = await runOne(supabase.from("departments").update(input).eq("id", id).select());
  const current = await unitsOf(id);
  const dropped = current.filter((unit) => !units.some((name) => sameName(name, unit.name)));
  const added = units.filter((name) => !current.some((unit) => sameName(name, unit.name)));
  if (dropped.length > 0) {
    await run(
      supabase
        .from("units")
        .delete()
        .in(
          "id",
          dropped.map((unit) => unit.id),
        ),
    );
  }
  await insertUnits(id, added);
  return toDepartment(row, await unitsOf(id));
};

export const removeDepartment = async (id: string) => {
  await runOne(supabase.from("departments").delete().eq("id", id).select("id"));
  return id;
};
