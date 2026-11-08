import { addDays, format, isSunday, nextSunday, previousSunday } from "date-fns";
import type {
  Assignment,
  Attendance,
  AttendanceStatus,
  Department,
  Service,
  Settings,
  User,
} from "@/utils/types";

export const seedSettings: Settings = {
  lat: 6.4541,
  lng: 3.3947,
  radiusM: 50,
  lateAfterMin: 15,
};

export const seedDepartments: Department[] = [
  { id: "audio", name: "Audio", roles: ["Front of House", "Monitors", "Stage Tech"] },
  { id: "cameras", name: "Cameras", roles: ["Camera 1", "Camera 2", "Camera 3", "Director"] },
  { id: "graphics", name: "Graphics", roles: ["Lyrics", "Lower Thirds"] },
  { id: "streaming", name: "Streaming", roles: ["Stream Operator", "Chat Moderator"] },
  { id: "children", name: "Children's Church", roles: ["Teacher", "Helper"] },
];

const withEmails = (people: Omit<User, "email">[], domain: string): User[] =>
  people.map((person) => ({
    ...person,
    email: `${person.name.toLowerCase().replaceAll(" ", ".")}@${domain}`,
  }));

export const seedUsers: User[] = withEmails(
  [
    {
      id: "u1",
      name: "Grace Okafor",
      phone: "+2348030000001",
      role: "admin",
      departments: ["streaming"],
      hasPasskey: true,
      isPrimaryAdmin: true,
      photo: "https://randomuser.me/api/portraits/women/16.jpg",
    },
    {
      id: "u2",
      name: "David Mensah",
      phone: "+2348030000002",
      role: "lead",
      departments: ["audio", "streaming"],
      hasPasskey: true,
    },
    {
      id: "u3",
      name: "Ruth Adeyemi",
      phone: "+2348030000003",
      role: "lead",
      departments: ["cameras", "graphics"],
      hasPasskey: true,
    },
    {
      id: "u4",
      name: "Samuel Eze",
      phone: "+2348030000004",
      role: "member",
      departments: ["audio"],
      hasPasskey: true,
      photo: "https://randomuser.me/api/portraits/men/30.jpg",
    },
    {
      id: "u5",
      name: "Esther Bello",
      phone: "+2348030000005",
      role: "member",
      departments: ["audio"],
      hasPasskey: true,
      photo: "https://randomuser.me/api/portraits/women/62.jpg",
    },
    {
      id: "u6",
      name: "Daniel Obi",
      phone: "+2348030000006",
      role: "member",
      departments: ["audio", "cameras"],
      hasPasskey: false,
      photo: "https://randomuser.me/api/portraits/men/54.jpg",
    },
    {
      id: "u7",
      name: "Mary Johnson",
      phone: "+2348030000007",
      role: "member",
      departments: ["cameras"],
      hasPasskey: true,
    },
    {
      id: "u8",
      name: "Peter Nwosu",
      phone: "+2348030000008",
      role: "member",
      departments: ["cameras"],
      hasPasskey: true,
    },
    {
      id: "u9",
      name: "Joy Ibrahim",
      phone: "+2348030000009",
      role: "member",
      departments: ["cameras"],
      hasPasskey: true,
    },
    {
      id: "u10",
      name: "Caleb Adebayo",
      phone: "+2348030000010",
      role: "member",
      departments: ["cameras", "streaming"],
      hasPasskey: true,
    },
    {
      id: "u11",
      name: "Hannah Uche",
      phone: "+2348030000011",
      role: "member",
      departments: ["graphics"],
      hasPasskey: true,
    },
    {
      id: "u12",
      name: "Joshua Afolabi",
      phone: "+2348030000012",
      role: "member",
      departments: ["graphics"],
      hasPasskey: false,
    },
    {
      id: "u13",
      name: "Deborah Kalu",
      phone: "+2348030000013",
      role: "member",
      departments: ["graphics", "streaming"],
      hasPasskey: true,
      photo: "https://randomuser.me/api/portraits/women/36.jpg",
    },
    {
      id: "u14",
      name: "Michael Ojo",
      phone: "+2348030000014",
      role: "member",
      departments: ["streaming"],
      hasPasskey: true,
      photo: "https://randomuser.me/api/portraits/men/91.jpg",
    },
    {
      id: "u15",
      name: "Naomi Chukwu",
      phone: "+2348030000015",
      role: "member",
      departments: ["streaming"],
      hasPasskey: true,
    },
    {
      id: "u16",
      name: "Isaac Lawal",
      phone: "+2348030000016",
      role: "member",
      departments: ["audio"],
      hasPasskey: true,
    },
    {
      id: "u17",
      name: "Lydia Etim",
      phone: "+2348030000017",
      role: "member",
      departments: ["cameras"],
      hasPasskey: true,
    },
    {
      id: "u18",
      name: "Elijah Musa",
      phone: "+2348030000018",
      role: "member",
      departments: ["graphics"],
      hasPasskey: true,
    },
    {
      id: "u19",
      name: "Miriam Okon",
      phone: "+2348030000019",
      role: "member",
      departments: ["audio", "graphics"],
      hasPasskey: true,
    },
    {
      id: "u20",
      name: "Aaron Danjuma",
      phone: "+2348030000020",
      role: "member",
      departments: ["streaming"],
      hasPasskey: false,
      photo: "https://randomuser.me/api/portraits/men/16.jpg",
    },
    {
      id: "u21",
      name: "Comfort Bello",
      phone: "+2348030000021",
      role: "teacher",
      departments: ["children"],
      hasPasskey: true,
    },
  ],
  "gracechapel.example",
);

