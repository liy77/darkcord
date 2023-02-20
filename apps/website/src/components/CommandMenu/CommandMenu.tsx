import { Command } from "cmdk";
import { Dispatch, SetStateAction, useState } from "react";
import { X } from "react-feather";
import { CommandFooter } from "./CommandFooter";

interface CommandMenuProps {
  open: boolean;
  setOpen: Dispatch<SetStateAction<boolean>>;
  visibleOnMobile: boolean;
}

export function CommandMenu({
  open,
  setOpen,
  visibleOnMobile,
}: CommandMenuProps) {
  const [query, setQuery] = useState("");

  return (
    <Command.Dialog
      className="bg-white dark:bg-[#151718]"
      label="Command Menu"
      onOpenChange={setOpen}
      open={open}
      shouldFilter={false}
    >
      <X
        className="absolute cursor-pointer rounded-[4px] p-[4px] hover:bg-[#202425]"
        color="#787f85"
        onClick={() => setOpen(false)}
        size={28}
        style={{
          top: 25,
          right: 25,
        }}
      />

      <Command.Input
        className="text-dark-4 dark:text-[#ecedee]"
        onValueChange={setQuery}
        placeholder="Search anything..."
        value={query}
      />

      <Command.List>
        <Command.Group
          className="text-dark-4 dark:text-[#9ba1a6]"
          heading="Darkcord Docs"
        />

        <Command.Empty>No results found</Command.Empty>
      </Command.List>

      <CommandFooter visibleOnMobile={visibleOnMobile} />
    </Command.Dialog>
  );
}
