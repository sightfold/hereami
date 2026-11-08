import { createSelector } from "@reduxjs/toolkit";
import type { RootState } from "@/store";
import { actingUserIdOf, activeOrgIdOf, homeFor, resolvePermissions } from "@/utils/permissions";
import { rankStandings } from "@/utils/points";

export const selectDepartments = (state: RootState) => state.departments.list;
export const selectUsers = (state: RootState) => state.members.users;
export const selectServices = (state: RootState) => state.roster.services;
export const selectAssignments = (state: RootState) => state.roster.assignments;
export const selectRecords = (state: RootState) => state.attendance.records;
export const selectSettings = (state: RootState) => state.settings;

export const selectSession = (state: RootState) => state.auth.session;
export const selectToday = (state: RootState) => state.auth.today;
export const selectRoles = (state: RootState) => state.roles.list;
export const selectOrganizations = (state: RootState) => state.platform.organizations;
export const selectOrgStats = (state: RootState) => state.platform.stats;
export const selectAuditLog = (state: RootState) => state.platform.auditLog;

export const selectCurrentUser = createSelector(
  [selectUsers, selectSession],
  (users, session) => users.find((user) => user.id === actingUserIdOf(session)) ?? null,
);

export const selectActiveOrg = createSelector(
  [selectOrganizations, selectSession],
  (organizations, session) =>
    organizations.find((item) => item.id === activeOrgIdOf(session)) ?? null,
);

export const selectOrgName = (state: RootState) => selectActiveOrg(state)?.name ?? "Here Am I";

export const selectIsSimulating = (state: RootState) => {
  const session = selectSession(state);
  return session?.kind === "owner" && !!session.viewOrgId;
};

export const selectPermissions = createSelector(
  [selectSession, selectUsers, selectRoles],
  resolvePermissions,
);

export const selectHomePath = createSelector(
  [selectSession, selectPermissions, selectActiveOrg],
  (session, permissions, org) => homeFor({ session, permissions, orgStatus: org?.status }),
);

export const selectRoleName = createSelector(
  [selectRoles],
  (roles) => (roleId: string) => roles.find((role) => role.id === roleId)?.name ?? roleId,
);

export const selectTodayService = createSelector(
  [selectServices, selectToday],
  (services, today) => services.find((service) => service.date === today) ?? null,
);

export const selectUpcoming = createSelector([selectServices, selectToday], (services, today) =>
  services.filter((service) => service.date > today),
);

export const selectUserMap = createSelector(
  [selectUsers],
  (users) => new Map(users.map((user) => [user.id, user])),
);

export const selectServiceMap = createSelector(
  [selectServices],
  (services) => new Map(services.map((service) => [service.id, service])),
);

export const selectStandings = createSelector(
  [selectUsers, selectServices, selectRecords, selectToday],
  rankStandings,
);

export const selectDepartmentMap = createSelector(
  [selectDepartments],
  (departments) => new Map(departments.map((department) => [department.id, department])),
);

export const selectDepartmentNames = createSelector(
  [selectDepartmentMap],
  (map) =>
    (ids: string[], unitIds: string[] = []) =>
      ids
        .map((id) => {
          const department = map.get(id);
          if (!department) return undefined;
          const units = department.units.filter((unit) => unitIds.includes(unit.id));
          if (units.length === 0) return department.name;
          return `${department.name} (${units.map((unit) => unit.name).join(", ")})`;
        })
        .filter(Boolean)
        .join(", "),
);

export const selectChildren = (state: RootState) => state.children.list;
export const selectChildClasses = (state: RootState) => state.children.classes;
export const selectChildMarks = (state: RootState) => state.children.marks;

export const selectActiveChildren = createSelector([selectChildren], (children) =>
  children.filter((child) => !child.archived),
);

export const selectHeldServices = createSelector([selectServices, selectToday], (services, today) =>
  services.filter((service) => service.date <= today),
);
