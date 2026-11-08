import { run, supabase } from "@/api/client";
import { toAttendance } from "@/api/mappers";
import type { OverrideForm } from "@/utils/schemas";
import type { CheckInMethod } from "@/utils/types";

type CheckInInput = {
  serviceId: string;
  method: Exclude<CheckInMethod, "override">;
  lat?: number;
  lng?: number;
  code?: string;
};

export const checkIn = async ({ serviceId, method, lat, lng, code }: CheckInInput) => {
  const row = await run(
    supabase.rpc("check_in", { service: serviceId, check_method: method, lat, lng, code }),
  );
  return toAttendance(row);
};

export const overrideCheckIn = async (form: OverrideForm) => {
  const row = await run(
    supabase.rpc("override_check_in", {
      service: form.serviceId,
      member: form.userId,
      why: form.reason,
    }),
  );
  return toAttendance(row);
};

export const currentCheckInCode = async (serviceId: string) => {
  const rows = await run(supabase.rpc("current_checkin_code", { service: serviceId }));
  const [first] = rows as { code: string; seconds_left: number }[];
  return { code: first.code, secondsLeft: first.seconds_left };
};
