import { resolveItemURI } from "@/utils/resolveItemURI";
import type { ApiModel, Excerpt } from "@microsoft/api-extractor-model";
import { ExcerptTokenKind } from "@microsoft/api-extractor-model";
import { ItemLink } from "./ItemLink";

export interface ExcerptTextProps {
  excerpt: Excerpt;
  model: ApiModel;
}

export function ExcerptText({ model, excerpt }: ExcerptTextProps) {
  return (
    <>
      {excerpt.spannedTokens.map((token) => {
        if (token.kind === ExcerptTokenKind.Reference) {
          const item = model.resolveDeclarationReference(
            token.canonicalReference!,
            model,
          ).resolvedApiItem;

          if (!item) {
            return token.text;
          }

          return (
            <div className="flex flex-row gap-2">
              <ItemLink itemURI={resolveItemURI(item)} key={item.containerKey}>
                {token.text}
              </ItemLink>
            </div>
          );
        }

        return token.text;
      })}
    </>
  );
}
