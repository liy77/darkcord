import { serializeMembers } from "@/utils/serializeMembers";
import { ApiClass } from "@microsoft/api-extractor-model";
import { Documentation } from "../documentation/Documentation";
import { Members } from "../documentation/Members";
import { ObjectHeader } from "../documentation/ObjectHeader";
import { Outline } from "../Outline";

export function Class({ classes }: { classes: ApiClass }) {
  return (
    <Documentation>
      <ObjectHeader item={classes} />
      <Members item={classes} />
      <Outline members={serializeMembers(classes)} />
    </Documentation>
  );
}
