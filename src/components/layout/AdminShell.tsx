"use client";

import { useState, type ReactNode } from "react";
import {
  CalendarRange,
  ClipboardList,
  Fingerprint,
  KeyRound,
  LayoutDashboard,
  Menu,
  Palette,
  QrCode,
  Sprout,
  Settings,
  ShieldCheck,
  Trophy,
  Users,
} from "lucide-react";
import Logo from "@/components/layout/Logo";
import NavLink, { type NavItem } from "@/components/layout/NavLink";
import PoweredBy from "@/components/layout/PoweredBy";
import SignOutButton from "@/components/layout/SignOutButton";
import ThemeToggle from "@/components/layout/ThemeToggle";
import IconButton from "@mui/material/IconButton";
import Avatar from "@/components/ui/Avatar";
import routePath from "@/constants/route.json";
import { useAppSelector } from "@/store";
import { selectCurrentUser, selectPermissions, selectRoleName } from "@/store/selectors";
import { cn } from "@/utils/cn";
import { canOpenRoute } from "@/utils/permissions";

const navItems: NavItem[] = [
  { href: routePath.Admin.Dashboard, label: "Dashboard", icon: LayoutDashboard },
  { href: routePath.Admin.Attendance, label: "Attendance", icon: ClipboardList },
  { href: routePath.Admin.CheckInCode, label: "Check-in code", icon: QrCode },
  { href: routePath.Admin.Override, label: "Manual check-in", icon: ShieldCheck },
  { href: routePath.Admin.Roster, label: "Roster", icon: CalendarRange },
  { href: routePath.Admin.Leaderboard, label: "Leaderboard", icon: Trophy },
  {
    href: routePath.Admin.ChildrenRegister,
    label: "Children's church",
    icon: Sprout,
    isSection: true,
  },
  { href: routePath.Admin.Members, label: "Members", icon: Users },
  { href: routePath.Admin.Roles, label: "Roles and access", icon: KeyRound },
  { href: routePath.Admin.Branding, label: "Branding", icon: Palette },
  { href: routePath.Admin.Settings, label: "Settings", icon: Settings },
];

const checkInItem: NavItem = {
  href: routePath.Member.CheckIn,
  label: "My check-in",
  icon: Fingerprint,
};

const AdminShell = ({ children }: { children: ReactNode }) => {
  const user = useAppSelector(selectCurrentUser);
  const permissions = useAppSelector(selectPermissions);
  const roleName = useAppSelector(selectRoleName);
  const [isOpen, setIsOpen] = useState(false);
  const items = navItems.filter((item) => canOpenRoute(item.href, permissions));

  return (
    <div className="min-h-dvh lg:flex">
      <header className="flex items-center justify-between gap-3 border-b border-line bg-card px-4 py-3 lg:hidden">
        <Logo />
        <IconButton size="small" aria-label="Open menu" onClick={() => setIsOpen(!isOpen)}>
          <Menu className="size-5" />
        </IconButton>
      </header>
      <aside
        className={cn(
          "flex-col border-r border-line bg-card p-4 lg:sticky lg:top-(--banner-h) lg:flex lg:h-[calc(100dvh-var(--banner-h))] lg:w-64 lg:shrink-0 lg:shadow-[2px_0_8px_-2px_rgb(0_0_0/0.1)]",
          isOpen ? "flex" : "hidden",
        )}
      >
        <div className="mb-6 hidden lg:block">
          <Logo />
        </div>
        <nav
          className="flex flex-1 flex-col gap-1 overflow-y-auto"
          onClick={() => setIsOpen(false)}
        >
          {items.map((item) => (
            <NavLink key={item.href} item={item} layout="side" />
          ))}
          {user && (
            <>
              <div className="my-2 border-t border-line" />
              <NavLink item={checkInItem} layout="side" />
            </>
          )}
        </nav>
        <div className="mt-4 border-t border-line pt-4">
          <div className="flex items-center gap-2">
            <Avatar name={user?.name ?? "Platform owner"} src={user?.photo} />
            <div className="min-w-0 flex-1">
              <p className="truncate text-sm font-medium">{user?.name ?? "Platform owner"}</p>
              <p className="truncate text-xs text-muted">
                {user ? roleName(user.role) : "Full access"}
              </p>
            </div>
            <ThemeToggle />
            <SignOutButton />
          </div>
          <div className="mt-3">
            <PoweredBy />
          </div>
        </div>
      </aside>
      <main className="min-w-0 flex-1 p-4 sm:p-6 lg:p-8">{children}</main>
    </div>
  );
};

export default AdminShell;
