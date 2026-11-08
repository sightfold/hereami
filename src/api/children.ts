import { run, runOne, supabase } from "@/api/client";
import { fromChild, fromChildClass, toChild, toChildClass } from "@/api/mappers";
import { requireOrgId } from "@/api/session";
import { todayKey } from "@/utils/date";
import type { Child, ChildClass, ChildInput, MarkStatus } from "@/utils/types";

export const addChild = async (input: ChildInput) => {
  const row = await runOne(
    supabase
      .from("children")
      .insert({ ...fromChild(input), org_id: requireOrgId() })
      .select(),
  );
  return toChild(row);
};

export const updateChild = async (child: Child) => {
  const row = await runOne(
    supabase.from("children").update(fromChild(child)).eq("id", child.id).select(),
  );
  return toChild(row);
};

export const setChildArchived = async ({ id, archived }: { id: string; archived: boolean }) => {
  await runOne(supabase.from("children").update({ archived }).eq("id", id).select("id"));
  return { id, archived };
};

export const moveChildren = async ({ ids, classId }: { ids: string[]; classId: string }) => {
  await runOne(supabase.from("children").update({ class_id: classId }).in("id", ids).select("id"));
  return { ids, classId };
};

type MarkInput = { childId: string; serviceId: string; status: MarkStatus | null };

const assertServiceStarted = async (serviceId: string) => {
  const service = await run<{ date: string } | null>(
    supabase.from("services").select("date").eq("id", serviceId).maybeSingle(),
  );
  if (!service || service.date > todayKey()) throw new Error("That service hasn't happened yet");
};

export const setChildMark = async ({ childId, serviceId, status }: MarkInput) => {
  await assertServiceStarted(serviceId);
  const marks = supabase.from("child_marks");
  const query = status
    ? marks.upsert({ org_id: requireOrgId(), child_id: childId, service_id: serviceId, status })
    : marks.delete().eq("child_id", childId).eq("service_id", serviceId);
  await run(query);
  return { childId, serviceId, status };
};

export const saveChildClass = async ({
  id,
  ...input
}: Omit<ChildClass, "id"> & { id?: string }) => {
  const classes = supabase.from("child_classes");
  const query = id
    ? classes.update(fromChildClass(input)).eq("id", id)
    : classes.insert({ ...fromChildClass(input), org_id: requireOrgId() });
  return toChildClass(await runOne(query.select()));
};

export const removeChildClass = async (id: string) => {
  const { count } = await supabase
    .from("children")
    .select("id", { count: "exact", head: true })
    .eq("class_id", id);
  if (count) throw new Error(`Move the ${count} children in this class out first`);
  await runOne(supabase.from("child_classes").delete().eq("id", id).select("id"));
  return id;
};
