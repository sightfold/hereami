import { delay, newId, readDb, updateDb, type MockDb } from "@/api/db";
import { requirePermission } from "@/api/guard";
import { readSession } from "@/api/session";
import { isValidCode } from "@/utils/checkInCode";
import { toDateTime } from "@/utils/date";
import { activeOrgIdOf, actingUserIdOf } from "@/utils/permissions";
import type { OverrideForm } from "@/utils/schemas";
import type { Attendance, CheckInMethod } from "@/utils/types";

type CheckInInput = {
  serviceId: string;
  method: Exclude<CheckInMethod, "override">;
  distM?: number;
  code?: string;
};

const assertNotCheckedIn = (db: MockDb, userId: string, serviceId: string) => {
  const exists = db.attendance.some(
    (record) => record.userId === userId && record.serviceId === serviceId,
  );
  if (exists) throw new Error("Already checked in for this service");
};

export const checkIn = async ({ code, ...input }: CheckInInput) => {
  await delay(400);
  const session = readSession();
  const userId = actingUserIdOf(session);
  if (!userId) throw new Error("Sign in to check in");
  const db = readDb();
  assertNotCheckedIn(db, userId, input.serviceId);
  const service = db.services.find((item) => item.id === input.serviceId);
  if (!service) throw new Error("No service found for today");
  if (input.method === "gps" && (input.distM ?? Infinity) > db.settings.radiusM) {
    throw new Error("You are outside the church perimeter");
  }
  if (input.method === "qr" && !isValidCode(activeOrgIdOf(session) ?? "", service.id, code ?? "")) {
    throw new Error("That check-in code has expired. Scan the screen again.");
  }

  const serverTime = new Date();
  const lateAt = toDateTime(service.date, service.startTime);
  lateAt.setMinutes(lateAt.getMinutes() + db.settings.lateAfterMin);

  const record: Attendance = {
    id: newId("a"),
    userId,
    ...input,
    time: serverTime.toISOString(),
    status: serverTime > lateAt ? "late" : "onTime",
  };
  updateDb((draft) => draft.attendance.push(record));
  return record;
};

export const overrideCheckIn = async (form: OverrideForm) => {
  await delay();
  requirePermission("attendance.override");
  const session = readSession();
  const approvedBy = actingUserIdOf(session) ?? (session?.kind === "owner" ? session.ownerId : "");
  assertNotCheckedIn(readDb(), form.userId, form.serviceId);
  const record: Attendance = {
    id: newId("a"),
    userId: form.userId,
    serviceId: form.serviceId,
    time: new Date().toISOString(),
    status: "override",
    method: "override",
    reason: form.reason,
    approvedBy,
  };
  updateDb((draft) => draft.attendance.push(record));
  return record;
};
