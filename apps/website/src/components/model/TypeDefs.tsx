import type { ApiTypeAlias } from "@microsoft/api-extractor-model";
import { Documentation } from "../documentation/Documentation";
import { TSDoc } from "../documentation/tsdoc/TSDoc";

export function TypeDefs({ item }: { item: ApiTypeAlias }) {
  return (
    <Documentation>
      {item.tsdocComment?.summarySection && (
        <TSDoc item={item} tsdoc={item.tsdocComment} />
      )}
    </Documentation>
  );
}
