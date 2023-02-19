"use client";

import { ThemeProvider } from "next-themes";
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
      <body className="dark:bg-dark-800 bg-white">
        <ThemeProvider
          attribute="class"
          defaultTheme="system"
          disableTransitionOnChange
          value={{
            light: "light",
            dark: "dark",
          }}
        >
          {children}
        </ThemeProvider>
      </body>
    </html>
  );
}
