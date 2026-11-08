import { isEmailTaken } from "@/api/auth";
import { delay, newId, readDb, updateDb } from "@/api/db";
import { hasPermission, requirePermission } from "@/api/guard";
import { readSession } from "@/api/session";
import { adminRoleId, memberRoleId } from "@/constants/permissions";
import { actingUserIdOf } from "@/utils/permissions";
import type { MemberForm } from "@/utils/schemas";
import type { User } from "@/utils/types";

const findMember = (userId: string) => {
  const member = readDb().users.find((user) => user.id === userId);
  if (!member) throw new Error("Member not found");
  return member;
};

const assertCanAssign = (role: string, currentRole: string) => {
  if (role !== currentRole && !hasPermission("roles.manage")) {
    throw new Error("You don't have permission to change roles");
  }
};

export const addMember = async (form: MemberForm) => {
  await delay();
  requirePermission("members.manage");
  assertCanAssign(form.role, memberRoleId);
  if (isEmailTaken(form.email)) throw new Error("That email already has an account");
  const user: User = { ...form, id: newId("u"), hasPasskey: false };
  updateDb((db) => db.users.push(user));
  return user;
};

export const updateMember = async (user: User) => {
  await delay();
  requirePermission("members.manage");
  const current = findMember(user.id);
  assertCanAssign(user.role, current.role);
  if (current.isPrimaryAdmin && user.role !== adminRoleId) {
    throw new Error("The primary administrator always stays an Administrator");
  }
  if (current.email !== user.email && isEmailTaken(user.email)) {
    throw new Error("That email already has an account");
  }
  const saved = { ...user, isPrimaryAdmin: current.isPrimaryAdmin };
  updateDb((db) => {
    db.users = db.users.map((item) => (item.id === user.id ? saved : item));
  });
  return saved;
};

export const removeMember = async (userId: string) => {
  await delay();
  requirePermission("members.manage");
  if (userId === actingUserIdOf(readSession())) throw new Error("You can't remove yourself");
  if (findMember(userId).isPrimaryAdmin) {
    throw new Error("The primary administrator can't be removed");
  }
  updateDb((db) => {
    db.users = db.users.filter((user) => user.id !== userId);
    db.assignments = db.assignments.filter((slot) => slot.userId !== userId);
    db.attendance = db.attendance.filter((record) => record.userId !== userId);
  });
  return userId;
};
