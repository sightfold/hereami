"use client";

import { AlertCircle, CalendarX } from "lucide-react";
import CheckedInCard from "@/components/checkin/CheckedInCard";
import CheckInButton from "@/components/checkin/CheckInButton";
import CodeSheet from "@/components/checkin/CodeSheet";
import OutsideCard from "@/components/checkin/OutsideCard";
import ScanSheet from "@/components/checkin/ScanSheet";
import ServiceCard from "@/components/checkin/ServiceCard";
import StandingStrip from "@/components/checkin/StandingStrip";
import useCheckIn, { type Step } from "@/components/checkin/useCheckIn";
import Greeting from "@/components/layout/Greeting";
import Button from "@/components/ui/Button";
import Card from "@/components/ui/Card";
import Empty from "@/components/ui/Empty";
import { useAppSelector } from "@/store";
import {
  selectCurrentUser,
  selectOrgName,
  selectRecords,
  selectStandings,
  selectTodayService,
} from "@/store/selectors";

const buttonLabels: Partial<Record<Step, string>> = {
  locating: "Checking your location…",
  saving: "Recording arrival…",
};

const CheckInPage = () => {
  const user = useAppSelector(selectCurrentUser);
  const orgName = useAppSelector(selectOrgName);
  const service = useAppSelector(selectTodayService);
  const records = useAppSelector(selectRecords);
  const standings = useAppSelector(selectStandings);
  const { step, distM, error, settings, start, chooseCode, checkCode, acceptCode, confirm, reset } =
    useCheckIn();

  const record = records.find((item) => item.userId === user?.id && item.serviceId === service?.id);
  const standing = standings.find((item) => item.user.id === user?.id);

  if (!service) return <Empty icon={CalendarX} text="No service scheduled today." />;

  return (
    <div className="flex flex-col gap-4 pt-2">
      <Greeting name={user?.name} subtitle={`Check in when you arrive at ${orgName}.`} />
      <ServiceCard service={service} />
      {standing && <StandingStrip standing={standing} />}

      {record && <CheckedInCard record={record} service={service} />}

      {!record && step === "outside" && distM !== null && (
        <OutsideCard
          distM={distM}
          radiusM={settings.radiusM}
          onScanCode={chooseCode}
          onRetry={start}
        />
      )}

      {!record && step === "error" && (
        <Card className="flex items-start gap-3 border-bad/40 bg-bad-soft text-sm text-bad">
          <AlertCircle className="mt-0.5 size-4 shrink-0" />
          <div className="flex flex-1 flex-col gap-3">
            {error}
            <div className="flex gap-2">
              <Button size="sm" variant="outline" onClick={chooseCode}>
                Scan check-in code
              </Button>
              <Button size="sm" variant="ghost" onClick={reset}>
                OK
              </Button>
            </div>
          </div>
        </Card>
      )}

      {!record && step !== "outside" && (
        <CheckInButton
          isBusy={step === "locating" || step === "saving"}
          label={buttonLabels[step] ?? "Tap to check in"}
          onClick={start}
        />
      )}

      <CodeSheet open={step === "code"} isValid={checkCode} onCode={acceptCode} onCancel={reset} />
      <ScanSheet open={step === "scanning"} onDone={confirm} onCancel={reset} />
    </div>
  );
};

export default CheckInPage;
