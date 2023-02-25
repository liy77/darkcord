import type { ApiPropertyItem } from "@/utils/api-extractor-model/src/index";
import type { PropsWithChildren } from "react";
import { TSDoc } from "./documentation/tsdoc/TSDoc";
import { ExcerptText } from "./ExcerptText";

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
  const hasSummary = Boolean(item.tsdocComment?.summarySection);

  return (
    <div className="flex flex-col gap-4" id={item.displayName}>
      <div className="border-white border-l-2">
        <div className="ml-4">
          <a className="hover:underline" href={`#${item.displayName}`}>
            .{item.displayName}
          </a>

          <div className="ml-2">
            {hasSummary ? (
              <div className="mb-4 flex flex-col gap-2">
                {item.tsdocComment && (
                  <TSDoc item={item} tsdoc={item.tsdocComment} />
                )}

                <h4 className="break-all text-lg font-bold">
                  Type:{" "}
                  <span className="text-blue-500 hover:underline">
                    <ExcerptText
                      excerpt={item.propertyTypeExcerpt}
                      model={item.getAssociatedModel()!}
                    />
                  </span>
                </h4>
                {children}
              </div>
            ) : null}
          </div>
        </div>
      </div>
    </div>
  );
}
