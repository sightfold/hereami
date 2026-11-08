import { runOne, supabase } from "@/api/client";
import { toRole } from "@/api/mappers";
import { requireOrgId } from "@/api/session";
import type { RoleForm } from "@/utils/schemas";

const newRoleId = () => `role-${crypto.randomUUID().slice(0, 8)}`;

export const saveRole = async ({ id, values }: { id?: string; values: RoleForm }) => {
  const orgId = requireOrgId();
  const query = id
    ? supabase.from("roles").update(values).eq("org_id", orgId).eq("id", id)
    : supabase.from("roles").insert({ ...values, org_id: orgId, id: newRoleId() });
  return toRole(await runOne(query.select()));
};

export const removeRole = async (id: string) => {
  await runOne(
    supabase.from("roles").delete().eq("org_id", requireOrgId()).eq("id", id).select("id"),
  );
  return id;
};
