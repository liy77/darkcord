import type {
  ApiMethod,
  ApiMethodSignature
} from "@microsoft/api-extractor-model";
import { MethodDocumentation } from "./MethodDocumentation";
import { MethodHeader } from "./MethodHeader";

export function Method({ method }: { method: ApiMethod | ApiMethodSignature }) {
  return (
    <div className="border-white border-l-2">
      <MethodHeader method={method} />
      <MethodDocumentation method={method} />
    </div>
  );
}
