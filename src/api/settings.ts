import { runOne, supabase } from "@/api/client";
import { toSettings } from "@/api/mappers";
import { requireOrgId } from "@/api/session";
import type { Settings } from "@/utils/types";

export const saveSettings = async (settings: Settings) => {
  const row = await runOne(
    supabase
      .from("org_settings")
      .update({
        lat: settings.lat,
        lng: settings.lng,
        radius_m: settings.radiusM,
        late_after_min: settings.lateAfterMin,
      })
      .eq("org_id", requireOrgId())
      .select(),
  );
  return toSettings(row);
};
