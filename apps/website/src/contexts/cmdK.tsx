"use client";

import {
  createContext,
  useContext,
  useState,
  type Dispatch,
  type PropsWithChildren,
  type SetStateAction
} from "react";

export const CmdKContext = createContext<{
  opened: boolean;
  setOpen: Dispatch<SetStateAction<boolean>>;
}>({
  opened: false,
  setOpen: (_) => {},
});

export const CmdKProvider = ({ children }: PropsWithChildren) => {
  const [opened, setOpen] = useState<boolean>(false);

  return (
    <CmdKContext.Provider value={{ opened, setOpen }}>
      {children}
    </CmdKContext.Provider>
  );
};

export function useCmdK() {
  return useContext(CmdKContext);
}
