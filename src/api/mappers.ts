import type {
  Assignment,
  Attendance,
  AuditEntry,
  Child,
  ChildClass,
  ChildMark,
  Department,
  Organization,
  OrgRole,
  Permission,
  Service,
  Settings,
  Unit,
  User,
} from "@/utils/types";

type Row = Record<string, unknown>;

const text = (value: unknown) => (value ?? "") as string;
const optional = (value: unknown) => (value ?? undefined) as string | undefined;
const hhmm = (value: unknown) => text(value).slice(0, 5);

export const toOrganization = (row: Row): Organization => ({
  id: text(row.id),
  name: text(row.name),
  logo: optional(row.logo),
  brandColor: optional(row.brand_color),
  status: row.status as Organization["status"],
  createdAt: text(row.created_at),
  contactName: text(row.contact_name),
  contactEmail: text(row.contact_email),
});

export const toSettings = (row: Row): Settings => ({
  lat: Number(row.lat),
  lng: Number(row.lng),
  radiusM: Number(row.radius_m),
  lateAfterMin: Number(row.late_after_min),
});

export const toRole = (row: Row): OrgRole => ({
  id: text(row.id),
  name: text(row.name),
  permissions: row.permissions as Permission[],
  isSystem: Boolean(row.is_system),
});

export const toUnit = (row: Row): Unit => ({ id: text(row.id), name: text(row.name) });

export const toDepartment = (row: Row, units: Row[]): Department => ({
  id: text(row.id),
  name: text(row.name),
  roles: row.roles as string[],
  units: units.filter((unit) => unit.department_id === row.id).map(toUnit),
});

export const toUser = (row: Row): User => ({
  id: text(row.id),
  name: text(row.name),
  email: text(row.email),
  phone: text(row.phone),
  role: text(row.role),
  departments: row.departments as string[],
  units: row.units as string[],
  hasPasskey: Boolean(row.has_passkey),
  isPrimaryAdmin: Boolean(row.is_primary_admin),
  photo: optional(row.photo),
});

export const fromUser = (user: Omit<User, "id" | "hasPasskey" | "isPrimaryAdmin">) => ({
  name: user.name,
  email: user.email,
  phone: user.phone,
  role: user.role,
  departments: user.departments,
  units: user.units,
  photo: user.photo ?? null,
});

export const toService = (row: Row): Service => ({
  id: text(row.id),
  date: text(row.date),
  name: text(row.name),
  startTime: hhmm(row.start_time),
  callTime: hhmm(row.call_time),
});

export const toAttendance = (row: Row): Attendance => ({
  id: text(row.id),
  userId: text(row.member_id),
  serviceId: text(row.service_id),
  time: text(row.time),
  status: row.status as Attendance["status"],
  method: row.method as Attendance["method"],
  distM: row.dist_m === null ? undefined : Number(row.dist_m),
  reason: optional(row.reason),
  approvedBy: optional(row.approved_by),
});

export const toAssignment = (row: Row): Assignment => ({
  id: text(row.id),
  serviceId: text(row.service_id),
  userId: text(row.member_id),
  departmentId: text(row.department_id),
  role: text(row.role),
  isLead: Boolean(row.is_lead),
});

export const fromAssignment = (slot: Omit<Assignment, "id">) => ({
  service_id: slot.serviceId,
  member_id: slot.userId,
  department_id: slot.departmentId,
  role: slot.role,
  is_lead: slot.isLead,
});

export const toChildClass = (row: Row): ChildClass => ({
  id: text(row.id),
  name: text(row.name),
  emoji: text(row.emoji),
  minAge: Number(row.min_age),
  maxAge: Number(row.max_age),
});

export const fromChildClass = (item: Omit<ChildClass, "id">) => ({
  name: item.name,
  emoji: item.emoji,
  min_age: item.minAge,
  max_age: item.maxAge,
});

export const toChild = (row: Row): Child => ({
  id: text(row.id),
  serial: Number(row.serial),
  firstName: text(row.first_name),
  surname: text(row.surname),
  dob: optional(row.dob),
  age: Number(row.age),
  gender: row.gender as Child["gender"],
  parentName: optional(row.parent_name),
  parentPhone: optional(row.parent_phone),
  classId: text(row.class_id),
  notes: optional(row.notes),
  archived: Boolean(row.archived),
  createdAt: text(row.created_at),
});

export const fromChild = (child: Omit<Child, "id" | "serial" | "archived" | "createdAt">) => ({
  first_name: child.firstName,
  surname: child.surname,
  dob: child.dob || null,
  age: child.age,
  gender: child.gender,
  parent_name: child.parentName || null,
  parent_phone: child.parentPhone || null,
  class_id: child.classId,
  notes: child.notes || null,
});

export const toChildMark = (row: Row): ChildMark => ({
  childId: text(row.child_id),
  serviceId: text(row.service_id),
  status: row.status as ChildMark["status"],
});

export const toAuditEntry = (row: Row): AuditEntry => ({
  id: text(row.id),
  ownerId: text(row.owner_id),
  orgId: text(row.org_id),
  orgName: text(row.org_name),
  target: text(row.target),
  time: text(row.time),
});
