import { format, subDays, subMinutes } from "date-fns";
import { toDateTime } from "@/utils/date";
import type { Attendance, Service, Tone, User } from "@/utils/types";

export const pointRules = {
  earlyMin: 30,
  early: 15,
  onTime: 10,
  late: 4,
  override: 6,
  streakStep: 2,
  streakCap: 10,
};

export const levels = [
  { name: "Rookie", min: 0 },
  { name: "Regular", min: 40 },
  { name: "Pro", min: 90 },
  { name: "All-Star", min: 150 },
  { name: "Legend", min: 220 },
];

export type Standing = {
  user: User;
  rank: number;
  points: number;
  attended: number;
  total: number;
  early: number;
  late: number;
  streak: number;
  bestStreak: number;
};

export type Period = "week" | "month";

const periodDays: Record<Period, number> = { week: 7, month: 30 };

export const isEarly = (record: Attendance, service: Service) =>
  record.status === "onTime" &&
  new Date(record.time) <=
    subMinutes(toDateTime(service.date, service.startTime), pointRules.earlyMin);

export const pointsFor = (record: Attendance, service: Service) => {
  if (record.status !== "onTime") return pointRules[record.status];
  return isEarly(record, service) ? pointRules.early : pointRules.onTime;
};

export const streakBonus = (streak: number) =>
  Math.min((streak - 1) * pointRules.streakStep, pointRules.streakCap);

export const servicesIn = (services: Service[], period: Period, today: string) => {
  const from = format(subDays(new Date(today), periodDays[period]), "yyyy-MM-dd");
  return services.filter((service) => service.date >= from && service.date <= today);
};

const standingOf = (
  user: User,
  services: Service[],
  recordMap: Map<string, Attendance>,
  today: string,
): Omit<Standing, "rank"> => {
  const standing = {
    user,
    points: 0,
    attended: 0,
    total: 0,
    early: 0,
    late: 0,
    streak: 0,
    bestStreak: 0,
  };
  for (const service of services) {
    const record = recordMap.get(`${user.id}:${service.id}`);
    if (!record) {
      if (service.date < today) {
        standing.total += 1;
        standing.streak = 0;
      }
      continue;
    }
    standing.total += 1;
    standing.attended += 1;
    standing.streak += 1;
    standing.bestStreak = Math.max(standing.bestStreak, standing.streak);
    if (isEarly(record, service)) standing.early += 1;
    if (record.status === "late") standing.late += 1;
    standing.points += pointsFor(record, service) + streakBonus(standing.streak);
  }
  return standing;
};

export const rankStandings = (
  users: User[],
  services: Service[],
  records: Attendance[],
  today: string,
): Standing[] => {
  const recordMap = new Map(
    records.map((record) => [`${record.userId}:${record.serviceId}`, record]),
  );
  const ordered = services.toSorted((a, b) => a.date.localeCompare(b.date));
  return users
    .map((user) => standingOf(user, ordered, recordMap, today))
    .toSorted(
      (a, b) =>
        b.points - a.points || b.attended - a.attended || a.user.name.localeCompare(b.user.name),
    )
    .map((standing, index) => ({ ...standing, rank: index + 1 }));
};

export const levelOf = (points: number) => {
  const index = levels.findLastIndex((level) => points >= level.min);
  const level = levels[index];
  const next = levels[index + 1];
  const progress = next ? (points - level.min) / (next.min - level.min) : 1;
  return { ...level, number: index + 1, next, progress: Math.round(progress * 100) };
};

export const badgesOf = (standing: Standing) => {
  const badges: { label: string; tone: Tone }[] = [];
  if (standing.early >= 3) badges.push({ label: "Early bird", tone: "gold" });
  if (standing.streak >= 4) badges.push({ label: "On fire", tone: "warn" });
  if (standing.total > 0 && standing.attended === standing.total)
    badges.push({ label: "Perfect run", tone: "ok" });
  if (standing.attended > 0 && standing.late === 0)
    badges.push({ label: "Never late", tone: "brand" });
  return badges;
};
