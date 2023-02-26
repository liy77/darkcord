import type {
  ApiMethod,
  ApiMethodSignature
} from "@/utils/api-extractor-model/src/index";
import { useCallback, useMemo } from "react";

export function MethodHeader({
  method,
}: {
  method: ApiMethod | ApiMethodSignature;
}) {
  const key = useMemo(
    () =>
      `${method.displayName}${
        method.overloadIndex && method.overloadIndex > 1
          ? `:${method.overloadIndex}`
          : ""
      }`,
    [method.displayName, method.overloadIndex],
  );

  const getShorthandName = useCallback(
    (method: ApiMethod | ApiMethodSignature) =>
      `${method.name}${method.isOptional ? "?" : ""}(${method.parameters.reduce(
        (prev, cur, index) => {
          if (index === 0) {
            return `${prev}${cur.isOptional ? `${cur.name}?` : cur.name}`;
          }
          return `${prev}, ${cur.isOptional ? `${cur.name}?` : cur.name}`;
        },
        "",
      )})`,
    [],
  );

  return (
    <div className="scroll-mt-30 flex flex-col mb-2" id={key}>
      <div className="ml-4">
        <h4 className="break-all text-lg hover:underline font-bold">
          <a href={`#${key}`}>{getShorthandName(method)}</a>
        </h4>
      </div>
    </div>
  );
}
