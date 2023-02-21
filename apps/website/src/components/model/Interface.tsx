import { serializeMembers } from "@/utils/serializeMembers";
import type { ApiInterface } from "@microsoft/api-extractor-model";
import { Documentation } from "../documentation/Documentation";
import { Members } from "../documentation/Members";
import { ObjectHeader } from "../documentation/ObjectHeader";
import { Outline } from "../Outline";

export function Interface({ item }: { item: ApiInterface }) {
  return (
    <Documentation>
      <ObjectHeader item={item} />
      <Members item={item} />
      <Outline members={serializeMembers(item)} />
    </Documentation>
  );
}
