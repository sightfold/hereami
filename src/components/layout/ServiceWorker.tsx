"use client";

import { useEffect } from "react";

const ServiceWorker = () => {
  useEffect(() => {
    if (process.env.NODE_ENV !== "production" || !("serviceWorker" in navigator)) return;
    navigator.serviceWorker.register("/sw.js", { scope: "/", updateViaCache: "none" });
  }, []);

  return null;
};

export default ServiceWorker;
