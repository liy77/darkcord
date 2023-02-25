import { ApiDeclaredItem } from "@/utils/api-extractor-model/src/index";
import {
  DocCodeSpan,
  DocNode,
  DocNodeKind,
  DocParagraph,
  DocPlainText
} from "@microsoft/tsdoc";

export function tryResolveSummaryText(item: ApiDeclaredItem) {
  if (!item.tsdocComment) {
    return null;
  }

  const { summarySection } = item.tsdocComment;

  let retVal = "";

  const visitTSDocNode = (node: DocNode) => {
    switch (node.kind) {
      case DocNodeKind.CodeSpan:
        retVal += (node as DocCodeSpan).code;
        break;
      case DocNodeKind.PlainText:
        retVal += (node as DocPlainText).text;
        break;
      case DocNodeKind.Section:
      case DocNodeKind.Paragraph: {
        for (const child of (node as DocParagraph).nodes) {
          visitTSDocNode(child);
        }

        break;
      }

      default:
        break;
    }
  };

  for (const node of summarySection.nodes) {
    visitTSDocNode(node);
  }

  if (retVal === "") {
    return null;
  }

  return retVal;
}
