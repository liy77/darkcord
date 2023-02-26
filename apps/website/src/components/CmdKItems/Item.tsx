import { useCmdK } from "@/contexts/cmdK";
import { Button, ButtonOptions } from "ariakit/button";
import { Command } from "cmdk";
import { PropsWithChildren } from "react";

interface DocsItemProps extends Omit<ButtonOptions, "as"> {
  description?: string | undefined;
  title: string;
}

export function DocsItem(props: PropsWithChildren<DocsItemProps>) {
  const { setOpen } = useCmdK();

  const { children, title, description, ...itemProps } = props;

  return (
    <Button as="a" {...itemProps}>
      <Command.Item
        className="transition-all ease-in duration-150 mr-4 hover:bg-[#202425] place-content-center cursor-pointer min-h-[52px] rounded-3 flex flex-col pl-2 place-items-start pr-3 rounded-md select-none"
        onSelect={() => {
          setOpen(false);
        }}
      >
        <div className="mt-1 inline-flex place-items-center place-content-between gap-3 break-words">
          <div className="shrink-0 place-content-center">{children}</div>

          <div className="flex flex-col">
            <p className="font-500 text-sm leading-4 tracking-tighter text-[#ecedee]">
              {title}
            </p>

            {description && (
              <p className="font-400 text-xs leading-6 text-[#787f85]">
                {description}
              </p>
            )}
          </div>
        </div>
      </Command.Item>
    </Button>
  );
}
