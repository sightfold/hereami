export type Permission =
  | "dashboard.view"
  | "attendance.view"
  | "attendance.override"
  | "roster.manage"
  | "members.manage"
  | "departments.manage"
  | "settings.manage"
  | "branding.manage"
  | "roles.manage"
  | "children.view"
  | "children.mark"
  | "children.manage";

export type OrgRole = { id: string; name: string; permissions: Permission[]; isSystem?: boolean };

export type OrgStatus = "active" | "suspended";

export type Tone = "neutral" | "brand" | "ok" | "warn" | "bad" | "gold";

export type Organization = {
  id: string;
  name: string;
  logo?: string;
  brandColor?: string;
  status: OrgStatus;
  createdAt: string;
  contactName: string;
  contactEmail: string;
};

export type Owner = { id: string; name: string; email: string };

export type Session =
  | { kind: "owner"; ownerId: string; viewOrgId?: string; viewAsUserId?: string }
  | { kind: "member"; userId: string; orgId: string };

export type AuditEntry = {
  id: string;
  ownerId: string;
  orgId: string;
  orgName: string;
  target: string;
  time: string;
};

export type OrgPerson = { id: string; name: string; roleName: string };

export type OrgStats = { members: number; admins: number; people: OrgPerson[] };

export type Unit = { id: string; name: string };

export type Department = { id: string; name: string; roles: string[]; units: Unit[] };

export type DepartmentInput = { name: string; roles: string[]; units: string[] };

export type User = {
  id: string;
  name: string;
  email: string;
  phone: string;
  role: string;
  departments: string[];
  units: string[];
  hasPasskey: boolean;
  isPrimaryAdmin?: boolean;
  photo?: string;
};

export type Service = {
  id: string;
  date: string;
  name: string;
  startTime: string;
  callTime: string;
};

export type AttendanceStatus = "onTime" | "late" | "override";

export type CheckInMethod = "gps" | "qr" | "override";

export type Attendance = {
  id: string;
  userId: string;
  serviceId: string;
  time: string;
  status: AttendanceStatus;
  method: CheckInMethod;
  distM?: number;
  reason?: string;
  approvedBy?: string;
};

export type Assignment = {
  id: string;
  serviceId: string;
  userId: string;
  departmentId: string;
  role: string;
  isLead: boolean;
};

export type Settings = {
  lat: number;
  lng: number;
  radiusM: number;
  lateAfterMin: number;
};

export type Gender = "male" | "female";

export type ChildClass = {
  id: string;
  name: string;
  emoji: string;
  minAge: number;
  maxAge: number;
};

export type Child = {
  id: string;
  serial: number;
  firstName: string;
  surname: string;
  dob?: string;
  age: number;
  gender: Gender;
  parentName?: string;
  parentPhone?: string;
  classId: string;
  notes?: string;
  archived: boolean;
  createdAt: string;
};

export type ChildInput = Omit<Child, "id" | "serial" | "archived" | "createdAt">;

export type MarkStatus = "present" | "absent";

export type ChildMark = { childId: string; serviceId: string; status: MarkStatus };

export type Conflict = {
  kind: "double" | "noLead" | "wrongDepartment";
  message: string;
  userId?: string;
  departmentId?: string;
};
