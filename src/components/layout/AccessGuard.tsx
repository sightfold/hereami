"use client";

import type { ReactNode } from "react";
import { usePathname } from "next/navigation";
import SimulationBanner from "@/components/layout/SimulationBanner";
import useRedirect from "@/components/layout/useRedirect";
import Spinner from "@/components/ui/Spinner";
import { useAppSelector } from "@/store";
import {
  selectActiveOrg,
  selectCurrentUser,
  selectHomePath,
  selectIsSimulating,
  selectPermissions,
  selectSession,
} from "@/store/selectors";
import { cn } from "@/utils/cn";
import { canEnterArea, type Area } from "@/utils/permissions";

type AccessGuardProps = { area: Area; children: ReactNode };

const AccessGuard = ({ area, children }: AccessGuardProps) => {
  const pathname = usePathname();
  const isReady = useAppSelector((state) => state.auth.isReady);
  const session = useAppSelector(selectSession);
  const user = useAppSelector(selectCurrentUser);
  const permissions = useAppSelector(selectPermissions);
  const org = useAppSelector(selectActiveOrg);
  const home = useAppSelector(selectHomePath);
  const isSimulating = useAppSelector(selectIsSimulating);
  const isAllowed = canEnterArea({
    area,
    session,
    hasUser: !!user,
    permissions,
    orgStatus: org?.status,
    pathname,
  });

  useRedirect(isReady && !isAllowed, home);

  if (!isReady || !isAllowed) return <Spinner full />;

  return (
    <div className={cn(isSimulating && "[--banner-h:2.5rem]")}>
      <SimulationBanner />
      {children}
    </div>
  );
};

export default AccessGuard;
