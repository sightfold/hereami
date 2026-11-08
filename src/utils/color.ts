const channelsOf = (hex: string) =>
  [1, 3, 5].map((start) => Number.parseInt(hex.slice(start, start + 2), 16));

const toHex = (channels: number[]) =>
  `#${channels.map((value) => Math.round(value).toString(16).padStart(2, "0")).join("")}`;

export const readableOn = (hex: string) => {
  const [red, green, blue] = channelsOf(hex);
  const luminance = (0.299 * red + 0.587 * green + 0.114 * blue) / 255;
  return luminance > 0.6 ? "#111111" : "#ffffff";
};

export const lighten = (hex: string, amount: number) =>
  toHex(channelsOf(hex).map((value) => value + (255 - value) * amount));
