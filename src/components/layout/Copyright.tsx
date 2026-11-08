"use client";

import { useSyncExternalStore } from "react";

const subscribe = () => () => {};
const currentYear = () => new Date().getFullYear();
const noYear = () => null;

const Copyright = () => {
  const year = useSyncExternalStore(subscribe, currentYear, noYear);
  return <span>© {year} Here Am I. All rights reserved.</span>;
};

export default Copyright;
