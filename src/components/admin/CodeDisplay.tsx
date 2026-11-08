"use client";

import { useEffect, useRef, useState } from "react";
import Image from "next/image";
import QRCode from "qrcode";
import { Maximize } from "lucide-react";
import Button from "@/components/ui/Button";
import Card from "@/components/ui/Card";
import { currentCheckInCode } from "@/api/attendance";
import { qrPayload } from "@/utils/checkInCode";
import { errorMessage } from "@/utils/error";
import type { Service } from "@/utils/types";

type CodeDisplayProps = { orgId: string; service: Service };

const windowSeconds = 30;

const CodeDisplay = ({ orgId, service }: CodeDisplayProps) => {
  const frameRef = useRef<HTMLDivElement>(null);
  const [image, setImage] = useState("");
  const [code, setCode] = useState("");
  const [secondsLeft, setSecondsLeft] = useState(0);
  const [error, setError] = useState("");

  useEffect(() => {
    let isActive = true;
    let timer: ReturnType<typeof setTimeout> | undefined;
    const refresh = async () => {
      try {
        const next = await currentCheckInCode(service.id);
        if (!isActive) return;
        setCode(next.code);
        setSecondsLeft(next.secondsLeft);
        setError("");
        timer = setTimeout(refresh, next.secondsLeft * 1000 + 300);
      } catch (caught) {
        if (!isActive) return;
        setError(errorMessage(caught));
        timer = setTimeout(refresh, 5000);
      }
    };
    refresh();
    return () => {
      isActive = false;
      clearTimeout(timer);
    };
  }, [service.id]);

  useEffect(() => {
    const ticker = setInterval(() => setSecondsLeft((value) => Math.max(0, value - 1)), 1000);
    return () => clearInterval(ticker);
  }, []);

  useEffect(() => {
    if (!code) return;
    QRCode.toDataURL(qrPayload(orgId, service.id, code), { margin: 1, width: 640 }).then(setImage);
  }, [orgId, service.id, code]);

  return (
    <Card
      ref={frameRef}
      className="flex flex-col items-center gap-5 py-8 text-center [&:fullscreen]:justify-center [&:fullscreen]:rounded-none"
    >
      <div>
        <p className="font-semibold">{service.name}</p>
        <p className="text-sm text-muted">Scan with Here Am I to check in</p>
      </div>
      <div className="w-full max-w-80 rounded-2xl bg-white p-3 [:fullscreen_&]:max-w-[min(70vh,90vw)]">
        {image && (
          <Image
            src={image}
            alt="Check-in QR code"
            width={640}
            height={640}
            unoptimized
            className="aspect-square w-full"
          />
        )}
      </div>
      {error && <p className="rounded-lg bg-bad-soft px-3 py-2 text-sm text-bad">{error}</p>}
      <p className="font-mono text-4xl tracking-[0.3em]">
        {code.slice(0, 3)} {code.slice(3)}
      </p>
      <div className="flex w-full max-w-80 flex-col gap-1.5">
        <div className="h-1.5 overflow-hidden rounded-full bg-subtle">
          <div
            className="h-full rounded-full bg-gold transition-[width] duration-1000 ease-linear"
            style={{ width: `${(secondsLeft / windowSeconds) * 100}%` }}
          />
        </div>
        <p className="text-xs text-muted">New code in {secondsLeft}s</p>
      </div>
      <Button
        variant="outline"
        onClick={() => frameRef.current?.requestFullscreen()}
        className="[:fullscreen_&]:hidden"
      >
        <Maximize className="size-4" />
        Show full screen
      </Button>
    </Card>
  );
};

export default CodeDisplay;
