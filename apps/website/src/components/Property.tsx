import type { ApiPropertyItem } from "@microsoft/api-extractor-model";
import type { PropsWithChildren } from "react";
import { TSDoc } from "./documentation/tsdoc/TSDoc";

export enum PropertySeparatorType {
  Type = ":",
  Value = "=",
}

export function Property({
  item,
  children,
}: PropsWithChildren<{
  item: ApiPropertyItem;
  separator?: PropertySeparatorType;
}>) {
  const isDeprecated = Boolean(item.tsdocComment?.deprecatedBlock);
  const hasSummary = Boolean(item.tsdocComment?.summarySection);

  return (
    <div className="scroll-mt-30 flex flex-col gap-4" id={item.displayName}>
      <div className="md:-ml-8.5 flex flex-col gap-2 md:flex-row md:place-items-center">
        <div className="flex flex-row flex-wrap place-items-center gap-1">
          <a href={`#${item.displayName}`}>
            <h4 className="break-all text-blue-500 hover:underline text-lg font-bold">
              .{item.displayName}
            </h4>
          </a>
        </div>

        {isDeprecated || item.isReadonly || item.isOptional ? (
          <div className="flex flex-row gap-1">
            {item.isReadonly && (
              <div className="bg-red flex h-5 flex-row place-content-center place-items-center rounded-full px-3 text-center text-xs font-semibold uppercase text-white dark:text-dark">
                Read-only
              </div>
            )}
            {item.isOptional && (
              <div className="bg-blue flex h-5 flex-row place-content-center place-items-center rounded-full px-3 text-center text-xs font-semibold uppercase text-white dark:text-dark">
                Optional
              </div>
            )}
          </div>
        ) : null}
      </div>
      {hasSummary ? (
        <div className="mb-4 flex flex-col gap-4">
          {item.tsdocComment && <TSDoc item={item} tsdoc={item.tsdocComment} />}
          {children}
        </div>
      ) : null}
    </div>
  );
}
