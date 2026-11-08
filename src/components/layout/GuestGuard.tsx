"use client";

import type { ReactNode } from "react";
import useRedirect from "@/components/layout/useRedirect";
import Spinner from "@/components/ui/Spinner";
import { useAppSelector } from "@/store";
import { selectHomePath, selectSession } from "@/store/selectors";

const GuestGuard = ({ children }: { children: ReactNode }) => {
  const isReady = useAppSelector((state) => state.auth.isReady);
  const session = useAppSelector(selectSession);
  const home = useAppSelector(selectHomePath);

  useRedirect(!!session, home);

  if (!isReady || session) return <Spinner full />;
  return children;
};

export default GuestGuard;
