"use client";

import type { ReactNode } from "react";
import { CalendarDays, Fingerprint, History, LayoutDashboard, Trophy } from "lucide-react";
import Logo from "@/components/layout/Logo";
import NavLink, { type NavItem } from "@/components/layout/NavLink";
import PoweredBy from "@/components/layout/PoweredBy";
import SignOutButton from "@/components/layout/SignOutButton";
import ThemeToggle from "@/components/layout/ThemeToggle";
import routePath from "@/constants/route.json";
import { useAppSelector } from "@/store";
import { selectHomePath, selectPermissions } from "@/store/selectors";

const memberItems: NavItem[] = [
  { href: routePath.Member.CheckIn, label: "Check in", icon: Fingerprint },
  { href: routePath.Member.Duties, label: "Duties", icon: CalendarDays },
  { href: routePath.Member.History, label: "History", icon: History },
  { href: routePath.Member.Leaderboard, label: "Ranks", icon: Trophy },
];

const MemberShell = ({ children }: { children: ReactNode }) => {
  const permissions = useAppSelector(selectPermissions);
  const home = useAppSelector(selectHomePath);
  const items: NavItem[] =
    permissions.length > 0
      ? [...memberItems, { href: home, label: "Admin", icon: LayoutDashboard }]
      : memberItems;

  return (
    <div className="mx-auto flex min-h-dvh max-w-lg flex-col">
      <header className="flex items-center justify-between gap-3 px-4 py-3">
        <Logo />
        <div className="flex shrink-0 items-center">
          <ThemeToggle />
          <SignOutButton />
        </div>
      </header>
      <main className="flex-1 px-4">{children}</main>
      <div className="px-4 pt-6 pb-24 text-center">
        <PoweredBy />
      </div>
      <nav className="fixed inset-x-0 bottom-0 border-t border-line bg-card/95 backdrop-blur">
        <div className="mx-auto flex max-w-lg pb-[env(safe-area-inset-bottom)]">
          {items.map((item) => (
            <NavLink key={item.href} item={item} layout="tab" />
          ))}
        </div>
      </nav>
    </div>
  );
};

export default MemberShell;
