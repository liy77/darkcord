import { ApiClass } from "@/utils/api-extractor-model/src/index";
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
