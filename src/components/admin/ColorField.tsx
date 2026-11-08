import ButtonBase from "@mui/material/ButtonBase";
import Input from "@/components/ui/Input";
import { cn } from "@/utils/cn";

const swatches = [
  "#161616",
  "#1e3a8a",
  "#3730a3",
  "#6d28d9",
  "#9f1239",
  "#7c2d12",
  "#b45309",
  "#0f766e",
];
const fallback = "#161616";

type ColorFieldProps = { value: string; error?: string; onChange: (value: string) => void };

const ColorField = ({ value, error, onChange }: ColorFieldProps) => {
  const isHex = /^#[0-9a-f]{6}$/i.test(value);

  return (
    <div className="flex flex-col gap-1.5 text-sm">
      <span className="font-medium">Brand colour</span>
      <div className="flex items-center gap-2">
        <input
          type="color"
          aria-label="Pick a colour"
          value={isHex ? value : fallback}
          onChange={(event) => onChange(event.target.value)}
          className="size-10 shrink-0 cursor-pointer rounded-lg border border-line bg-transparent"
        />
        <Input
          aria-label="Colour hex code"
          value={value}
          onChange={(event) => onChange(event.target.value)}
          className="font-mono"
        />
      </div>
      <div className="flex flex-wrap gap-2">
        {swatches.map((swatch) => (
          <ButtonBase
            key={swatch}
            aria-label={`Use ${swatch}`}
            onClick={() => onChange(swatch)}
            style={{ backgroundColor: swatch }}
            className={cn(
              "size-7 rounded-full ring-offset-2 ring-offset-card",
              swatch === value.toLowerCase() && "ring-2 ring-fg",
            )}
          />
        ))}
      </div>
      {error && <span className="text-xs text-bad">{error}</span>}
    </div>
  );
};

export default ColorField;
