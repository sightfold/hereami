"use client";

import { useState } from "react";
import Popover from "@mui/material/Popover";
import { CircleHelp } from "lucide-react";
import { levels, pointRules } from "@/utils/points";

const rules = [
  { label: `Early bird (${pointRules.earlyMin}+ min before service)`, points: pointRules.early },
  { label: "On time", points: pointRules.onTime },
  { label: "Manual check-in", points: pointRules.override },
  { label: "Late", points: pointRules.late },
  { label: "Streak bonus per week in a row", points: pointRules.streakStep },
];

const PointRules = () => {
  const [anchor, setAnchor] = useState<HTMLElement | null>(null);

  return (
    <>
      <button
        type="button"
        aria-haspopup="dialog"
        aria-expanded={!!anchor}
        onClick={(event) => setAnchor(event.currentTarget)}
        className="inline-flex items-center gap-1.5 text-sm text-orange-300 underline decoration-dotted underline-offset-4 hover:text-orange-200"
      >
        <CircleHelp className="size-4" />
        How points work?
      </button>
      <Popover
        open={!!anchor}
        anchorEl={anchor}
        onClose={() => setAnchor(null)}
        anchorOrigin={{ vertical: "bottom", horizontal: "left" }}
        transformOrigin={{ vertical: "top", horizontal: "left" }}
        slotProps={{
          paper: {
            className:
              "mt-2 w-80 max-w-[calc(100vw-32px)] rounded-2xl border border-line p-4 shadow-lg",
          },
        }}
      >
        <h2 className="mb-3 text-sm font-semibold">How points work</h2>
        <ul className="flex flex-col gap-2 text-sm">
          {rules.map((rule) => (
            <li key={rule.label} className="flex justify-between gap-3">
              <span className="text-muted">{rule.label}</span>
              <span className="font-mono">+{rule.points}</span>
            </li>
          ))}
        </ul>
        <p className="mt-3 text-xs text-muted">
          Streak bonus caps at +{pointRules.streakCap}. Levels:{" "}
          {levels.map((level) => `${level.name} ${level.min}`).join(" · ")}
        </p>
      </Popover>
    </>
  );
};

export default PointRules;