export const livingWatersUsers: User[] = withEmails(
  [
    {
      id: "lw1",
      name: "Tobi Fashola",
      phone: "+2348040000001",
      role: "admin",
      departments: ["ushers"],
      hasPasskey: true,
      isPrimaryAdmin: true,
    },
    {
      id: "lw2",
      name: "Amara Nnadi",
      phone: "+2348040000002",
      role: "admin",
      departments: ["choir"],
      hasPasskey: true,
    },
    {
      id: "lw3",
      name: "Kunle Bassir",
      phone: "+2348040000003",
      role: "lead",
      departments: ["ushers"],
      hasPasskey: true,
    },
    {
      id: "lw4",
      name: "Ngozi Eke",
      phone: "+2348040000004",
      role: "member",
      departments: ["ushers"],
      hasPasskey: true,
    },
    {
      id: "lw5",
      name: "Femi Alade",
      phone: "+2348040000005",
      role: "member",
      departments: ["choir"],
      hasPasskey: true,
    },
    {
      id: "lw6",
      name: "Sarah Inyang",
      phone: "+2348040000006",
      role: "member",
      departments: ["choir"],
      hasPasskey: false,
    },
  ],
  "livingwaters.example",
);

export const livingWatersDepartments: Department[] = [
  { id: "ushers", name: "Ushers", roles: ["Front Door", "Main Hall"] },
  { id: "choir", name: "Choir", roles: ["Lead Vocal", "Backing Vocal", "Keys"] },
];

export const starterDepartments: Department[] = [
  { id: "ushers", name: "Ushers", roles: ["Front Door", "Main Hall"] },
  { id: "choir", name: "Choir", roles: ["Lead Vocal", "Backing Vocal"] },
  { id: "media", name: "Media", roles: ["Sound", "Camera", "Slides"] },
];

const dayKey = (date: Date) => format(date, "yyyy-MM-dd");

export const makeService = (date: Date, index: number): Service => ({
  id: `s${index}`,
  date: dayKey(date),
  name: isSunday(date) ? "Sunday Service" : "Midweek Service",
  startTime: isSunday(date) ? "09:00" : "18:00",
  callTime: isSunday(date) ? "07:30" : "16:30",
});

