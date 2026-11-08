import { createSlice } from "@reduxjs/toolkit";
import {
  addAssignment,
  loadAll,
  removeAssignment,
  removeDepartment,
  removeMember,
  updateAssignment,
  updateDepartment,
} from "@/store/thunks";
import { removeById, replaceById } from "@/utils/list";
import type { Assignment, Service } from "@/utils/types";

type RosterState = { services: Service[]; assignments: Assignment[] };

const initialState: RosterState = { services: [], assignments: [] };

const rosterSlice = createSlice({
  name: "roster",
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(loadAll.fulfilled, (state, action) => {
        state.services = action.payload.db.services;
        state.assignments = action.payload.db.assignments;
      })
      .addCase(addAssignment.fulfilled, (state, action) => {
        state.assignments.push(action.payload);
      })
      .addCase(updateAssignment.fulfilled, (state, action) => {
        state.assignments = replaceById(state.assignments, action.payload);
      })
      .addCase(removeAssignment.fulfilled, (state, action) => {
        state.assignments = removeById(state.assignments, action.payload);
      })
      .addCase(updateDepartment.fulfilled, (state, action) => {
        const { id, roles } = action.payload;
        state.assignments = state.assignments.filter(
          (slot) => slot.departmentId !== id || roles.includes(slot.role),
        );
      })
      .addCase(removeDepartment.fulfilled, (state, action) => {
        state.assignments = state.assignments.filter(
          (slot) => slot.departmentId !== action.payload,
        );
      })
      .addCase(removeMember.fulfilled, (state, action) => {
        state.assignments = state.assignments.filter((slot) => slot.userId !== action.payload);
      });
  },
});

export default rosterSlice.reducer;
