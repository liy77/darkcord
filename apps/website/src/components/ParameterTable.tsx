import type { ApiParameterListMixin } from "@/utils/api-extractor-model/src/index";
import { useMemo } from "react";
import { Table } from "./documentation/Table";
import { TSDoc } from "./documentation/tsdoc/TSDoc";
import { ExcerptText } from "./ExcerptText";

const columnStyles = {
  Name: "whitespace-nowrap",
  Type: "whitespace-pre-wrap break-normal",
};

export function ParameterTable({ item }: { item: ApiParameterListMixin }) {
  const rows = useMemo(
    () =>
      item.parameters.map((param) => ({
        Name: param.name,

        Description: param.tsdocParamBlock ? (
          <div className="flex flex-col">
            <span className="text-blue-500 hover:underline">
              <ExcerptText
                excerpt={param.parameterTypeExcerpt}
                model={item.getAssociatedModel()!}
              />

              {param.isOptional ? "(optional)" : ""}
            </span>
            <TSDoc item={item} tsdoc={param.tsdocParamBlock.content} />
          </div>
        ) : (
          "None"
        ),
      })),
    [item],
  );

  return (
    <div className="overflow-x-auto">
      <Table
        columnStyles={columnStyles}
        columns={["Name", "Description"]}
        rows={rows}
      />
    </div>
  );
}
