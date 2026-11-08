import { readDb } from "@/api/db";
import { readSession } from "@/api/session";
import { resolvePermissions } from "@/utils/permissions";
import type { Permission } from "@/utils/types";

export const hasPermission = (permission: Permission) => {
  const { users, roles } = readDb();
  return resolvePermissions(readSession(), users, roles).includes(permission);
};

export const requirePermission = (permission: Permission) => {
  if (!hasPermission(permission)) throw new Error("You don't have permission to do that");
};

export const requireOwner = () => {
  const session = readSession();
  if (session?.kind !== "owner") throw new Error("Only the platform owner can do that");
  return session;
};
