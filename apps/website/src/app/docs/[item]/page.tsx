import { fetchModelJSON } from "@/app/docAPI";
import { Class } from "@/components/model/Class";
import { createApiModel } from "@/utils/createApiModel";
import { findMember } from "@/utils/findMember";
import { findMemberByKey } from "@/utils/findMemberByKey";
import { ApiClass, ApiFunction, ApiItem } from "@/utils/api-extractor-model/src/index";
import { notFound } from "next/navigation";

export interface ItemRouteParams {
  item: string;
}

export async function generateStaticParams() {
  const modelJSON = await fetchModelJSON();
  const model = createApiModel(modelJSON);

  const pkg = model.tryGetPackageByName("darkcord");
  const entry = pkg?.entryPoints[0];

  if (!entry) {
    return notFound();
  }

  return entry.members.map((member) => ({
    item: member.displayName,
  }));
}

async function fetchMember({ item }: { item: string }) {
  const data = await fetchModelJSON();

  if (!data) return notFound();

  const [memberName, overloadIndex] = decodeURIComponent(item).split(":");
  const model = createApiModel(data);

  let { containerKey, displayName: name } = findMember(model, memberName) ?? {};

  if (
    name &&
    overloadIndex &&
    !Number.isNaN(Number.parseInt(overloadIndex, 10))
  ) {
    containerKey = ApiFunction.getContainerKey(
      name,
      Number.parseInt(overloadIndex, 10),
    );
  }

  return memberName && containerKey
    ? findMemberByKey(model, containerKey) ?? null
    : null;
}

function Member({ member }: { member?: ApiItem }) {
  switch (member?.kind) {
    case "Class":
      return <Class classes={member as ApiClass} />;
    default:
      return <div>Cannot render that item type</div>;
  }
}

export default async function Page({ params }: { params: ItemRouteParams }) {
  const member = await fetchMember(params);

  return (
    <main className="dark:bg-dark-800 bg-light-600">
      <div className="margin-left 76px dark:bg-dark-800 bg-white p-6 shadow">
        {member && <Member member={member} />}
      </div>
    </main>
  );
}
