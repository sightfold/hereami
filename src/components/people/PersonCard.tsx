import Image from "next/image";
import ButtonBase from "@mui/material/ButtonBase";
import { gradientOf, initialsOf } from "@/components/ui/Avatar";
import { cn } from "@/utils/cn";

export type Pill = { label: string; dot?: string };

type PersonCardProps = {
  name: string;
  subtitle: string;
  photo?: string;
  pill?: Pill;
  tag?: string;
  isDim?: boolean;
  onClick?: () => void;
};

const PersonCard = ({ name, subtitle, photo, pill, tag, isDim, onClick }: PersonCardProps) => {
  const content = (
    <div className={cn("flex w-full flex-col gap-1.5 text-left", isDim && "opacity-55")}>
      <div
        className={cn(
          "relative flex aspect-square w-full items-center justify-center overflow-hidden rounded-2xl bg-linear-to-br",
          gradientOf(name),
        )}
      >
        {photo ? (
          <Image src={photo} alt={name} fill sizes="160px" className="object-cover" />
        ) : (
          <span className="font-serif text-4xl text-white/85">{initialsOf(name)}</span>
        )}
        {pill && (
          <span className="absolute top-1.5 left-1.5 inline-flex items-center gap-1 rounded-full bg-white/90 px-1.5 py-0.5 text-[10px] font-medium text-zinc-900 backdrop-blur">
            {pill.dot && <span className={cn("size-1.5 rounded-full", pill.dot)} />}
            {pill.label}
          </span>
        )}
        {tag && (
          <span className="absolute right-1.5 bottom-1.5 rounded-md bg-zinc-900/75 px-1.5 py-0.5 font-mono text-[10px] text-white">
            {tag}
          </span>
        )}
      </div>
      <div className="min-w-0 px-0.5">
        <p className="truncate text-xs font-medium">{name}</p>
        <p className="truncate text-[11px] text-muted">{subtitle}</p>
      </div>
    </div>
  );

  if (!onClick) return content;
  return (
    <ButtonBase onClick={onClick} className="rounded-2xl" focusRipple>
      {content}
    </ButtonBase>
  );
};

export default PersonCard;
