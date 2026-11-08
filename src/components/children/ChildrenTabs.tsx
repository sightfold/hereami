"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import routePath from "@/constants/route.json";
import { useAppSelector } from "@/store";
import { selectPermissions } from "@/store/selectors";
import { cn } from "@/utils/cn";
import { canOpenRoute } from "@/utils/permissions";

const tabs = [
  { href: routePath.Admin.ChildrenRegister, label: "Register" },
  { href: routePath.Admin.ChildrenRecords, label: "Children" },
  { href: routePath.Admin.ChildrenMonthly, label: "Monthly" },
  { href: routePath.Admin.ChildrenLeaderboard, label: "Leaderboard" },
];

const ChildrenTabs = () => {
  const pathname = usePathname();
  const permissions = useAppSelector(selectPermissions);
  return (
    <nav
      aria-label="Children's church"
      className="mb-5 flex gap-1 overflow-x-auto [scrollbar-width:none]"
    >
      {tabs
        .filter((tab) => canOpenRoute(tab.href, permissions))
        .map((tab) => (
          <Link
            key={tab.href}
            href={tab.href}
            aria-current={pathname === tab.href ? "page" : undefined}
            className={cn(
              "shrink-0 rounded-full px-2.5 py-1.5 text-sm transition sm:px-3.5",
              pathname === tab.href ? "bg-brand text-brand-fg" : "text-muted hover:bg-subtle",
            )}
          >
            {tab.label}
          </Link>
        ))}
    </nav>
  );
};

export default ChildrenTabs;
