import type { Session } from "@/utils/types";

const sessionKey = "heartbeat-session";

export const readSession = (): Session | null => {
  try {
    const parsed = JSON.parse(localStorage.getItem(sessionKey) ?? "null") as Session | null;
    return parsed?.kind ? parsed : null;
  } catch {
    return null;
  }
};

export const writeSession = (session: Session) => {
  localStorage.setItem(sessionKey, JSON.stringify(session));
};

export const clearSession = () => {
  localStorage.removeItem(sessionKey);
};
