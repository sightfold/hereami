"use client";

import { useState } from "react";
import { useAppDispatch, useAppSelector } from "@/store";
import { selectActiveOrg, selectSettings, selectTodayService } from "@/store/selectors";
import { checkIn } from "@/store/thunks";
import { isValidCode } from "@/utils/checkInCode";
import { getPosition, haversineM, locationError } from "@/utils/geo";
import type { CheckInMethod } from "@/utils/types";

export type Step = "idle" | "locating" | "outside" | "code" | "scanning" | "saving" | "error";

const useCheckIn = () => {
  const dispatch = useAppDispatch();
  const service = useAppSelector(selectTodayService);
  const settings = useAppSelector(selectSettings);
  const org = useAppSelector(selectActiveOrg);
  const [step, setStep] = useState<Step>("idle");
  const [distM, setDistM] = useState<number | null>(null);
  const [method, setMethod] = useState<Exclude<CheckInMethod, "override">>("gps");
  const [code, setCode] = useState("");
  const [error, setError] = useState("");

  const fail = (message: string) => {
    setError(message);
    setStep("error");
  };

  const start = async () => {
    setStep("locating");
    try {
      const { coords } = await getPosition();
      const dist = haversineM(coords.latitude, coords.longitude, settings.lat, settings.lng);
      setDistM(dist);
      setMethod("gps");
      setStep(dist <= settings.radiusM ? "scanning" : "outside");
    } catch (caught) {
      fail(locationError(caught));
    }
  };

  const chooseCode = () => setStep("code");

  const checkCode = (value: string) => !!org && !!service && isValidCode(org.id, service.id, value);

  const acceptCode = (value: string) => {
    setCode(value);
    setMethod("qr");
    setStep("scanning");
  };

  const confirm = async () => {
    if (!service) return;
    setStep("saving");
    const result = await dispatch(
      checkIn({
        serviceId: service.id,
        method,
        distM: method === "gps" ? (distM ?? undefined) : undefined,
        code: method === "qr" ? code : undefined,
      }),
    );
    if (checkIn.rejected.match(result)) fail(result.error.message ?? "Check-in failed");
    else setStep("idle");
  };

  const reset = () => setStep("idle");

  return {
    step,
    distM,
    error,
    settings,
    start,
    chooseCode,
    checkCode,
    acceptCode,
    confirm,
    reset,
  };
};

export default useCheckIn;
