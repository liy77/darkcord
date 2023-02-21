import { useEffect, useState } from "react";
import { FiMenu, FiSearch } from "react-icons/fi";
import { useMedia } from "react-use";
import { isAppleDevice } from "~/utils/isAppleDevice";
import { Button } from "./Button";
import { CmdKDialog } from "./CmdK";
import { Icon } from "./Icon";
import { Sidebar } from "./Sidebar/Sidebar";
import { MDXPage } from "./Sidebar/SidebarItems";

interface NavProps {
  pages?: MDXPage[] | undefined;
  searchPages?: MDXPage[] | undefined;
}

export function Nav({ pages, searchPages }: NavProps) {
  const matches = useMedia("(min-width: 992px)", false);
  const [isMac, setIsMac] = useState<boolean | null>(null);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [sidebarOpen, setSidebarOpen] = useState(false);

  useEffect(() => {
    setIsMac(typeof navigator !== "undefined" && isAppleDevice());
  }, []);

  return (
    <>
      <nav className="header-base fixed top-0 left-0 z-20 w-full border-b">
        <div className="h-60px block px-6">
          <div className="flex h-full flex-row place-content-between place-items-center">
            <Button
              aria-label="Menu"
              className="flex h-6 w-6 place-items-center rounded border-0 bg-transparent p-0 text-sm font-semibold leading-none lg:hidden"
              onClick={() => setSidebarOpen((prev) => !prev)}
            >
              <Icon as={FiMenu} size={24} />
            </Button>

            <span className="hidden md:flex md:flex-row">/ guide /</span>

            <div className="flex flex-row place-items-center gap-4">
              {matches ? (
                <Button
                  as="div"
                  className="border-base rounded border px-4 py-2.5"
                  onClick={() => setDialogOpen(true)}
                >
                  <div className="flex flex-row place-items-center gap-4">
                    <Icon as={FiSearch} size={20} />
                    <span className="opacity-65">Search</span>

                    <div className="opacity-65 flex flex-row place-items-center gap-2">
                      {isMac !== null && <div>{isMac ? "⌘" : "Ctrl"} + K</div>}
                    </div>
                  </div>
                </Button>
              ) : (
                <Button
                  as="div"
                  className="border-base flex rounded border px-4 py-2.5"
                  onClick={() => setDialogOpen(true)}
                >
                  <Icon as={FiSearch} size={20} />
                </Button>
              )}
            </div>
          </div>
        </div>
      </nav>
      <Sidebar pages={pages} sidebarOpen={sidebarOpen} />
      <CmdKDialog
        open={dialogOpen}
        setOpen={setDialogOpen}
        pages={searchPages}
      />
    </>
  );
}
