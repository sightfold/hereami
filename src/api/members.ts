import { runOne, supabase } from "@/api/client";
import { fromUser, toUser } from "@/api/mappers";
import { requireOrgId } from "@/api/session";
import type { MemberForm } from "@/utils/schemas";
import type { User } from "@/utils/types";

export const addMember = async (form: MemberForm) => {
  const row = await runOne(
    supabase
      .from("profiles")
      .insert({ ...fromUser(form), org_id: requireOrgId() })
      .select(),
  );
  return toUser(row);
};

export const updateMember = async (user: User) => {
  const row = await runOne(
    supabase.from("profiles").update(fromUser(user)).eq("id", user.id).select(),
  );
  return toUser(row);
};

export const removeMember = async (userId: string) => {
  await runOne(supabase.from("profiles").delete().eq("id", userId).select("id"));
  return userId;
};
