import Image from "next/image";
import { cn } from "@/utils/cn";

type OrgMarkProps = { name: string; logo?: string; color?: string; className?: string };

const OrgMark = ({ name, logo, color, className }: OrgMarkProps) => {
  const frame = cn("size-8 shrink-0 rounded-lg", className);
  if (logo) {
    return (
      <Image
        src={logo}
        alt=""
        width={64}
        height={64}
        unoptimized
        className={cn(frame, "bg-white object-contain")}
      />
    );
  }
  return (
    <span
      style={color ? { backgroundColor: color } : undefined}
      className={cn(
        frame,
        "flex items-center justify-center bg-brand font-semibold text-brand-fg",
        color && "text-white",
      )}
    >
      {name.charAt(0).toUpperCase()}
    </span>
  );
};

export default OrgMark;
