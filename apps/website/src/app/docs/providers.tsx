"use client";

import { CmdKProvider } from "@/contexts/cmdK";
import { NavProvider } from "@/contexts/nav";
import type { PropsWithChildren } from "react";

export function Providers({ children }: PropsWithChildren) {
  return (
    <NavProvider>
      <CmdKProvider>{children}</CmdKProvider>
    </NavProvider>
  );
}
