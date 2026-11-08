"use client";

import AppMark from "@/components/layout/AppMark";
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
        <AppMark className="size-8 rounded-lg dark:ring-1 dark:ring-white/15" />
      )}
      <span className="truncate">{brand?.name ?? "Here Am I"}</span>
    </span>
  );
};

export default Logo;
