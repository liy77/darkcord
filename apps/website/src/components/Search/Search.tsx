import type { Dispatch, SetStateAction } from "react";
import { CommandMenu } from "../CommandMenu/CommandMenu";
import { CommandMenuTrigger } from "../CommandMenu/CommandMenuTrigger";

interface SearchProps {
  open: boolean;
  setOpen: Dispatch<SetStateAction<boolean>>;
  visibleOnMobile: boolean;
}

export function Search({ open, setOpen, visibleOnMobile }: SearchProps) {
  return (
    <>
      <CommandMenu
        visibleOnMobile={visibleOnMobile}
        open={open}
        setOpen={setOpen}
      />
      <CommandMenuTrigger setOpen={setOpen} visibleOnMobile={visibleOnMobile} />
    </>
  );
}
