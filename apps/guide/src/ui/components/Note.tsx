import { PropsWithChildren } from "react";
import { FiAlertOctagon } from "react-icons/fi";
import { Icon } from "~/components/Icon";

export function Note({ children }: PropsWithChildren) {
  return (
    <div className="mb-4 min-h-[54px] overflow-hidden rounded-xl border border-sky-500/20 bg-sky-50/50 px-5 py-1.5 dark:border-sky-500/30 dark:bg-sky-500/10">
      <div className="flex items-start items-center space-x-3">
        <div className="mt-0.5 w-4">
          <Icon as={FiAlertOctagon} size={18} className="text-sky-500" />
        </div>

        <div className="prose flex-1 overflow-x-auto text-sm text-sky-900 dark:text-sky-200">
          <p>{children}</p>
        </div>
      </div>
    </div>
  );
}
