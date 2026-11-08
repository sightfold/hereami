import { createSlice } from "@reduxjs/toolkit";
import { addMember, loadAll, removeDepartment, removeMember, updateMember } from "@/store/thunks";
import { removeById, replaceById } from "@/utils/list";
import type { User } from "@/utils/types";

const initialState: { users: User[] } = { users: [] };

const membersSlice = createSlice({
  name: "members",
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(loadAll.fulfilled, (state, action) => {
        state.users = action.payload.db.users;
      })
      .addCase(addMember.fulfilled, (state, action) => {
        state.users.push(action.payload);
      })
      .addCase(updateMember.fulfilled, (state, action) => {
        state.users = replaceById(state.users, action.payload);
      })
      .addCase(removeMember.fulfilled, (state, action) => {
        state.users = removeById(state.users, action.payload);
      })
      .addCase(removeDepartment.fulfilled, (state, action) => {
        state.users.forEach((user) => {
          user.departments = user.departments.filter((id) => id !== action.payload);
        });
      });
  },
});

export default membersSlice.reducer;
