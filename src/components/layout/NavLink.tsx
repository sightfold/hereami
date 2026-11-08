"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import type { LucideIcon } from "lucide-react";
import { cn } from "@/utils/cn";

export type NavItem = { href: string; label: string; icon: LucideIcon; isSection?: boolean };

type NavLinkProps = { item: NavItem; layout: "tab" | "side" };

const NavLink = ({ item, layout }: NavLinkProps) => {
  const pathname = usePathname();
  const isActive = item.isSection ? pathname.startsWith(item.href) : pathname === item.href;
  const Icon = item.icon;

  if (layout === "tab")
    return (
      <Link
        href={item.href}
        className={cn(
          "flex flex-1 flex-col items-center gap-1 py-2 text-[11px] transition",
          isActive ? "text-fg" : "text-muted hover:text-fg",
        )}
      >
        <span
          className={cn(
            "flex h-7 w-12 items-center justify-center rounded-full",
            isActive && "bg-brand text-brand-fg",
          )}
        >
          <Icon className="size-4" />
        </span>
        {item.label}
      </Link>
    );

  return (
    <Link
      href={item.href}
      className={cn(
        "flex items-center gap-3 rounded-xl px-2 py-1.5 text-sm transition",
        isActive ? "font-medium text-fg" : "text-muted hover:text-fg",
      )}
    >
      <span
        className={cn(
          "flex size-8 items-center justify-center rounded-lg",
          isActive ? "bg-brand text-brand-fg" : "bg-subtle",
        )}
      >
        <Icon className="size-4" />
      </span>
      {item.label}
    </Link>
  );
};

export default NavLink;
