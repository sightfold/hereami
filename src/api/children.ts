import { delay, newId, readDb, updateDb } from "@/api/db";
import { requirePermission } from "@/api/guard";
import { todayKey } from "@/utils/date";
import type { Child, ChildClass, ChildInput, ChildMark, MarkStatus } from "@/utils/types";

const requireManage = () => requirePermission("children.manage");

export const addChild = async (input: ChildInput) => {
  await delay();
  requireManage();
  const serial = readDb().children.reduce((top, child) => Math.max(top, child.serial), 0) + 1;
  const child: Child = {
    ...input,
    id: newId("c"),
    serial,
    archived: false,
    createdAt: new Date().toISOString(),
  };
  updateDb((db) => db.children.push(child));
  return child;
};

export const updateChild = async (child: Child) => {
  await delay();
  requireManage();
  updateDb((db) => {
    db.children = db.children.map((item) => (item.id === child.id ? child : item));
  });
  return child;
};

export const setChildArchived = async ({ id, archived }: { id: string; archived: boolean }) => {
  await delay();
  requireManage();
  updateDb((db) => {
    db.children = db.children.map((item) => (item.id === id ? { ...item, archived } : item));
  });
  return { id, archived };
};

export const moveChildren = async ({ ids, classId }: { ids: string[]; classId: string }) => {
  await delay();
  requireManage();
  updateDb((db) => {
    db.children = db.children.map((item) => (ids.includes(item.id) ? { ...item, classId } : item));
  });
  return { ids, classId };
};

type MarkInput = { childId: string; serviceId: string; status: MarkStatus | null };

export const setChildMark = async ({ childId, serviceId, status }: MarkInput) => {
  requirePermission("children.mark");
  const service = readDb().services.find((item) => item.id === serviceId);
  if (!service || service.date > todayKey()) throw new Error("That service hasn't happened yet");
  updateDb((db) => {
    const others = db.childMarks.filter(
      (mark) => mark.childId !== childId || mark.serviceId !== serviceId,
    );
    const next: ChildMark[] = status ? [{ childId, serviceId, status }] : [];
    db.childMarks = [...others, ...next];
  });
  return { childId, serviceId, status };
};

export const saveChildClass = async (input: Omit<ChildClass, "id"> & { id?: string }) => {
  await delay();
  requireManage();
  const saved: ChildClass = { ...input, id: input.id ?? newId("k") };
  updateDb((db) => {
    db.childClasses = input.id
      ? db.childClasses.map((item) => (item.id === saved.id ? saved : item))
      : [...db.childClasses, saved];
  });
  return saved;
};

export const removeChildClass = async (id: string) => {
  await delay();
  requireManage();
  const count = readDb().children.filter((child) => child.classId === id).length;
  if (count > 0) throw new Error(`Move the ${count} children in this class out first`);
  updateDb((db) => {
    db.childClasses = db.childClasses.filter((item) => item.id !== id);
  });
  return id;
};
