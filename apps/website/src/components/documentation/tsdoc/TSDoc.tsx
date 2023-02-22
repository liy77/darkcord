import { ItemLink } from "@/components/ItemLink";
import { resolveItemURI } from "@/utils/resolveItemURI";
import type { ApiItem } from "@microsoft/api-extractor-model";
import type {
  DocComment,
  DocLinkTag,
  DocNode,
  DocNodeContainer,
  DocPlainText
} from "@microsoft/tsdoc";
import { DocNodeKind, StandardTags } from "@microsoft/tsdoc";
import Link from "next/link";
import { Fragment, useCallback, type ReactNode } from "react";
import { ExampleBlock, RemarksBlock, SeeBlock } from "./BlockComment";

export function TSDoc({
  item,
  tsdoc,
}: {
  item: ApiItem;
  tsdoc: DocNode;
}): JSX.Element {
  const createNode = useCallback(
    (tsdoc: DocNode, idx?: number): ReactNode => {
      switch (tsdoc.kind) {
        case DocNodeKind.PlainText:
          return (
            <span className="break-words" key={idx}>
              {(tsdoc as DocPlainText).text}
            </span>
          );
        case DocNodeKind.Section:
        case DocNodeKind.Paragraph:
          return (
            <span className="break-words leading-relaxed" key={idx}>
              {(tsdoc as DocNodeContainer).nodes.map((node, idx) =>
                createNode(node, idx),
              )}
            </span>
          );
        case DocNodeKind.SoftBreak:
          return <Fragment key={idx} />;
        case DocNodeKind.LinkTag: {
          const { codeDestination, urlDestination, linkText } =
            tsdoc as DocLinkTag;

          if (codeDestination) {
            const foundItem = item
              .getAssociatedModel()
              ?.resolveDeclarationReference(
                codeDestination,
                item,
              ).resolvedApiItem;

            if (!foundItem) return null;

            return (
              <ItemLink
                className="text-white dark:text-dark focus:ring-width-2 focus:ring-white rounded outline-0 focus:ring"
                itemURI={resolveItemURI(foundItem)}
                key={idx}
              >
                {linkText ?? foundItem.displayName}
              </ItemLink>
            );
          }

          if (urlDestination) {
            return (
              <Link
                className="text-white focus:ring-width-2 focus:ring-white rounded outline-0 focus:ring"
                href={urlDestination}
                key={idx}
              >
                {linkText ?? urlDestination}
              </Link>
            );
          }

          return null;
        }

        case DocNodeKind.Comment: {
          const comment = tsdoc as DocComment;

          const exampleBlocks = comment.customBlocks.filter(
            (block) =>
              block.blockTag.tagName.toUpperCase() ===
              StandardTags.example.tagNameWithUpperCase,
          );

          return (
            <div className="flex flex-col space-y-2">
              {comment.summarySection
                ? createNode(comment.summarySection)
                : null}
              {comment.remarksBlock ? (
                <RemarksBlock>
                  {createNode(comment.remarksBlock.content)}
                </RemarksBlock>
              ) : null}
              {exampleBlocks.length
                ? exampleBlocks.map((block, idx) => (
                    <ExampleBlock key={idx}>
                      {createNode(block.content)}
                    </ExampleBlock>
                  ))
                : null}
              {comment.seeBlocks.length ? (
                <SeeBlock>
                  {comment.seeBlocks.map((seeBlock, idx) =>
                    createNode(seeBlock.content, idx),
                  )}
                </SeeBlock>
              ) : null}
            </div>
          );
        }

        default:
          return null;
      }
    },
    [item],
  );

  return (
    <>
      {tsdoc.kind === "Paragraph" || tsdoc.kind === "Section" ? (
        <>
          {(tsdoc as DocNodeContainer).nodes.map((node, idx) =>
            createNode(node, idx),
          )}
        </>
      ) : (
        createNode(tsdoc)
      )}
    </>
  );
}
