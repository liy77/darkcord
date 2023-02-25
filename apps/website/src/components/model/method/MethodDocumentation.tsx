import { TSDoc } from "@/components/documentation/tsdoc/TSDoc";
import { ExcerptText } from "@/components/ExcerptText";

import { ParameterTable } from "@/components/ParameterTable";
import type {
  ApiMethod,
  ApiMethodSignature
} from "@/utils/api-extractor-model/src/index";

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
        <span className="ml-6 mb-2">
          <TSDoc item={method} tsdoc={method.tsdocComment} />
        </span>
      )}
      {method.parameters.length && (
        <div className="ml-8">
          <ParameterTable item={method} />
        </div>
      )}
      <div className="ml-5 mt-4 flex flex-row font-bold gap-2">
        Returns:{" "}
        <span className="text-blue-500 hover:underline">
          <ExcerptText
            excerpt={method.returnTypeExcerpt}
            model={method.getAssociatedModel()!}
          />
        </span>
      </div>
    </div>
  );
}
