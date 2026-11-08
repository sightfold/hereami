"use client";

import Link from "next/link";
import Logo from "@/components/layout/Logo";
import ThemeToggle from "@/components/layout/ThemeToggle";
import Button from "@/components/ui/Button";
import routePath from "@/constants/route.json";
import { useAppSelector } from "@/store";
import { selectHomePath, selectSession } from "@/store/selectors";

const LandingNav = () => {
  const session = useAppSelector(selectSession);
  const home = useAppSelector(selectHomePath);

  return (
    <header className="sticky top-0 z-40 border-b border-line bg-bg/90 backdrop-blur">
      <div className="mx-auto flex max-w-6xl items-center justify-between gap-3 px-4 py-3">
        <Logo platform />
        <div className="flex shrink-0 items-center gap-1 sm:gap-2">
          <ThemeToggle />
          {session ? (
            <Link href={home}>
              <Button size="sm">Open app</Button>
            </Link>
          ) : (
            <>
              <Link href={routePath.Auth.Login}>
                <Button size="sm" variant="ghost">
                  Sign in
                </Button>
              </Link>
              <Link href={routePath.Auth.Signup}>
                <Button size="sm">Get started</Button>
              </Link>
            </>
          )}
        </div>
      </div>
    </header>
  );
};

export default LandingNav;
