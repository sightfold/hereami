import { createSlice } from "@reduxjs/toolkit";
import { loadAll, removeRole, saveRole } from "@/store/thunks";
import { removeById, upsertById } from "@/utils/list";
import type { OrgRole } from "@/utils/types";

const initialState: { list: OrgRole[] } = { list: [] };

const rolesSlice = createSlice({
  name: "roles",
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(loadAll.fulfilled, (state, action) => {
        state.list = action.payload.db.roles;
      })
      .addCase(saveRole.fulfilled, (state, action) => {
        state.list = upsertById(state.list, action.payload);
      })
      .addCase(removeRole.fulfilled, (state, action) => {
        state.list = removeById(state.list, action.payload);
      });
  },
});

export default rolesSlice.reducer;
