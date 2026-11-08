"use client";

import { useRouter } from "next/navigation";
import { ShieldAlert } from "lucide-react";
import AuthFrame from "@/components/layout/AuthFrame";
import useRedirect from "@/components/layout/useRedirect";
import Button from "@/components/ui/Button";
import Card from "@/components/ui/Card";
import Spinner from "@/components/ui/Spinner";
import routePath from "@/constants/route.json";
import { useAppDispatch, useAppSelector } from "@/store";
import { selectActiveOrg, selectHomePath, selectSession } from "@/store/selectors";
import { loadAll, signOut } from "@/store/thunks";

const SuspendedPage = () => {
  const dispatch = useAppDispatch();
  const router = useRouter();
  const isReady = useAppSelector((state) => state.auth.isReady);
  const session = useAppSelector(selectSession);
  const org = useAppSelector(selectActiveOrg);
  const home = useAppSelector(selectHomePath);
  const isSuspended = session?.kind === "member" && org?.status === "suspended";

  useRedirect(isReady && !isSuspended, home);

  if (!isReady || !isSuspended) return <Spinner full />;

  const handleSignOut = async () => {
    await dispatch(signOut());
    router.replace(routePath.Auth.Login);
  };

  return (
    <AuthFrame title={org?.name ?? "Your organization"} subtitle="This organization is suspended.">
      <Card className="flex flex-col items-center gap-3 p-6 text-center">
        <span className="flex size-12 items-center justify-center rounded-2xl bg-subtle">
          <ShieldAlert className="size-5" />
        </span>
        <p className="text-sm text-muted">
          Contact Heartbeat support to restore access. Your data has been kept.
        </p>
        <div className="flex flex-wrap justify-center gap-2">
          <Button onClick={() => dispatch(loadAll())}>Check again</Button>
          <Button variant="outline" onClick={handleSignOut}>
            Sign out
          </Button>
        </div>
      </Card>
    </AuthFrame>
  );
};

export default SuspendedPage;
