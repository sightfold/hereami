import type { ReactElement, ReactNode } from "react";
import Chip from "@mui/material/Chip";
import { cn } from "@/utils/cn";
import type { Tone } from "@/utils/types";

const tones: Record<Tone, string> = {
  neutral: "bg-subtle text-muted",
  brand: "bg-brand-soft text-fg",
  ok: "bg-ok-soft text-ok",
  warn: "bg-warn-soft text-warn",
  bad: "bg-bad-soft text-bad",
  gold: "bg-gold-soft text-gold",
};

type BadgeProps = { tone?: Tone; icon?: ReactElement; dot?: boolean; children: ReactNode };

const Badge = ({ tone = "neutral", icon, dot, children }: BadgeProps) => (
  <Chip
    size="small"
    icon={dot ? <span className="ml-2 size-1.5 rounded-full bg-current" /> : icon}
    label={children}
    className={cn("h-6 text-xs [&_svg]:text-inherit", tones[tone])}
  />
);

export default Badge;
