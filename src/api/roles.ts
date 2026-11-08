import { delay, newId, readDb, updateDb } from "@/api/db";
import { requirePermission } from "@/api/guard";
import { adminRoleId } from "@/constants/permissions";
import { peopleCount } from "@/utils/count";
import { upsertById } from "@/utils/list";
import type { RoleForm } from "@/utils/schemas";
import type { OrgRole } from "@/utils/types";

export const saveRole = async (args: { id?: string; values: RoleForm }) => {
  await delay();
  requirePermission("roles.manage");
  if (args.id === adminRoleId) throw new Error("The Administrator role always has full access");
  const existing = readDb().roles.find((item) => item.id === args.id);
  const role: OrgRole = { ...existing, id: existing?.id ?? newId("role"), ...args.values };
  updateDb((db) => {
    db.roles = upsertById(db.roles, role);
  });
  return role;
};

export const removeRole = async (id: string) => {
  await delay();
  requirePermission("roles.manage");
  const db = readDb();
  const role = db.roles.find((item) => item.id === id);
  if (role?.isSystem) throw new Error(`${role.name} is a built-in role and can't be deleted`);
  const holders = db.users.filter((user) => user.role === id).length;
  if (holders > 0) throw new Error(`Move ${peopleCount(holders)} to another role first`);
  updateDb((draft) => {
    draft.roles = draft.roles.filter((item) => item.id !== id);
  });
  return id;
};
