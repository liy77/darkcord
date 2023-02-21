"use client";

import {
  createContext,
  useContext,
  useState, type Dispatch, type PropsWithChildren, type SetStateAction
} from "react";

export const NavContext = createContext<{
  opened: boolean;
  setOpened: Dispatch<SetStateAction<boolean>>;
}>({
  opened: false,
  setOpened: (_) => {},
});

export const NavProvider = ({ children }: PropsWithChildren) => {
  const [opened, setOpened] = useState<boolean>(false);

  return (
    <NavContext.Provider value={{ opened, setOpened }}>
      {children}
    </NavContext.Provider>
  );
};

export function useNav() {
  return useContext(NavContext);
}
