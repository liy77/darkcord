import type {
  ApiMethod,
  ApiMethodSignature
} from "@/utils/api-extractor-model/src/index";
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
