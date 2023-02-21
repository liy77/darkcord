import { PropsWithChildren } from "react";
import { FiAlertTriangle } from "react-icons/fi";
import { Icon } from "~/components/Icon";

export function Warning({ children }: PropsWithChildren) {
  return (
    <div className="mb-4 min-h-[54px] overflow-hidden rounded-xl border border-amber-500/20 bg-amber-50/50 px-5 py-1.5 dark:border-amber-500/30 dark:bg-amber-500/10">
      <div className="flex items-start items-center space-x-3">
        <div className="mt-0.5 w-4">
          <Icon
            as={FiAlertTriangle}
            size={18}
            className="flex-none text-amber-400 dark:text-amber-300/80"
          />
        </div>

        <div className="prose flex-1 overflow-x-auto text-sm text-amber-900 dark:text-amber-200">
          <p>{children}</p>
        </div>
      </div>
    </div>
  );
}
