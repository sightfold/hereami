import type { OrgRole, Permission } from "@/utils/types";

export const adminRoleId = "admin";
export const memberRoleId = "member";

export const permissionList: { id: Permission; label: string; hint: string }[] = [
  { id: "dashboard.view", label: "View dashboard", hint: "Today's numbers and live check-ins" },
  { id: "attendance.view", label: "View attendance", hint: "All records and filters" },
  { id: "attendance.override", label: "Manual check-in", hint: "Record someone with a reason" },
  { id: "roster.manage", label: "Manage roster", hint: "Assign duties and export rosters" },
  { id: "members.manage", label: "Manage members", hint: "Add, edit and remove people" },
  { id: "departments.manage", label: "Manage departments", hint: "Add, rename and delete" },
  { id: "settings.manage", label: "Check-in settings", hint: "Location, radius and late rule" },
  { id: "branding.manage", label: "Branding", hint: "Name, logo and colour" },
  { id: "roles.manage", label: "Roles and access", hint: "Create roles and assign them" },
  { id: "children.view", label: "View children", hint: "Records, monthly register and rankings" },
  { id: "children.mark", label: "Mark children's register", hint: "Present or absent per service" },
  { id: "children.manage", label: "Manage children", hint: "Add, edit, move, archive and classes" },
];

export const allPermissions: Permission[] = permissionList.map((item) => item.id);

export const childPermissions: Permission[] = ["children.view", "children.mark", "children.manage"];

export const defaultRoles: OrgRole[] = [
  { id: adminRoleId, name: "Administrator", permissions: allPermissions, isSystem: true },
  {
    id: "lead",
    name: "Team lead",
    permissions: ["dashboard.view", "attendance.view", "attendance.override", "roster.manage"],
  },
  {
    id: "teacher",
    name: "Children's teacher",
    permissions: ["children.view", "children.mark", "children.manage"],
  },
  { id: memberRoleId, name: "Member", permissions: [], isSystem: true },
];
