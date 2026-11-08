import { defaultRoles } from "@/constants/permissions";
import {
  buildAssignments,
  buildAttendance,
  buildServices,
  livingWatersDepartments,
  livingWatersUsers,
  makeService,
  seedDepartments,
  seedSettings,
  seedUsers,
  starterDepartments,
} from "@/constants/seed";
import { buildChildMarks, buildChildren, starterClasses } from "@/constants/childSeed";
import { readSession } from "@/api/session";
import { todayKey } from "@/utils/date";
import { activeOrgIdOf } from "@/utils/permissions";
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
  Owner,
  Service,
  Settings,
  User,
} from "@/utils/types";

export type MockDb = {
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

export type RootDb = {
  organizations: Organization[];
  owners: Owner[];
  tenants: Record<string, MockDb>;
  auditLog: AuditEntry[];
};

const rootKey = "heartbeat-db-v10";

const seedTime = "2026-01-01T09:00:00.000Z";

const seedOrganizations: Organization[] = [
  {
    id: "org-grace",
    name: "Grace Chapel",
    status: "active",
    createdAt: seedTime,
    contactName: "Grace Okafor",
    contactEmail: "grace.okafor@gracechapel.example",
  },
  {
    id: "org-living-waters",
    name: "Living Waters Assembly",
    brandColor: "#0f766e",
    status: "active",
    createdAt: seedTime,
    contactName: "Tobi Fashola",
    contactEmail: "tobi.fashola@livingwaters.example",
  },
  {
    id: "org-st-marks",
    name: "St. Mark's Parish",
    brandColor: "#7c2d12",
    status: "active",
    createdAt: seedTime,
    contactName: "Paul Akpan",
    contactEmail: "paul.akpan@stmarks.example",
  },
];

const upcomingOnly = (services: Service[]) =>
  services.filter((service) => service.date >= todayKey());

export const createBlankTenant = (firstAdmin: User): MockDb => ({
  departments: starterDepartments,
  users: [{ ...firstAdmin, isPrimaryAdmin: true }],
  roles: defaultRoles,
  services: upcomingOnly(buildServices()),
  attendance: [],
  assignments: [],
  settings: seedSettings,
  children: [],
  childClasses: starterClasses,
  childMarks: [],
});

const createRoot = (): RootDb => {
  const services = buildServices();
  const livingWatersServices = buildServices();
  const children = buildChildren();
  const livingWatersChildren = buildChildren().slice(0, 8);
  return {
    organizations: seedOrganizations,
    owners: [{ id: "owner-1", name: "Platform owner", email: "owner@heartbeat.example" }],
    auditLog: [],
    tenants: {
      "org-grace": {
        departments: seedDepartments,
        users: seedUsers,
        roles: defaultRoles,
        services,
        attendance: buildAttendance(services),
        assignments: buildAssignments(services),
        settings: seedSettings,
        children,
        childClasses: starterClasses,
        childMarks: buildChildMarks(children, services),
      },
      "org-living-waters": {
        departments: livingWatersDepartments,
        users: livingWatersUsers,
        roles: defaultRoles,
        services: livingWatersServices,
        attendance: buildAttendance(livingWatersServices, livingWatersUsers),
        assignments: [],
        settings: seedSettings,
        children: livingWatersChildren,
        childClasses: starterClasses,
        childMarks: buildChildMarks(livingWatersChildren, livingWatersServices),
      },
      "org-st-marks": createBlankTenant({
        id: "sm1",
        name: "Paul Akpan",
        email: "paul.akpan@stmarks.example",
        phone: "+2348050000001",
        role: "admin",
        departments: [],
        hasPasskey: false,
      }),
    },
  };
};

const emptyDb = (): MockDb => ({
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

export const writeRoot = (root: RootDb) => {
  try {
    localStorage.setItem(rootKey, JSON.stringify(root));
  } catch {
    throw new Error("This device is out of storage space. Free some space and try again.");
  }
};

const parseRoot = () => {
  try {
    const raw = localStorage.getItem(rootKey);
    return raw ? (JSON.parse(raw) as RootDb) : null;
  } catch {
    return null;
  }
};

export const readRoot = (): RootDb => {
  const saved = parseRoot();
  if (saved) return saved;
  const fresh = createRoot();
  writeRoot(fresh);
  return fresh;
};

export const updateRoot = (change: (root: RootDb) => void) => {
  const root = readRoot();
  change(root);
  writeRoot(root);
  return root;
};

const ensureTodayService = (db: MockDb) => {
  if (db.services.some((service) => service.date === todayKey())) return false;
  db.services.push(makeService(new Date(), db.services.length));
  db.services.sort((a, b) => a.date.localeCompare(b.date));
  return true;
};

export const readDb = (): MockDb => {
  const orgId = activeOrgIdOf(readSession());
  if (!orgId) return emptyDb();
  const root = readRoot();
  const db = root.tenants[orgId];
  if (!db) return emptyDb();
  if (ensureTodayService(db)) writeRoot(root);
  return db;
};

export const updateDb = (change: (db: MockDb) => void) => {
  const orgId = activeOrgIdOf(readSession());
  if (!orgId) throw new Error("No organization selected");
  const root = readRoot();
  const db = root.tenants[orgId];
  if (!db) throw new Error("This organization no longer exists");
  change(db);
  writeRoot(root);
  return db;
};

export const resetRoot = () => {
  writeRoot(createRoot());
};

export const delay = (ms = 250) => new Promise((resolve) => setTimeout(resolve, ms));

export const newId = (prefix: string) =>
  `${prefix}${Date.now().toString(36)}${Math.random().toString(36).slice(2, 6)}`;
