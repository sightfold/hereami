"use client";

import { useEffect } from "react";
import { usePathname } from "next/navigation";
import routePath from "@/constants/route.json";
import { useAppSelector } from "@/store";
import { selectActiveOrg } from "@/store/selectors";
import { lighten, readableOn } from "@/utils/color";

const darkLift = 0.3;

const brandedAreas = [
  routePath.Member.CheckIn,
  routePath.Admin.Dashboard,
  routePath.Auth.Suspended,
];

const brandVars = (color: string) => {
  const dark = lighten(color, darkLift);
  return {
    "--org-brand": color,
    "--org-brand-fg": readableOn(color),
    "--org-brand-dark": dark,
    "--org-brand-dark-fg": readableOn(dark),
  };
};

const BrandTheme = () => {
  const pathname = usePathname();
  const org = useAppSelector(selectActiveOrg);
  const isBrandedArea = brandedAreas.some((area) => pathname.startsWith(area));
  const color = isBrandedArea ? org?.brandColor : undefined;
  const title = (isBrandedArea && org?.name) || "Here Am I";

  useEffect(() => {
    if (!color) return;
    const root = document.documentElement;
    const vars = Object.entries(brandVars(color));
    root.classList.add("org-branded");
    vars.forEach(([name, value]) => root.style.setProperty(name, value));
    return () => {
      root.classList.remove("org-branded");
      vars.forEach(([name]) => root.style.removeProperty(name));
    };
  }, [color]);

  return <title>{title}</title>;
};

export default BrandTheme;
