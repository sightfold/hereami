import { allPermissions, childPermissions } from "@/constants/permissions";
import routePath from "@/constants/route.json";
import type { OrgRole, OrgStatus, Permission, Session, User } from "@/utils/types";

export const activeOrgIdOf = (session: Session | null) => {
  if (!session) return null;
  return session.kind === "member" ? session.orgId : (session.viewOrgId ?? null);
};

export const actingUserIdOf = (session: Session | null) => {
  if (!session) return null;
  return session.kind === "member" ? session.userId : (session.viewAsUserId ?? null);
};

export const resolvePermissions = (
  session: Session | null,
  users: User[],
  roles: OrgRole[],
): Permission[] => {
  if (session?.kind === "owner" && !session.viewAsUserId) {
    return session.viewOrgId ? allPermissions : [];
  }
  const roleId = users.find((user) => user.id === actingUserIdOf(session))?.role;
  return roles.find((role) => role.id === roleId)?.permissions ?? [];
};

const adminRoutes: { href: string; anyOf: Permission[] }[] = [
  { href: routePath.Admin.Dashboard, anyOf: ["dashboard.view"] },
  { href: routePath.Admin.Attendance, anyOf: ["attendance.view"] },
  { href: routePath.Admin.Override, anyOf: ["attendance.override"] },
  { href: routePath.Admin.CheckInCode, anyOf: ["attendance.override"] },
  { href: routePath.Admin.Roster, anyOf: ["roster.manage"] },
  { href: routePath.Admin.ChildrenRegister, anyOf: childPermissions },
  { href: routePath.Admin.ChildrenRecords, anyOf: ["children.view", "children.manage"] },
  { href: routePath.Admin.ChildrenMonthly, anyOf: ["children.view"] },
  { href: routePath.Admin.ChildrenLeaderboard, anyOf: ["children.view"] },
  { href: routePath.Admin.Members, anyOf: ["members.manage"] },
  { href: routePath.Admin.Roles, anyOf: ["roles.manage"] },
  { href: routePath.Admin.Branding, anyOf: ["branding.manage"] },
  { href: routePath.Admin.Settings, anyOf: ["settings.manage", "departments.manage"] },
];

export const canOpenRoute = (href: string, permissions: Permission[]) => {
  const route = adminRoutes.find((item) => item.href === href);
  if (!route) return permissions.length > 0;
  return route.anyOf.some((permission) => permissions.includes(permission));
};

type HomeInput = {
  session: Session | null;
  permissions: Permission[];
  orgStatus?: OrgStatus;
};

export const homeFor = ({ session, permissions, orgStatus }: HomeInput) => {
  if (!session) return routePath.Auth.Login;
  if (session.kind === "owner" && !session.viewOrgId) return routePath.Owner.Console;
  if (session.kind === "member" && orgStatus === "suspended") return routePath.Auth.Suspended;
  const firstAdminRoute = adminRoutes.find(({ href }) => canOpenRoute(href, permissions));
  return firstAdminRoute?.href ?? routePath.Member.CheckIn;
};

export type Area = "member" | "admin" | "owner";

type AreaInput = HomeInput & { area: Area; hasUser: boolean; pathname: string };

export const canEnterArea = ({
  area,
  session,
  hasUser,
  permissions,
  orgStatus,
  pathname,
}: AreaInput) => {
  if (!session) return false;
  if (area === "owner") return session.kind === "owner";
  if (session.kind === "member" && orgStatus !== "active") return false;
  return area === "member" ? hasUser : canOpenRoute(pathname, permissions);
};