export const buildServices = (today = new Date()): Service[] => {
  const lastSunday = isSunday(today) ? addDays(today, -7) : previousSunday(today);
  const past = Array.from({ length: 8 }, (_, i) => addDays(lastSunday, -7 * (7 - i)));
  const firstNext = nextSunday(today);
  const upcoming = Array.from({ length: 4 }, (_, i) => addDays(firstNext, 7 * i));
  return [...past, today, ...upcoming].map(makeService);
};

const statusOf = (isOverride: boolean, isLate: boolean): AttendanceStatus => {
  if (isOverride) return "override";
  return isLate ? "late" : "onTime";
};

const seededRoll = (seed: number) => {
  const value = Math.sin(seed * 9301 + 49297) * 233280;
  return value - Math.floor(value);
};

export const buildAttendance = (
  services: Service[],
  users: User[] = seedUsers,
  today = new Date(),
): Attendance[] => {
  const pastServices = services.filter((service) => service.date < dayKey(today));
  const records: Attendance[] = [];
  pastServices.forEach((service, serviceIndex) => {
    users.forEach((user, userIndex) => {
      const roll = seededRoll(serviceIndex * 100 + userIndex);
      if (roll < 0.15) return;
      const isOverride = roll > 0.95;
      const isLate = !isOverride && roll > 0.8;
      const minutes = isLate ? 20 + Math.floor(roll * 30) : Math.floor(roll * 60) - 60;
      const [hour, min] = service.startTime.split(":").map(Number);
      const time = new Date(`${service.date}T00:00:00`);
      time.setHours(hour, min + minutes);
      records.push({
        id: `a${serviceIndex}-${userIndex}`,
        userId: user.id,
        serviceId: service.id,
        time: time.toISOString(),
        status: statusOf(isOverride, isLate),
        method: isOverride ? "override" : "gps",
        distM: isOverride ? undefined : Math.floor(roll * 45),
        reason: isOverride ? "Phone battery died" : undefined,
        approvedBy: isOverride ? users[1]?.id : undefined,
      });
    });
  });
  return records;
};

export const buildAssignments = (services: Service[]): Assignment[] => {
  const [first, second] = services.slice(-4);
  return [
    {
      id: "r1",
      serviceId: first.id,
      userId: "u2",
      departmentId: "audio",
      role: "Front of House",
      isLead: true,
    },
    {
      id: "r2",
      serviceId: first.id,
      userId: "u4",
      departmentId: "audio",
      role: "Monitors",
      isLead: false,
    },
    {
      id: "r3",
      serviceId: first.id,
      userId: "u3",
      departmentId: "cameras",
      role: "Director",
      isLead: true,
    },
    {
      id: "r4",
      serviceId: first.id,
      userId: "u7",
      departmentId: "cameras",
      role: "Camera 1",
      isLead: false,
    },
    {
      id: "r5",
      serviceId: first.id,
      userId: "u8",
      departmentId: "cameras",
      role: "Camera 2",
      isLead: false,
    },
    {
      id: "r6",
      serviceId: first.id,
      userId: "u11",
      departmentId: "graphics",
      role: "Lyrics",
      isLead: true,
    },
    {
      id: "r7",
      serviceId: first.id,
      userId: "u14",
      departmentId: "streaming",
      role: "Stream Operator",
      isLead: true,
    },
    {
      id: "r8",
      serviceId: second.id,
      userId: "u5",
      departmentId: "audio",
      role: "Front of House",
      isLead: false,
    },
    {
      id: "r9",
      serviceId: second.id,
      userId: "u9",
      departmentId: "cameras",
      role: "Camera 1",
      isLead: true,
    },
    {
      id: "r10",
      serviceId: second.id,
      userId: "u9",
      departmentId: "cameras",
      role: "Camera 2",
      isLead: false,
    },
    {
      id: "r11",
      serviceId: second.id,
      userId: "u15",
      departmentId: "graphics",
      role: "Lyrics",
      isLead: true,
    },
  ];
};
