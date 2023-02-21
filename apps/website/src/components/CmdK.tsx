"use client";

import { useCmdK } from "@/contexts/cmdK";
import { AlgoliaItemType, getDarkcordDocsResults } from "@/utils/algolia";
import { Command } from "cmdk";
import { useEffect, useMemo, useState } from "react";
import { FiX } from "react-icons/fi";
import { useKey } from "react-use";
import { AlgoliaLogo } from "./AlgoliaLogo";
import { DarkcordDocsItems } from "./CmdKItems/DarkcordDocsItems";
import { DarkcordPluginsItems } from "./CmdKItems/DarkcordPluginsItems";
import { DarkcordUtilsItems } from "./CmdKItems/DarkcordUtilsItems";
import { Icon } from "./Icon";

export function CmdKDialog() {
  const { opened, setOpen } = useCmdK();
  const [query, setQuery] = useState<string>("");
  const [loading, setLoading] = useState<boolean>(false);
  const [darkcordDocsItems, setDarkcordDocsItems] = useState<AlgoliaItemType[]>(
    [],
  );
  const [initialized, setInitialized] = useState(false);

  const searchDocsResults = async () => {
    if (query.length === 0) {
      setDarkcordDocsItems([]);
      return;
    }
    setLoading(true);
    const results = await getDarkcordDocsResults(query);

    setDarkcordDocsItems(results.hits);
    setLoading(false);
    setInitialized(true);
  };

  const searchDocsResultsItems = useMemo(
    () => (
      <Command.Group
        className="text-dark-4 dark:text-[#9ba1a6]"
        heading="Darkcord Documentation"
      >
        {darkcordDocsItems.map((item) => (
          <DarkcordDocsItems
            item={item}
            key={`hit-darkcord-docs-${item.objectID}`}
          />
        ))}
      </Command.Group>
    ),
    [darkcordDocsItems],
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
    if (!opened) {
      setQuery("");
    }
  }, []);

  useEffect(() => {
    searchDocsResults();
  }, [query]);

  return (
    <Command.Dialog
      onOpenChange={() => setOpen(!opened)}
      open={opened}
      className="border-base fixed min-h-screen max-h-screen max-h-screen w-full min-w-screen top-[50%] rounded-none z-1001 border border-solid border-1 border-white xl:top-[45%] xl:min-h-[75vh] xl:w-10 xl:min-w-[680px] xl:rounded-xl left-[50%] bg-white dark:bg-[#151718]"
      label="Command Menu"
      shouldFilter={false}
    >
      <Icon
        as={FiX}
        className="absolute top-[25px] right-[25px] cursor-pointer rounded-[4px] p-[4px] hover:bg-[#202425]"
        onClick={() => setOpen(false)}
        size={28}
      />

      <Command.Input
        className="rounded-md border font-400 border-1 border-solid border-base box-border outline-none h-full flex-1 bg-transparent appearance-none text-dark-400 dark:text-[#ecedee]"
        onValueChange={setQuery}
        placeholder="search anything..."
        value={query}
      />

      <Command.List className="overflow-auto overscroll-contain	border border-1 border-solid border-base">
        {initialized && (
          <>{query && darkcordDocsItems.length > 0 && searchDocsResultsItems}</>
        )}

        {!loading && !query && darkcordDocsItems.length === 0 && (
          <Command.Empty className="flex place-content-center place-items-center whitespace-pre-wrap pt-8">
            No results found
          </Command.Empty>
        )}

        <Command.Group
          className="text-dark-4 dark:text-[#9ba1a6]"
          heading="Darkcord Utils"
        />

        <DarkcordUtilsItems />

        <Command.Group
          className="text-dark-4 dark:text-[#9ba1a6]"
          heading="Darkcord Plugins"
        />

        <DarkcordPluginsItems />
      </Command.List>

      <div className="hidden lg:flex place-items-center h-[44px]">
        <div className="inline-flex gap-2 place-items-center place-content-center text-[#9ba1a6] text-xs mr-4 ml-auto font-400 text-dark dark:text-[#787f85]">
          <span>Search by</span>
          <AlgoliaLogo />
        </div>
      </div>
    </Command.Dialog>
  );
}
