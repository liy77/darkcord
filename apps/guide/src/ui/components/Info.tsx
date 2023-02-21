import { PropsWithChildren } from "react";
import { FiAlertCircle } from "react-icons/fi";
import { Icon } from "~/components/Icon";

export function Info({ children }: PropsWithChildren) {
  return (
    <div className="mb-4 min-h-[54px] overflow-hidden rounded-xl border border-zinc-500/20 bg-zinc-50/50 px-5 py-4 dark:border-zinc-500/30 dark:bg-zinc-900 dark:bg-zinc-500/10">
      <div className="flex items-start space-x-3">
        <div className="mt-0.5 w-4">
          <Icon
            as={FiAlertCircle}
            size={18}
            className="flex-none text-zinc-400 dark:text-zinc-300"
          />
        </div>

        <div className="prose flex-1 overflow-x-auto text-sm text-zinc-900 dark:text-zinc-200">
          {children}
        </div>
      </div>
    </div>
  );
}
