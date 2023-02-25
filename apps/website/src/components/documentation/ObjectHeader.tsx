import {
  ApiDeclaredItem,
  ApiItemContainerMixin
} from "@/utils/api-extractor-model/src/index";
import { Header } from "./Header";
import { TSDoc } from "./tsdoc/TSDoc";

export interface ObjectHeaderProps {
  item: ApiDeclaredItem & ApiItemContainerMixin;
}

export function ObjectHeader({ item }: ObjectHeaderProps) {
  return (
    <>
      <Header name={item.displayName} sourceURL={item.sourceLocation.fileUrl} />
      {item.tsdocComment?.summarySection && (
        <div className="mt-2">
          <TSDoc item={item} tsdoc={item.tsdocComment} />
        </div>
      )}
    </>
  );
}
