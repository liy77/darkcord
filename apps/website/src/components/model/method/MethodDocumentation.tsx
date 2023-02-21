import { TSDoc } from "@/components/documentation/tsdoc/TSDoc";

import { ParameterTable } from "@/components/ParameterTable";
import type {
  ApiMethod,
  ApiMethodSignature
} from "@microsoft/api-extractor-model";

export interface MethodDocumentationProps {
  method: ApiMethod | ApiMethodSignature;
}

export function MethodDocumentation({ method }: MethodDocumentationProps) {
  if (!(method.tsdocComment?.summarySection || method.parameters.length > 0)) {
    return null;
  }

  return (
    <div className="mb-4 flex flex-col">
      {method.tsdocComment && (
        <TSDoc item={method} tsdoc={method.tsdocComment} />
      )}
      {method.parameters.length && <ParameterTable item={method} />}
    </div>
  );
}
