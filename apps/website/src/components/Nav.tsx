"use client";

import { useNav } from "@/contexts/nav";
import { Button } from "ariakit/button";
import { Separator } from "ariakit/separator";
import { FiGithub } from "react-icons/fi";
import { Icon } from "./Icon";
import { Scrollbars } from "./Scrollbars";
import { Sidebar, SidebarSectionItemData } from "./Sidebar";

export function Nav({ members }: { members: SidebarSectionItemData[] }) {
  const { opened } = useNav();

  return (
    <nav
      className={`h-[calc(100vh_-_73px)] width 0% position absolute border-base fixed top-[61px] left-0 bottom-0 z-20 w-full border-r bg-white dark:bg-[#151718] ${
        opened ? "block" : "hidden"
      } lg:w-76 lg:max-w-76 lg:block`}
    >
      <div className="mt-5 flex flex-col">
        <div className="text-dark text-dark ml-6 flex min-h-[38px] rounded-md bg-transparent dark:text-white">
          <Button
            aria-label="GitHub"
            as="a"
            className="focus:ring-width-2 focus:ring-white rounded pl-2.5 pr-2.5 flex flex-row items-center gap-3 outline-0 outline-0 focus:ring active:translate-y-px"
            href="https://github.com/JustAWaifuHunter/darkcord"
            rel="noopener noreferrer"
            target="_blank"
          >
            <Icon as={FiGithub} />
            <span className="text-dark dark:text-white">GitHub</span>
          </Button>
        </div>

        <Separator className="border-base my-5" />
      </div>
      <Scrollbars
        autoHide
        hideTracksWhenNotNeeded
        renderThumbVertical={(props) => (
          <div
            {...props}
            className="dark:bg-dark-100 bg-light-900 z-30 rounded"
          />
        )}
        renderTrackVertical={(props) => (
          <div
            {...props}
            className="absolute top-0.5 right-0.5 bottom-0.5 z-30 w-1.5 rounded"
          />
        )}
        universal
      >
        <Sidebar members={members} />
      </Scrollbars>
    </nav>
  );
}
