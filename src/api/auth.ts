import { delay, newId, readRoot, updateRoot, createBlankTenant } from "@/api/db";
import { clearSession, writeSession } from "@/api/session";
import { adminRoleId } from "@/constants/permissions";
import type { SignInForm, SignUpForm } from "@/utils/schemas";
import type { User } from "@/utils/types";

const sameEmail = (left: string, right: string) => left.toLowerCase() === right.toLowerCase();

export const findMember = (email: string) => {
  const root = readRoot();
  for (const organization of root.organizations) {
    const user = root.tenants[organization.id]?.users.find((item) => sameEmail(item.email, email));
    if (user) return { organization, user };
  }
  return null;
};

export const isEmailTaken = (email: string) =>
  !!findMember(email) || readRoot().owners.some((owner) => sameEmail(owner.email, email));

export const signIn = async ({ email }: SignInForm) => {
  await delay();
  const owner = readRoot().owners.find((item) => sameEmail(item.email, email));
  if (owner) {
    writeSession({ kind: "owner", ownerId: owner.id });
    return;
  }
  const match = findMember(email);
  if (!match) throw new Error("We couldn't find an account with that email");
  if (match.organization.status === "suspended") {
    throw new Error(`${match.organization.name} is suspended. Contact Heartbeat support.`);
  }
  writeSession({ kind: "member", userId: match.user.id, orgId: match.organization.id });
};

export const signUp = async (form: SignUpForm) => {
  await delay();
  if (isEmailTaken(form.email)) throw new Error("That email already has an account");
  const orgId = newId("org-");
  const firstAdmin: User = {
    id: newId("u"),
    name: form.name,
    email: form.email,
    phone: form.phone,
    role: adminRoleId,
    departments: [],
    hasPasskey: false,
  };
  updateRoot((root) => {
    root.organizations.push({
      id: orgId,
      name: form.orgName,
      status: "active",
      createdAt: new Date().toISOString(),
      contactName: form.name,
      contactEmail: form.email,
    });
    root.tenants[orgId] = createBlankTenant(firstAdmin);
  });
  writeSession({ kind: "member", userId: firstAdmin.id, orgId });
};

export const signOut = async () => {
  clearSession();
};
