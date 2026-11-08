import { delay, updateDb } from "@/api/db";
import { requirePermission } from "@/api/guard";
import type { Settings } from "@/utils/types";

export const saveSettings = async (settings: Settings) => {
  await delay();
  requirePermission("settings.manage");
  updateDb((db) => {
    db.settings = settings;
  });
  return settings;
};
