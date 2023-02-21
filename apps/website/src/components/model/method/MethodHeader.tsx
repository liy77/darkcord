import type {
  ApiMethod,
  ApiMethodSignature
} from "@microsoft/api-extractor-model";
import { ApiItemKind } from "@microsoft/api-extractor-model";
import { useCallback, useMemo } from "react";

export function MethodHeader({
  method,
}: {
  method: ApiMethod | ApiMethodSignature;
}) {
  const isDeprecated = Boolean(method.tsdocComment?.deprecatedBlock);

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
    <div className="scroll-mt-30 flex flex-col" id={key}>
      <div className="flex flex-col gap-2 md:-ml-9 md:flex-row md:place-items-center">
        <div className="flex flex-row flex-wrap gap-1">
          <h4 className="break-all text-lg text-blue-500 hover:underline font-bold">
            <a href={`#${key}`}>{getShorthandName(method)}</a>
          </h4>
        </div>

        {isDeprecated ||
        (method.kind === ApiItemKind.Method &&
          (method as ApiMethod).isProtected) ||
        (method.kind === ApiItemKind.Method &&
          (method as ApiMethod).isStatic) ? (
          <div className="flex flex-row gap-1">
            {method.kind === ApiItemKind.Method &&
              (method as ApiMethod).isProtected && (
                <div className="bg-red flex h-5 flex-row place-content-center place-items-center rounded-full px-3 text-center text-xs font-semibold uppercase text-white">
                  Protected
                </div>
              )}
            {method.kind === ApiItemKind.Method &&
              (method as ApiMethod).isStatic && (
                <div className="bg-blue flex h-5 flex-row place-content-center place-items-center rounded-full px-3 text-center text-xs font-semibold uppercase text-white">
                  Static
                </div>
              )}
          </div>
        ) : null}
      </div>
    </div>
  );
}
