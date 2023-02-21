import { Separator } from "ariakit/separator";
import { Scrollbars } from "react-custom-scrollbars-2";
import { FiBook, FiGithub } from "react-icons/fi";
import { Button } from "../Button.jsx";
import { Icon } from "../Icon.jsx";
import type { MDXPage } from "./SidebarItems.jsx";

export interface SidebarProps {
  pages: MDXPage[] | undefined;
  sidebarOpen: boolean;
}

export function Sidebar({ pages, sidebarOpen }: SidebarProps) {
  return (
    <nav
      className={`h-[calc(100vh - 73px)] border-base fixed top-[61px] left-0 bottom-0 z-20 w-full border-r bg-white dark:bg-[#151718] ${
        sidebarOpen ? "block" : "hidden"
      } lg:w-76 lg:max-w-76 lg:block`}
    >
      <div className="mt-5 flex flex-col">
        <div className="text-dark flex-col gap-8 text-dark ml-6 flex min-h-[38px] rounded-md bg-transparent dark:text-white">
          <Button
            aria-label="Link to Darkcord Repository on GitHub"
            as="a"
            className="flex flex-row items-center gap-3 outline-0"
            href="https://github.com/JustAWaifuHunter/darkcord"
            rel="noopener noreferrer"
            target="_blank"
          >
            <Icon as={FiGithub} />

            <span className="text-dark dark:text-white">GitHub</span>
          </Button>

          <Button
            aria-label="Link to Darkcord Documentation"
            as="a"
            className="flex flex-row items-center gap-3 outline-0"
            href="https://darkcord-website.vercel.app"
            rel="noopener noreferrer"
            target="_blank"
          >
            <Icon as={FiBook} />

            <span className="text-dark dark:text-white">Documentation</span>
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
        {pages ?? null}
      </Scrollbars>
    </nav>
  );
}
