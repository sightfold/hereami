import { createSlice } from "@reduxjs/toolkit";
import { loadAll } from "@/store/thunks";
import type { AuditEntry, Organization, OrgStats } from "@/utils/types";

type PlatformState = {
  organizations: Organization[];
  stats: Record<string, OrgStats>;
  auditLog: AuditEntry[];
};

const initialState: PlatformState = {
  organizations: [],
  stats: {},
  auditLog: [],
};

const platformSlice = createSlice({
  name: "platform",
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder.addCase(loadAll.fulfilled, (_, action) => action.payload.platform);
  },
});

export default platformSlice.reducer;
