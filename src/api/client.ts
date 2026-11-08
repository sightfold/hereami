import { createClient, type PostgrestError } from "@supabase/supabase-js";

const projectUrl = process.env.NEXT_PUBLIC_SUPABASE_URL ?? "";
const anonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY ?? "";
const origin = projectUrl ? new URL(projectUrl).origin : "http://localhost";

export const supabase = createClient(origin, anonKey || "missing-key");

const noPermission = "You don't have permission to do that";

const friendlyMessages: Record<string, string> = {
  "23505": "That already exists. Use a different name or email.",
  "23503": "Something else still depends on this. Remove that first.",
  "42501": noPermission,
};

type Result<Data> = { data: Data | null; error: PostgrestError | null };

const toError = (error: PostgrestError) => {
  if (error.code === "23505" && error.message.includes("email")) {
    return new Error("That email already has an account");
  }
  return new Error(friendlyMessages[error.code] ?? error.message);
};

export const run = async <Data>(query: PromiseLike<Result<Data>>) => {
  const { data, error } = await query;
  if (error) throw toError(error);
  return data as Data;
};

export const runOne = async <Data>(query: PromiseLike<Result<Data[]>>) => {
  const rows = await run(query);
  if (!rows?.length) throw new Error(noPermission);
  return rows[0];
};

const pageSize = 1000;

export const fetchAll = async <Data>(
  page: (from: number, to: number) => PromiseLike<Result<Data[]>>,
) => {
  const rows: Data[] = [];
  for (let from = 0; ; from += pageSize) {
    const batch = await run(page(from, from + pageSize - 1));
    rows.push(...batch);
    if (batch.length < pageSize) return rows;
  }
};
