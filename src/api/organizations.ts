import { fetchAll, run, runOne, supabase } from "@/api/client";
import { toAuditEntry, toOrganization } from "@/api/mappers";
import { clearOwnerView, requireOwner, writeOwnerView } from "@/api/session";
import { adminRoleId } from "@/constants/permissions";
import type { BrandingForm, OnboardForm } from "@/utils/schemas";
import type { OrgStats, OrgStatus, Session } from "@/utils/types";

export const onboardOrganization = async (form: OnboardForm) => {
  requireOwner();
  await run(
    supabase.rpc("onboard_organization", {
      org_name: form.name,
      contact_name: form.contactName,
      contact_email: form.contactEmail,
      contact_phone: form.contactPhone,
      org_logo: form.logo ?? null,
      org_brand: form.brandColor ?? null,
    }),
  );
};

export const updateBranding = async ({
  orgId,
  values,
}: {
  orgId: string;
  values: BrandingForm;
}) => {
  await runOne(
    supabase
      .from("organizations")
      .update({ name: values.name, brand_color: values.brandColor, logo: values.logo ?? null })
      .eq("id", orgId)
      .select("id"),
  );
};

export const setOrgStatus = async ({ orgId, status }: { orgId: string; status: OrgStatus }) => {
  requireOwner();
  await runOne(supabase.from("organizations").update({ status }).eq("id", orgId).select("id"));
};

export const startSimulation = async ({ orgId, userId }: { orgId: string; userId?: string }) => {
  const { ownerId } = requireOwner();
  const org = await runOne<{ name: string }>(
    supabase.from("organizations").select("name").eq("id", orgId),
  );
  const person = userId
    ? await run<{ name: string } | null>(
        supabase.from("profiles").select("name").eq("id", userId).maybeSingle(),
      )
    : null;
  await run(
    supabase.from("audit_log").insert({
      owner_id: ownerId,
      org_id: orgId,
      org_name: org.name,
      target: person?.name ?? "Full access",
    }),
  );
  writeOwnerView({ viewOrgId: orgId, viewAsUserId: userId });
};

export const stopSimulation = async () => {
  requireOwner();
  clearOwnerView();
};

type PersonRow = { id: string; org_id: string; name: string; role: string };
type RoleRow = { org_id: string; id: string; name: string };

const statsFor = (orgId: string, people: PersonRow[], roles: RoleRow[]): OrgStats => {
  const members = people.filter((person) => person.org_id === orgId);
  const roleName = (id: string) =>
    roles.find((role) => role.org_id === orgId && role.id === id)?.name ?? id;
  return {
    members: members.length,
    admins: members.filter((person) => person.role === adminRoleId).length,
    people: members.map((person) => ({
      id: person.id,
      name: person.name,
      roleName: roleName(person.role),
    })),
  };
};

const ownerExtras = async (orgIds: string[]) => {
  const [people, roles, audit] = await Promise.all([
    fetchAll<PersonRow>((from, to) =>
      supabase.from("profiles").select("id, org_id, name, role").order("name").range(from, to),
    ),
    fetchAll<RoleRow>((from, to) =>
      supabase.from("roles").select("org_id, id, name").range(from, to),
    ),
    run(supabase.from("audit_log").select().order("time", { ascending: false }).limit(200)),
  ]);
  return {
    stats: Object.fromEntries(orgIds.map((id) => [id, statsFor(id, people, roles)])),
    auditLog: audit.map(toAuditEntry),
  };
};

export const readPlatform = async (session: Session | null) => {
  if (!session) return { organizations: [], stats: {}, auditLog: [] };
  const rows = await run(supabase.from("organizations").select().order("created_at"));
  const organizations = rows.map(toOrganization);
  if (session.kind !== "owner") return { organizations, stats: {}, auditLog: [] };
  return { organizations, ...(await ownerExtras(organizations.map((org) => org.id))) };
};
