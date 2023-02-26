"use client";

import type { PropsWithChildren } from "react";

import "@unocss/reset/tailwind.css";
import "../styles/cmdk.css";
import "../styles/inter.css";
import "../styles/main.css";
import "../styles/unocss.css";

export default function RootLayout({ children }: PropsWithChildren) {
  return (
    <html lang="en">
      <head />
      <body className="bg-dark-800">{children}</body>
    </html>
  );
}
