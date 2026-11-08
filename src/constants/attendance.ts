import type { CheckInMethod } from "@/utils/types";

export const methodLabels: Record<CheckInMethod, string> = {
  gps: "GPS",
  qr: "QR code",
  override: "Manual",
};
