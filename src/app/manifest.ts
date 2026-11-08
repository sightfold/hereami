import type { MetadataRoute } from "next";
import routePath from "@/constants/route.json";

const manifest = (): MetadataRoute.Manifest => ({
  id: routePath.Member.CheckIn,
  name: "Here Am I",
  short_name: "Here Am I",
  description: "Check in for service and see your duties",
  start_url: routePath.Member.CheckIn,
  scope: "/",
  display: "standalone",
  orientation: "portrait",
  background_color: "#fafafa",
  theme_color: "#161616",
  categories: ["lifestyle", "productivity"],
  icons: [
    { src: "/icon-192.png", sizes: "192x192", type: "image/png", purpose: "any" },
    { src: "/icon-512.png", sizes: "512x512", type: "image/png", purpose: "any" },
    { src: "/icon-maskable-512.png", sizes: "512x512", type: "image/png", purpose: "maskable" },
    { src: "/icon.svg", sizes: "any", type: "image/svg+xml" },
  ],
  shortcuts: [
    { name: "Check in", url: routePath.Member.CheckIn },
    { name: "My duties", url: routePath.Member.Duties },
    { name: "My history", url: routePath.Member.History },
  ],
});

export default manifest;
