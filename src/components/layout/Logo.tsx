"use client";

import { HeartPulse } from "lucide-react";
import OrgMark from "@/components/layout/OrgMark";
import { useAppSelector } from "@/store";
import { selectActiveOrg } from "@/store/selectors";

const Logo = ({ platform }: { platform?: boolean }) => {
  const org = useAppSelector(selectActiveOrg);
  const brand = platform ? null : org;

  return (
    <span className="flex min-w-0 items-center gap-2 font-semibold">
      {brand ? (
        <OrgMark name={brand.name} logo={brand.logo} />
      ) : (
        <span className="flex size-8 shrink-0 items-center justify-center rounded-lg bg-brand text-brand-fg">
          <HeartPulse className="size-4" />
        </span>
      )}
      <span className="truncate">{brand?.name ?? "Here Am I"}</span>
    </span>
  );
};

export default Logo;
