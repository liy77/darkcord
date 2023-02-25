import { PropertyList } from "@/components/PropertyList";
import { ApiItemContainerMixin } from "@/utils/api-extractor-model/src/index";
import { DocumentationSection } from "./DocumentationSection";

export function PropertiesSection({ item }: { item: ApiItemContainerMixin }) {
  return (
    <DocumentationSection padded title="Properties">
      <PropertyList item={item} />
    </DocumentationSection>
  );
}
