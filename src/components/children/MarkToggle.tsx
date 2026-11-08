import ToggleButton from "@mui/material/ToggleButton";
import ToggleButtonGroup from "@mui/material/ToggleButtonGroup";
import { Check, X } from "lucide-react";
import type { MarkStatus } from "@/utils/types";

type MarkToggleProps = {
  name: string;
  value?: MarkStatus;
  isDisabled: boolean;
  onChange: (status: MarkStatus | null) => void;
};

const MarkToggle = ({ name, value, isDisabled, onChange }: MarkToggleProps) => (
  <ToggleButtonGroup
    exclusive
    size="small"
    disabled={isDisabled}
    value={value ?? null}
    aria-label={`Mark ${name}`}
    onChange={(_, next: MarkStatus | null) => onChange(next)}
  >
    <ToggleButton
      value="present"
      aria-label={`${name} present`}
      className="[&.Mui-selected]:bg-ok [&.Mui-selected]:text-white [&.Mui-selected:hover]:bg-ok"
    >
      <Check className="size-4" />
    </ToggleButton>
    <ToggleButton
      value="absent"
      aria-label={`${name} absent`}
      className="[&.Mui-selected]:bg-bad [&.Mui-selected]:text-white [&.Mui-selected:hover]:bg-bad"
    >
      <X className="size-4" />
    </ToggleButton>
  </ToggleButtonGroup>
);

export default MarkToggle;
