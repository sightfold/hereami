import { runOne, supabase } from "@/api/client";
import { fromAssignment, toAssignment } from "@/api/mappers";
import { requireOrgId } from "@/api/session";
import type { Assignment } from "@/utils/types";

export const addAssignment = async (slot: Omit<Assignment, "id">) => {
  const row = await runOne(
    supabase
      .from("assignments")
      .insert({ ...fromAssignment(slot), org_id: requireOrgId() })
      .select(),
  );
  return toAssignment(row);
};

export const updateAssignment = async ({ id, ...slot }: Assignment) => {
  const row = await runOne(
    supabase.from("assignments").update(fromAssignment(slot)).eq("id", id).select(),
  );
  return toAssignment(row);
};

export const removeAssignment = async (id: string) => {
  await runOne(supabase.from("assignments").delete().eq("id", id).select("id"));
  return id;
};
