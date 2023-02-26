"use client";

import darkcord_logo from "@/assets/darkcord-logo.svg";
import { useCmdK } from "@/contexts/cmdK";
import { useNav } from "@/contexts/nav";
import { isAppleDevice } from "@/utils/isAppleDevice";
import { Button } from "ariakit/button";
import Image from "next/image";
import Link from "next/link";
import { useEffect, useState } from "react";
import { FiMenu, FiSearch } from "react-icons/fi";
import { useMedia } from "react-use";
import { Icon } from "./Icon";

export function Header() {
  const { setOpened } = useNav();
  const [isMac, setIsMac] = useState<boolean | null>(null);
  const { setOpen } = useCmdK();
  const matches = useMedia("(min-width: 992px)", false);

  useEffect(() => {
    setIsMac(typeof navigator !== "undefined" && isAppleDevice());
  }, []);

  return (
    <header className="bg-[#151718] border-[#3a3f42] fixed top-0 left-0 z-20 w-full border-b">
      <div className="h-60px block px-6">
        <div className="flex h-full flex-row place-content-between place-items-center">
          <Button
            aria-label="Menu"
            className="focus:ring-width-2 focus:ring-white flex h-6 w-6 transform-gpu cursor-pointer select-none appearance-none place-items-center rounded border-0 bg-transparent p-0 text-sm font-semibold leading-none no-underline outline-0 focus:ring active:translate-y-px lg:hidden"
            onClick={() => setOpened((open) => !open)}
          >
            <Icon as={FiMenu} size={24} />
          </Button>

          <span className="hidden md:flex md:flex-row">
            <Link href="/docs">
              <Image
                width={120}
                height={90}
                src={darkcord_logo}
                alt="darkcord-logo"
              />
            </Link>
          </span>

          <div className="flex flex-row place-items-center gap-4">
            {matches ? (
              <Button
                as="div"
                className="hover:bg-dark-500 focus:ring-width-2 text-white focus:ring-white border-[#3a3f42] rounded border px-4 py-2.5 outline-0 focus:ring active:translate-y-px"
                onClick={() => setOpen(true)}
              >
                <div className="flex flex-row place-items-center gap-4">
                  <Icon as={FiSearch} />
                  <span className="opacity-65">Search</span>

                  <div className="opacity-65 flex flex-row place-items-center gap-2">
                    {isMac !== null && <div>{isMac ? "⌘" : "Ctrl"} + K</div>}
                  </div>
                </div>
              </Button>
            ) : (
              <Button
                as="div"
                className="hover:bg-dark-500 focus:ring-width-2 focus:ring-white border-[#3a3f42] flex rounded border px-4 py-2.5 outline-0 focus:ring active:translate-y-px"
                onClick={() => setOpen(true)}
              >
                <Icon as={FiSearch} />
              </Button>
            )}
          </div>
        </div>
      </div>
    </header>
  );
}
