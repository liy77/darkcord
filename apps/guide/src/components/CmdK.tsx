import { Command } from "cmdk";
import { Dispatch, SetStateAction, useEffect, useMemo, useState } from "react";
import { FiX } from "react-icons/fi";
import { useKey } from "react-use";
import { GuideItem } from "./CmdKItems/GuideItem";
import { Icon } from "./Icon";
import { MDXPage } from "./Sidebar/SidebarItems";

interface CommandMenuProps {
  pages: MDXPage[] | undefined;
  open: boolean;
  setOpen: Dispatch<SetStateAction<boolean>>;
}

export function CmdKDialog({ pages, setOpen, open }: CommandMenuProps) {
  const [query, setQuery] = useState("");
  const [searchResults, setSearchResults] = useState<MDXPage[]>([]);

  const searchResultsItems = useMemo(
    () =>
      searchResults?.map((item) => (
        <GuideItem
          setDialogOpen={setOpen}
          description={item.frontmatter.description}
          key={`guide-${item.frontmatter.title}`}
          link={item.url}
          title={item.frontmatter.title}
        />
      )) ?? [],
    [searchResults],
  );

  useKey(
    (event) => {
      if (event.key === "k" && (event.metaKey || event.ctrlKey)) {
        event.preventDefault();
        return true;
      }

      return false;
    },
    () => setOpen(true),
    { event: "keydown", options: {} },
    [],
  );

  useEffect(() => {
    if (query && pages) {
      const results = pages.filter((page) => {
        return (
          page.frontmatter.title.toLowerCase().includes(query.toLowerCase()) ||
          page.frontmatter.description
            ?.toLowerCase()
            .includes(query.toLowerCase())
        );
      });

      setSearchResults(results);
    } else {
      setSearchResults([]);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [query]);

  return (
    <Command.Dialog
      onOpenChange={() => setOpen(!open)}
      open={open}
      className="fixed min-h-screen max-h-screen max-h-screen w-full min-w-screen top-[50%] rounded-none z-1001 border border-solid border-1 border-[#3a3f42] xl:top-[45%] xl:min-h-[75vh] xl:w-10 xl:min-w-[680px] xl:rounded-xl left-[50%] bg-white dark:bg-[#151718]"
      label="Command Menu"
      shouldFilter={false}
    >
      <Icon
        as={FiX}
        onClick={() => setOpen(false)}
        size={28}
        className="absolute top-[25px] right-[25px] cursor-pointer rounded-[4px] p-[4px] hover:bg-[#202425]"
      />

      <Command.Input
        className="rounded-md border border-1 border-solid border-[#3a3f42] box-border outline-none h-full flex-1 bg-transparent appearance-none text-dark-400 dark:text-[#ecedee]"
        onValueChange={setQuery}
        placeholder="Search anything..."
        value={query}
      />

      <Command.List className="overflow-auto overscroll-contain	border border-1 border-solid border-[#3a3f42] right-0 left-0">
        <Command.Group
          className="text-dark-4 dark:text-[#9ba1a6]"
          heading="Darkcord Guides"
        />

        {query
          ? searchResultsItems
          : pages?.map((page) => (
              <GuideItem
                setDialogOpen={setOpen}
                description={page.frontmatter.description}
                key={`guide-${page.frontmatter.title}`}
                link={page.url}
                title={page.frontmatter.title}
              />
            ))}

        <Command.Empty className="flex place-content-center place-items-center whitespace-pre-wrap pt-8">
          No results found
        </Command.Empty>
      </Command.List>
    </Command.Dialog>
  );
}
