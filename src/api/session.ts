import { run, supabase } from "@/api/client";
import { activeOrgIdOf } from "@/utils/permissions";
import type { Session } from "@/utils/types";

type OwnerView = { viewOrgId?: string; viewAsUserId?: string };

const viewKey = "hereami-owner-view";

let current: Session | null = null;

const readOwnerView = (): OwnerView => {
  try {
    return JSON.parse(localStorage.getItem(viewKey) ?? "{}") as OwnerView;
  } catch {
    return {};
  }
};

export const writeOwnerView = (view: OwnerView) => {
  localStorage.setItem(viewKey, JSON.stringify(view));
};

export const clearOwnerView = () => {
  localStorage.removeItem(viewKey);
};

export const currentSession = () => current;

export const resolveSession = async () => {
  const { data } = await supabase.auth.getSession();
  const userId = data.session?.user.id;
  current = null;
  if (!userId) return current;
  const owner = await run(
    supabase.from("owners").select("user_id").eq("user_id", userId).maybeSingle(),
  );
  if (owner) {
    current = { kind: "owner", ownerId: userId, ...readOwnerView() };
    return current;
  }
  const profile = await run<{ id: string; org_id: string } | null>(
    supabase.from("profiles").select("id, org_id").eq("user_id", userId).maybeSingle(),
  );
  if (profile) current = { kind: "member", userId: profile.id, orgId: profile.org_id };
  return current;
};

export const requireOrgId = () => {
  const orgId = activeOrgIdOf(current);
  if (!orgId) throw new Error("No organization selected");
  return orgId;
};

export const requireOwner = () => {
  if (current?.kind !== "owner") throw new Error("Only the platform owner can do that");
  return current;
};
