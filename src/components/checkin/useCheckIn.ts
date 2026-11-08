"use client";

import { useState } from "react";
import { useAppDispatch, useAppSelector } from "@/store";
import { selectSettings, selectTodayService } from "@/store/selectors";
import { checkIn } from "@/store/thunks";
import { isCodeFormat } from "@/utils/checkInCode";
import { getPosition, haversineM, locationError } from "@/utils/geo";
import type { CheckInMethod } from "@/utils/types";

export type Step = "idle" | "locating" | "outside" | "code" | "scanning" | "saving" | "error";

const useCheckIn = () => {
  const dispatch = useAppDispatch();
  const service = useAppSelector(selectTodayService);
  const settings = useAppSelector(selectSettings);
  const [step, setStep] = useState<Step>("idle");
  const [distM, setDistM] = useState<number | null>(null);
  const [coords, setCoords] = useState<{ lat: number; lng: number } | null>(null);
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
      setCoords({ lat: coords.latitude, lng: coords.longitude });
      setMethod("gps");
      setStep(dist <= settings.radiusM ? "scanning" : "outside");
    } catch (caught) {
      fail(locationError(caught));
    }
  };

  const chooseCode = () => setStep("code");

  const checkCode = (value: string) => !!service && isCodeFormat(value);

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
        lat: method === "gps" ? coords?.lat : undefined,
        lng: method === "gps" ? coords?.lng : undefined,
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
