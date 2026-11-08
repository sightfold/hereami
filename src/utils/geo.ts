const earthRadiusM = 6_371_000;

const toRad = (deg: number) => (deg * Math.PI) / 180;

export const haversineM = (lat1: number, lng1: number, lat2: number, lng2: number) => {
  const dLat = toRad(lat2 - lat1);
  const dLng = toRad(lng2 - lng1);
  const a =
    Math.sin(dLat / 2) ** 2 +
    Math.cos(toRad(lat1)) * Math.cos(toRad(lat2)) * Math.sin(dLng / 2) ** 2;
  return Math.round(2 * earthRadiusM * Math.asin(Math.sqrt(a)));
};

const positionErrors: Record<number, string> = {
  1: "Location access is blocked. Allow it for this site in your browser settings, then try again.",
  2: "Your device could not find its location. Turn on location services and try again.",
  3: "Finding your location took too long. Move somewhere with better signal and try again.",
};

export const locationError = (error: unknown) => {
  if (error instanceof GeolocationPositionError) return positionErrors[error.code];
  return error instanceof Error ? error.message : "Could not read your location.";
};

const readPosition = (options: PositionOptions) =>
  new Promise<GeolocationPosition>((resolve, reject) => {
    navigator.geolocation.getCurrentPosition(resolve, reject, options);
  });

const isPermissionError = (error: unknown) =>
  error instanceof GeolocationPositionError && error.code === error.PERMISSION_DENIED;

export const getPosition = async () => {
  if (!isSecureContext) throw new Error("Location only works over HTTPS or on localhost.");
  if (!("geolocation" in navigator)) throw new Error("Location is not supported on this device.");
  try {
    return await readPosition({ enableHighAccuracy: true, timeout: 10_000, maximumAge: 0 });
  } catch (error) {
    if (isPermissionError(error)) throw error;
    return readPosition({ enableHighAccuracy: false, timeout: 15_000, maximumAge: 60_000 });
  }
};
