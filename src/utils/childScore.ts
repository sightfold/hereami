import {
  levels,
  levelWindow,
  presentPoints,
  streakBadgeAt,
  streakCap,
  streakStep,
  type Level,
} from "@/constants/children";
import { childName } from "@/utils/children";
import { todayKey } from "@/utils/date";
import type { Child, ChildMark, MarkStatus, Service } from "@/utils/types";

export type MarkMap = Map<string, MarkStatus>;

const keyOf = (serviceId: string, childId: string) => `${serviceId}:${childId}`;

export const toMarkMap = (marks: ChildMark[]): MarkMap =>
  new Map(marks.map((mark) => [keyOf(mark.serviceId, mark.childId), mark.status]));

export const markOf = (map: MarkMap, serviceId: string, childId: string) =>
  map.get(keyOf(serviceId, childId));

export type ChildStats = {
  child: Child;
  points: number;
  attended: number;
  held: number;
  percent: number;
  streak: number;
  level: Level;
  isPerfect: boolean;
  isOnStreak: boolean;
};

export const heldServices = (services: Service[], marks: ChildMark[]) => {
  const marked = new Set(marks.map((mark) => mark.serviceId));
  return services
    .filter((service) => marked.has(service.id))
    .toSorted((a, b) => a.date.localeCompare(b.date));
};

const timeline = (child: Child, held: Service[], map: MarkMap) => {
  const since = child.createdAt.slice(0, 10);
  let streak = 0;
  return held
    .filter(
      (service) =>
        markOf(map, service.id, child.id) || (service.date >= since && service.date < todayKey()),
    )
    .map((service) => {
      const isPresent = markOf(map, service.id, child.id) === "present";
      streak = isPresent ? streak + 1 : 0;
      const bonus = Math.min(streakStep * streak, streakCap);
      return { service, isPresent, streak, points: isPresent ? presentPoints + bonus : 0 };
    });
};

const levelFor = (points: number) =>
  levels.find((level) => points >= level.min) ?? levels[levels.length - 1];

const childStats = (child: Child, held: Service[], map: MarkMap): ChildStats => {
  const entries = timeline(child, held, map);
  const attended = entries.filter((entry) => entry.isPresent).length;
  const streak = entries.at(-1)?.streak ?? 0;
  const recent = entries.slice(-levelWindow);
  return {
    child,
    points: entries.reduce((sum, entry) => sum + entry.points, 0),
    attended,
    held: entries.length,
    percent: entries.length ? Math.round((attended / entries.length) * 100) : 0,
    streak,
    level: levelFor(recent.reduce((sum, entry) => sum + entry.points, 0)),
    isPerfect: entries.length >= levelWindow && attended === entries.length,
    isOnStreak: streak >= streakBadgeAt,
  };
};

export const rankChildren = (children: Child[], services: Service[], marks: ChildMark[]) => {
  const held = heldServices(services, marks);
  const map = toMarkMap(marks);
  return children
    .map((child) => childStats(child, held, map))
    .sort(
      (a, b) =>
        b.points - a.points ||
        b.streak - a.streak ||
        childName(a.child).localeCompare(childName(b.child)),
    );
};

export const missedRun = (child: Child, services: Service[], marks: ChildMark[]) => {
  const entries = timeline(child, heldServices(services, marks), toMarkMap(marks));
  const lastPresent = entries.findLastIndex((entry) => entry.isPresent);
  return entries.length - 1 - lastPresent;
};
