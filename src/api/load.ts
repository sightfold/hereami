import { fetchAll, run, supabase } from "@/api/client";
import {
  toAssignment,
  toAttendance,
  toChild,
  toChildClass,
  toChildMark,
  toDepartment,
  toRole,
  toService,
  toSettings,
  toUser,
} from "@/api/mappers";
import { readPlatform } from "@/api/organizations";
import { resolveSession, writeOwnerView } from "@/api/session";
import { seedSettings } from "@/constants/seed";
import { todayKey } from "@/utils/date";
import { activeOrgIdOf } from "@/utils/permissions";
import type {
  Assignment,
  Attendance,
  Child,
  ChildClass,
  ChildMark,
  Department,
  OrgRole,
  Service,
  Session,
  Settings,
  User,
} from "@/utils/types";

export type OrgData = {
  departments: Department[];
  users: User[];
  roles: OrgRole[];
  services: Service[];
  attendance: Attendance[];
  assignments: Assignment[];
  settings: Settings;
  children: Child[];
  childClasses: ChildClass[];
  childMarks: ChildMark[];
};

const emptyData = (): OrgData => ({
  departments: [],
  users: [],
  roles: [],
  services: [],
  attendance: [],
  assignments: [],
  settings: seedSettings,
  children: [],
  childClasses: [],
  childMarks: [],
});

const table = (name: string, orgId: string) => supabase.from(name).select().eq("org_id", orgId);

const loadOrg = async (orgId: string): Promise<OrgData> => {
  await supabase.rpc("ensure_services", { org: orgId });
  const [
    departments,
    units,
    users,
    roles,
    services,
    attendance,
    assignments,
    settings,
    childClasses,
    children,
    childMarks,
  ] = await Promise.all([
    run(table("departments", orgId).order("created_at")),
    run(table("units", orgId).order("created_at")),
    fetchAll((from, to) => table("profiles", orgId).order("created_at").range(from, to)),
    run(table("roles", orgId).order("created_at")),
    fetchAll((from, to) => table("services", orgId).order("date").range(from, to)),
    fetchAll((from, to) => table("attendance", orgId).order("time").range(from, to)),
    fetchAll((from, to) => table("assignments", orgId).order("id").range(from, to)),
    run(table("org_settings", orgId).maybeSingle()),
    run(table("child_classes", orgId).order("created_at")),
    fetchAll((from, to) => table("children", orgId).order("serial").range(from, to)),
    fetchAll((from, to) =>
      table("child_marks", orgId).order("child_id").order("service_id").range(from, to),
    ),
  ]);
  return {
    departments: departments.map((row) => toDepartment(row, units)),
    users: users.map(toUser),
    roles: roles.map(toRole),
    services: services.map(toService),
    attendance: attendance.map(toAttendance),
    assignments: assignments.map(toAssignment),
    settings: settings ? toSettings(settings) : seedSettings,
    children: children.map(toChild),
    childClasses: childClasses.map(toChildClass),
    childMarks: childMarks.map(toChildMark),
  };
};

const settleView = (session: Session | null, data: OrgData): Session | null => {
  if (session?.kind !== "owner" || !session.viewAsUserId) return session;
  if (data.users.some((user) => user.id === session.viewAsUserId)) return session;
  const settled = { kind: session.kind, ownerId: session.ownerId, viewOrgId: session.viewOrgId };
  writeOwnerView({ viewOrgId: settled.viewOrgId });
  return settled;
};

export const loadEverything = async () => {
  const resolved = await resolveSession();
  const orgId = activeOrgIdOf(resolved);
  const db = orgId ? await loadOrg(orgId) : emptyData();
  const session = settleView(resolved, db);
  return { db, session, platform: await readPlatform(session), today: todayKey() };
};
