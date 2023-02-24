import { ApiClass } from "@microsoft/api-extractor-model";
import { Documentation } from "../documentation/Documentation";
import { Members } from "../documentation/Members";
import { ObjectHeader } from "../documentation/ObjectHeader";

export function Class({ classes }: { classes: ApiClass }) {
  return (
    <Documentation>
      <ObjectHeader item={classes} />
      <Members item={classes} />
    </Documentation>
  );
}
