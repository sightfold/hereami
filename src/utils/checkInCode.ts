const prefix = "hereami";
const legacyPrefix = "heartbeat";

export const isCodeFormat = (value: string) => /^\d{6}$/.test(value);

export const qrPayload = (orgId: string, serviceId: string, code: string) =>
  `${prefix}:${orgId}:${serviceId}:${code}`;

export const readCode = (text: string) => {
  const trimmed = text.trim();
  if (isCodeFormat(trimmed)) return trimmed;
  const parts = trimmed.split(":");
  const known = parts[0] === prefix || parts[0] === legacyPrefix;
  return known && parts.length === 4 ? parts[3] : null;
};
