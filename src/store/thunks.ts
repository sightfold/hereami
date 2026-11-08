import { createAsyncThunk } from "@reduxjs/toolkit";
import * as attendanceApi from "@/api/attendance";
import * as authApi from "@/api/auth";
import * as childrenApi from "@/api/children";
import * as departmentsApi from "@/api/departments";
import { loadEverything } from "@/api/load";
import * as membersApi from "@/api/members";
import * as rosterApi from "@/api/roster";
import * as orgsApi from "@/api/organizations";
import * as rolesApi from "@/api/roles";
import * as settingsApi from "@/api/settings";

export const loadAll = createAsyncThunk("app/loadAll", loadEverything);

const withReload = <Arg>(type: string, action: (arg: Arg) => Promise<unknown>) =>
  createAsyncThunk(type, async (arg: Arg, { dispatch }) => {
    await action(arg);
    await dispatch(loadAll()).unwrap();
  });

export const signIn = withReload("auth/signIn", authApi.signIn);
export const signUp = withReload("auth/signUp", authApi.signUp);
export const signOut = withReload<void>("auth/signOut", authApi.signOut);

export const onboardOrganization = withReload("orgs/onboard", orgsApi.onboardOrganization);
export const updateBranding = withReload("orgs/branding", orgsApi.updateBranding);
export const setOrgStatus = withReload("orgs/status", orgsApi.setOrgStatus);
export const startSimulation = withReload("orgs/simulate", orgsApi.startSimulation);
export const stopSimulation = withReload<void>("orgs/stopSimulate", orgsApi.stopSimulation);
export const resetDemoData = withReload<void>("orgs/reset", orgsApi.resetDemoData);

export const saveRole = createAsyncThunk("roles/save", rolesApi.saveRole);
export const removeRole = createAsyncThunk("roles/remove", rolesApi.removeRole);
export const removeMember = createAsyncThunk("members/remove", membersApi.removeMember);

export const checkIn = createAsyncThunk("attendance/checkIn", attendanceApi.checkIn);
export const overrideCheckIn = createAsyncThunk(
  "attendance/override",
  attendanceApi.overrideCheckIn,
);

export const addAssignment = createAsyncThunk("roster/add", rosterApi.addAssignment);
export const updateAssignment = createAsyncThunk("roster/update", rosterApi.updateAssignment);
export const removeAssignment = createAsyncThunk("roster/remove", rosterApi.removeAssignment);

export const addMember = createAsyncThunk("members/add", membersApi.addMember);
export const updateMember = createAsyncThunk("members/update", membersApi.updateMember);

export const saveSettings = createAsyncThunk("settings/save", settingsApi.saveSettings);

export const addDepartment = createAsyncThunk("departments/add", departmentsApi.addDepartment);
export const updateDepartment = createAsyncThunk(
  "departments/update",
  departmentsApi.updateDepartment,
);
export const removeDepartment = createAsyncThunk(
  "departments/remove",
  departmentsApi.removeDepartment,
);

export const addChild = createAsyncThunk("children/add", childrenApi.addChild);
export const updateChild = createAsyncThunk("children/update", childrenApi.updateChild);
export const setChildArchived = createAsyncThunk("children/archive", childrenApi.setChildArchived);
export const moveChildren = createAsyncThunk("children/move", childrenApi.moveChildren);
export const setChildMark = createAsyncThunk("children/mark", childrenApi.setChildMark);
export const saveChildClass = createAsyncThunk("children/saveClass", childrenApi.saveChildClass);
export const removeChildClass = createAsyncThunk(
  "children/removeClass",
  childrenApi.removeChildClass,
);
