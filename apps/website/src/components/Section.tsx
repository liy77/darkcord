import { Disclosure, DisclosureContent, useDisclosureState } from "ariakit";
import type { PropsWithChildren } from "react";
import { VscChevronDown } from "react-icons/vsc";

export interface SectionOptions {
  background?: boolean | undefined;
  className?: string;
  defaultClosed?: boolean | undefined;
  dense?: boolean | undefined;
  gutter?: boolean | undefined;
  padded?: boolean | undefined;
  title: string;
}

export function Section({
  title,
  padded = false,
  dense = false,
  defaultClosed = false,
  background = false,
  gutter = false,
  children,
  className,
}: PropsWithChildren<SectionOptions>) {
  const disclosure = useDisclosureState({ defaultOpen: !defaultClosed });

  return (
    <div className={`flex flex-col ${className}`}>
      <Disclosure
        className="active:translate-y-px bg-dark-500 hover:bg-dark-500 focus:ring-width-2 focus:ring-white rounded p-3 outline-0 focus:ring"
        state={disclosure}
      >
        <div className="flex flex-row place-content-start place-items-center">
          <div className="flex flex-row place-items-center gap-3">
            <VscChevronDown
              className={`border h-[20px] border-1 border-solid outline-0 rounded border-[#3a3f42] transform transition duration-150 ease-in-out ${
                disclosure.open ? "rotate-270" : "rotate-0"
              }`}
              size={20}
            />

            <span className="font-500 active:translate-y-px">{title}</span>
          </div>
        </div>
      </Disclosure>
      <DisclosureContent
        className={`${background ? "bg-dark-500 rounded" : ""} ${
          gutter ? "mt-2" : ""
        }`}
        state={disclosure}
      >
        {padded ? (
          <div className={`py-5 ${dense ? "mx-2 px-0" : "px-4.5 mx-6.5"}`}>
            {children}
          </div>
        ) : (
          children
        )}
      </DisclosureContent>
    </div>
  );
}
