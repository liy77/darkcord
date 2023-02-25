import type { ApiItem } from "@/utils/api-extractor-model/src/index";
import type {
  DocComment, DocNode,
  DocNodeContainer,
  DocPlainText
} from "@microsoft/tsdoc";
import { DocNodeKind, StandardTags } from "@microsoft/tsdoc";
import { Fragment, useCallback, type ReactNode } from "react";
import { ExampleBlock, SeeBlock } from "./BlockComment";

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
