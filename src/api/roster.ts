import { delay, newId, updateDb } from "@/api/db";
import { requirePermission } from "@/api/guard";
import type { Assignment } from "@/utils/types";

export const addAssignment = async (slot: Omit<Assignment, "id">) => {
  await delay(100);
  requirePermission("roster.manage");
  const saved: Assignment = { ...slot, id: newId("r") };
  updateDb((db) => db.assignments.push(saved));
  return saved;
};

export const updateAssignment = async (slot: Assignment) => {
  await delay(100);
  requirePermission("roster.manage");
  updateDb((db) => {
    db.assignments = db.assignments.map((item) => (item.id === slot.id ? slot : item));
  });
  return slot;
};

export const removeAssignment = async (id: string) => {
  await delay(100);
  requirePermission("roster.manage");
  updateDb((db) => {
    db.assignments = db.assignments.filter((item) => item.id !== id);
  });
  return id;
};
