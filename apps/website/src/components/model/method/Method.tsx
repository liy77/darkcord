import type {
  ApiMethod,
  ApiMethodSignature
} from "@microsoft/api-extractor-model";
import { MethodDocumentation } from "./MethodDocumentation";
import { MethodHeader } from "./MethodHeader";

export function Method({ method }: { method: ApiMethod | ApiMethodSignature }) {
  return (
    <>
      <MethodHeader method={method} />
      <MethodDocumentation method={method} />
    </>
  );
}
