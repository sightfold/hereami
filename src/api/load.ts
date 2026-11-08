import { delay, readDb, type MockDb } from "@/api/db";
import { readPlatform } from "@/api/organizations";
import { clearSession, readSession, writeSession } from "@/api/session";
import { childPermissions } from "@/constants/permissions";
import { todayKey } from "@/utils/date";
import { actingUserIdOf, resolvePermissions } from "@/utils/permissions";

const settleSession = (db: MockDb) => {
  const session = readSession();
  const userId = actingUserIdOf(session);
  if (!session || !userId || db.users.some((user) => user.id === userId)) return false;
  if (session.kind === "member") clearSession();
  else writeSession({ kind: "owner", ownerId: session.ownerId, viewOrgId: session.viewOrgId });
  return true;
};

const visibleDb = (db: MockDb) => {
  const permissions = resolvePermissions(readSession(), db.users, db.roles);
  if (childPermissions.some((permission) => permissions.includes(permission))) return db;
  return { ...db, children: [], childMarks: [] };
};

export const loadEverything = async () => {
  await delay(150);
  const db = readDb();
  const current = settleSession(db) ? readDb() : db;
  return {
    db: visibleDb(current),
    session: readSession(),
    platform: readPlatform(),
    today: todayKey(),
  };
};
