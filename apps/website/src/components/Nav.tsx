"use client";

import { Button } from "ariakit/button";
import { usePathname } from "next/navigation";
import { useState } from "react";
import { Menu } from 'react-feather';
import { useMedia } from "react-use";
import { Search } from "./Search/Search";

export function Nav() {
  const matches = useMedia("(min-width: 992px)", false);
  const [open, setOpen] = useState(false);
  const pathname = usePathname();

  return (
    <nav className="header-base fixed top-0 left-0 z-20 w-full border-b">
      <div className="h-60px block px-6">
        <div className="flex h-full flex-row place-content-between place-items-center">
          <Button
            aria-label="Menu"
            className="dark:hover:bg-dark-200 hover:bg-light-700 focus:ring-width-2 focus:ring-blue flex h-6 w-6 transform-gpu cursor-pointer select-none appearance-none place-items-center rounded border-0 bg-transparent p-0 text-sm font-semibold leading-none no-underline outline-0 focus:ring active:translate-y-px lg:hidden"
          >
            <Menu color="#787f85" size={24} />
          </Button>

          <span className="hidden md:flex md:flex-row">{pathname}</span>

          <div className="flex flex-row place-items-center gap-4">
            <Search open={open} setOpen={setOpen} visibleOnMobile={matches} />
          </div>
        </div>
      </div>
    </nav>
  );
}
