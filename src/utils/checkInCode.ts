export const codeWindowMs = 30_000;

const prefix = "heartbeat";

const hash = (text: string) => {
  let value = 2_166_136_261;
  for (const char of text) {
    value ^= char.codePointAt(0) ?? 0;
    value = Math.imul(value, 16_777_619);
  }
  return value >>> 0;
};

export const windowOf = (time: number) => Math.floor(time / codeWindowMs);

export const codeFor = (orgId: string, serviceId: string, window: number) =>
  String(hash(`${orgId}:${serviceId}:${window}`) % 1_000_000).padStart(6, "0");

export const qrPayload = (orgId: string, serviceId: string, code: string) =>
  `${prefix}:${orgId}:${serviceId}:${code}`;

export const readCode = (text: string) => {
  const trimmed = text.trim();
  if (/^\d{6}$/.test(trimmed)) return trimmed;
  const parts = trimmed.split(":");
  return parts[0] === prefix && parts.length === 4 ? parts[3] : null;
};

export const isValidCode = (orgId: string, serviceId: string, code: string, now = Date.now()) => {
  const window = windowOf(now);
  return [window, window - 1].some((item) => codeFor(orgId, serviceId, item) === code);
};
