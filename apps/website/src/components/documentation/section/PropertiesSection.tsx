import { PropertyList } from "@/components/PropertyList";
import { ApiItemContainerMixin } from "@microsoft/api-extractor-model";
import { DocumentationSection } from "./DocumentationSection";

export function PropertiesSection({ item }: { item: ApiItemContainerMixin }) {
  return (
    <DocumentationSection padded title="Properties">
      <PropertyList item={item} />
    </DocumentationSection>
  );
}
