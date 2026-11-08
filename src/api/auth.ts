import type { AuthError } from "@supabase/supabase-js";
import { run, runOne, supabase } from "@/api/client";
import { clearOwnerView, resolveSession } from "@/api/session";
import routePath from "@/constants/route.json";
import type { JoinForm, SignInForm, SignUpForm } from "@/utils/schemas";

export type SignUpResult = { needsConfirmation: boolean };

const authMessages: Record<string, string> = {
  "Invalid login credentials": "Wrong email or password",
  "Email not confirmed": "Confirm your email first. Check your inbox for the link we sent.",
  "User already registered": "That email already has an account",
};

const toAuthError = (error: AuthError) => new Error(authMessages[error.message] ?? error.message);

const leave = async (message: string) => {
  await supabase.auth.signOut();
  throw new Error(message);
};

export const signIn = async ({ email, password }: SignInForm) => {
  const { error } = await supabase.auth.signInWithPassword({ email, password });
  if (error) throw toAuthError(error);
  const session = await resolveSession();
  if (!session) {
    return leave("This account isn't linked to a church yet. Ask your administrator to add you.");
  }
  if (session.kind !== "member") return;
  const org = await runOne<{ name: string; status: string }>(
    supabase.from("organizations").select("name, status").eq("id", session.orgId),
  );
  if (org.status === "suspended") {
    return leave(`${org.name} is suspended. Contact Here Am I support.`);
  }
};

const register = async (
  email: string,
  password: string,
  data: Record<string, string>,
): Promise<SignUpResult> => {
  const { data: result, error } = await supabase.auth.signUp({
    email,
    password,
    options: { data, emailRedirectTo: `${window.location.origin}${routePath.Auth.Login}` },
  });
  if (error) throw toAuthError(error);
  if (result.user?.identities?.length === 0) throw new Error("That email already has an account");
  return { needsConfirmation: !result.session };
};

export const signUp = (form: SignUpForm) =>
  register(form.email, form.password, {
    org_name: form.orgName,
    name: form.name,
    phone: form.phone,
  });

export const joinOrganization = async ({ email, password }: JoinForm) => {
  const invited = await run(supabase.rpc("is_invited", { email_address: email }));
  if (!invited) {
    throw new Error(
      "We couldn't find an invitation for that email. Ask your church administrator to add you first.",
    );
  }
  return register(email, password, {});
};

export const signOut = async () => {
  clearOwnerView();
  await supabase.auth.signOut();
};
