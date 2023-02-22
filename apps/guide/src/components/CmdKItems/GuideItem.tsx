import { Button } from "ariakit/button";
import { Command } from "cmdk";
import { Dispatch, PropsWithChildren, SetStateAction } from "react";
import { FiBook } from "react-icons/fi";
import { Icon } from "../Icon";

interface GuideItemProps {
  description?: string | undefined;
  link?: string | undefined;
  title: string;
  setDialogOpen: Dispatch<SetStateAction<boolean>>;
}

export function GuideItem({
  link,
  title,
  description,
  setDialogOpen,
}: PropsWithChildren<GuideItemProps>) {
  return (
    <Button as="a" href={link}>
      <Command.Item
        className="hover:bg-[#f1f3f5] transition-all ease-in mr-4 duration-150 dark:hover:bg-[#202425] place-content-center cursor-pointer min-h-[52px] rounded-3 flex flex-col pl-2 place-items-start pr-3 rounded-md select-none"
        onSelect={() => {
          setDialogOpen(false);
        }}
      >
        <div className="mt-1 inline-flex place-items-center place-content-between gap-3 break-words">
          <div className="shrink-0 place-content-center">
            <Icon as={FiBook} />
          </div>

          <div className="flex flex-col">
            <p className="font-500 text-sm leading-4 tracking-tighter text-dark dark:text-[#ecedee]">
              {title}
            </p>

            {description && (
              <p className="font-400 text-xs leading-6 text-dark dark:text-[#787f85]">
                {description}
              </p>
            )}
          </div>
        </div>
      </Command.Item>
    </Button>
  );
}
