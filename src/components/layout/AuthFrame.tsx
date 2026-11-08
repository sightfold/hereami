import type { ReactNode } from "react";
import Link from "next/link";
import Logo from "@/components/layout/Logo";
import ThemeToggle from "@/components/layout/ThemeToggle";
import routePath from "@/constants/route.json";

type AuthFrameProps = { title: string; subtitle: string; children: ReactNode };

const AuthFrame = ({ title, subtitle, children }: AuthFrameProps) => (
  <div className="mx-auto max-w-md px-4 py-8">
    <div className="mb-10 flex items-center justify-between">
      <Link href={routePath.Public.Home}>
        <Logo platform />
      </Link>
      <ThemeToggle />
    </div>
    <h1 className="font-serif text-4xl tracking-tight">{title}</h1>
    <p className="mt-1 mb-6 text-sm text-muted">{subtitle}</p>
    {children}
  </div>
);

export default AuthFrame;
