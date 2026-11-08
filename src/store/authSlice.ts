import { createSlice } from "@reduxjs/toolkit";
import { loadAll } from "@/store/thunks";
import { todayKey } from "@/utils/date";
import type { Session } from "@/utils/types";

type AuthState = { isReady: boolean; session: Session | null; today: string };

const initialState: AuthState = { isReady: false, session: null, today: todayKey() };

const authSlice = createSlice({
  name: "auth",
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder.addCase(loadAll.fulfilled, (state, action) => {
      state.isReady = true;
      state.session = action.payload.session;
      state.today = action.payload.today;
    });
  },
});

export default authSlice.reducer;
