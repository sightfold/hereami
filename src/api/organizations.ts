import {
  createBlankTenant,
  delay,
  newId,
  readRoot,
  resetRoot,
  updateRoot,
  type MockDb,
} from "@/api/db";
import { isEmailTaken } from "@/api/auth";
import { hasPermission, requireOwner } from "@/api/guard";
import { readSession, writeSession } from "@/api/session";
import { adminRoleId } from "@/constants/permissions";
import { activeOrgIdOf } from "@/utils/permissions";
import type { BrandingForm, OnboardForm } from "@/utils/schemas";
import type { OrgStats, OrgStatus } from "@/utils/types";

export const onboardOrganization = async (form: OnboardForm) => {
  await delay();
  requireOwner();
  if (isEmailTaken(form.contactEmail)) throw new Error("That email already has an account");
  const orgId = newId("org-");
  updateRoot((root) => {
    root.organizations.push({
      id: orgId,
      name: form.name,
      logo: form.logo,
      brandColor: form.brandColor,
      status: "active",
      createdAt: new Date().toISOString(),
      contactName: form.contactName,
      contactEmail: form.contactEmail,
    });
    root.tenants[orgId] = createBlankTenant({
      id: newId("u"),
      name: form.contactName,
      email: form.contactEmail,
      phone: form.contactPhone,
      role: adminRoleId,
      departments: [],
      hasPasskey: false,
    });
  });
};

export const updateBranding = async (args: { orgId: string; values: BrandingForm }) => {
  await delay();
  const session = readSession();
  const isOwner = session?.kind === "owner";
  const isOwnOrg = activeOrgIdOf(session) === args.orgId;
  if (!isOwner && !(isOwnOrg && hasPermission("branding.manage"))) {
    throw new Error("You don't have permission to do that");
  }
  updateRoot((root) => {
    root.organizations = root.organizations.map((item) =>
      item.id === args.orgId ? { ...item, ...args.values } : item,
    );
  });
};

export const setOrgStatus = async (args: { orgId: string; status: OrgStatus }) => {
  await delay();
  requireOwner();
  updateRoot((root) => {
    root.organizations = root.organizations.map((item) =>
      item.id === args.orgId ? { ...item, status: args.status } : item,
    );
  });
};

export const startSimulation = async (args: { orgId: string; userId?: string }) => {
  await delay();
  const session = requireOwner();
  const root = updateRoot((draft) => {
    const tenant = draft.tenants[args.orgId];
    const person = tenant?.users.find((user) => user.id === args.userId);
    draft.auditLog.unshift({
      id: newId("log"),
      ownerId: session.ownerId,
      orgId: args.orgId,
      orgName: draft.organizations.find((item) => item.id === args.orgId)?.name ?? "",
      target: person ? person.name : "Full access",
      time: new Date().toISOString(),
    });
  });
  if (!root.tenants[args.orgId]) throw new Error("Organization not found");
  writeSession({
    kind: "owner",
    ownerId: session.ownerId,
    viewOrgId: args.orgId,
    viewAsUserId: args.userId,
  });
};

export const stopSimulation = async () => {
  await delay(100);
  const { ownerId } = requireOwner();
  writeSession({ kind: "owner", ownerId });
};

export const resetDemoData = async () => {
  await delay();
  const { ownerId } = requireOwner();
  resetRoot();
  writeSession({ kind: "owner", ownerId: readRoot().owners[0]?.id ?? ownerId });
};

const statsFor = (tenant: MockDb): OrgStats => {
  const roleName = (id: string) => tenant.roles.find((role) => role.id === id)?.name ?? id;
  return {
    members: tenant.users.length,
    admins: tenant.users.filter((user) => user.role === adminRoleId).length,
    people: tenant.users.map((user) => ({
      id: user.id,
      name: user.name,
      roleName: roleName(user.role),
    })),
  };
};

export const readPlatform = () => {
  const session = readSession();
  const root = readRoot();
  const isOwner = session?.kind === "owner";
  const orgId = activeOrgIdOf(session);
  return {
    organizations: root.organizations.filter((item) => isOwner || item.id === orgId),
    stats: isOwner
      ? Object.fromEntries(
          root.organizations.map((item) => [item.id, statsFor(root.tenants[item.id])]),
        )
      : {},
    auditLog: isOwner ? root.auditLog : [],
  };
};
