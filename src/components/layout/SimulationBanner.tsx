"use client";

import ButtonBase from "@mui/material/ButtonBase";
import { useRouter } from "next/navigation";
import { Eye } from "lucide-react";
import { useRunAction } from "@/components/ui/ErrorNotice";
import routePath from "@/constants/route.json";
import { useAppDispatch, useAppSelector } from "@/store";
import { selectCurrentUser, selectIsSimulating, selectOrgName } from "@/store/selectors";
import { stopSimulation } from "@/store/thunks";

const SimulationBanner = () => {
  const dispatch = useAppDispatch();
  const run = useRunAction();
  const router = useRouter();
  const isSimulating = useAppSelector(selectIsSimulating);
  const orgName = useAppSelector(selectOrgName);
  const user = useAppSelector(selectCurrentUser);

  if (!isSimulating) return null;

  const handleExit = async () => {
    if (await run(dispatch(stopSimulation()))) router.replace(routePath.Owner.Console);
  };

  return (
    <div className="sticky top-0 z-50 flex h-10 items-center gap-2 bg-amber-400 px-4 text-sm text-zinc-950">
      <Eye className="size-4 shrink-0" />
      <p className="min-w-0 flex-1 truncate">
        Viewing <strong>{orgName}</strong> as <strong>{user?.name ?? "full access"}</strong>
        <span className="hidden sm:inline"> (changes here are real)</span>
      </p>
      <ButtonBase
        onClick={handleExit}
        className="shrink-0 rounded-md bg-zinc-950 px-2.5 py-1 text-xs font-medium text-white"
      >
        Exit
      </ButtonBase>
    </div>
  );
};

export default SimulationBanner;
