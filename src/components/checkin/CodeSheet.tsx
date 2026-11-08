"use client";

import { useState, type FormEvent } from "react";
import QrScanner from "@/components/checkin/QrScanner";
import Button from "@/components/ui/Button";
import Input from "@/components/ui/Input";
import Sheet from "@/components/ui/Sheet";
import { readCode } from "@/utils/checkInCode";

type CodeSheetProps = {
  open: boolean;
  isValid: (code: string) => boolean;
  onCode: (code: string) => void;
  onCancel: () => void;
};

const CodeSheet = ({ open, isValid, onCode, onCancel }: CodeSheetProps) => {
  const [typed, setTyped] = useState("");
  const [error, setError] = useState("");
  const [attempt, setAttempt] = useState(0);

  const submit = (text: string) => {
    const code = readCode(text);
    if (code && isValid(code)) {
      setTyped("");
      setError("");
      onCode(code);
      return;
    }
    setError(
      code
        ? "That code has expired or isn't for today's service. Scan the screen again."
        : "That isn't a Heartbeat check-in code.",
    );
    setAttempt((value) => value + 1);
  };

  const handleSubmit = (event: FormEvent) => {
    event.preventDefault();
    submit(typed);
  };

  return (
    <Sheet open={open} title="Scan check-in code" onClose={onCancel}>
      <div className="flex flex-col gap-4">
        <p className="text-sm text-muted">
          Point your camera at the QR code on the screen inside the church.
        </p>
        <QrScanner key={attempt} onScan={submit} />
        {error && <p className="rounded-lg bg-bad-soft px-3 py-2 text-sm text-bad">{error}</p>}
        <form onSubmit={handleSubmit} className="flex gap-2">
          <Input
            value={typed}
            onChange={(event) => setTyped(event.target.value.replaceAll(/\D/g, "").slice(0, 6))}
            inputMode="numeric"
            placeholder="Or type the 6-digit code"
            inputProps={{ "aria-label": "Check-in code" }}
          />
          <Button type="submit" disabled={typed.length !== 6}>
            Check in
          </Button>
        </form>
      </div>
    </Sheet>
  );
};

export default CodeSheet;
