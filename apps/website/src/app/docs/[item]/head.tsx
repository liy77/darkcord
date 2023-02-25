import { fetchModelJSON } from "@/app/docAPI";
import { createApiModel } from "@/utils/createApiModel";
import { findMember } from "@/utils/findMember";
import { tryResolveSummaryText } from "@/utils/tryResolveSummaryText";
import { ApiDeclaredItem, ApiItem } from "@/utils/api-extractor-model/src/index";
import { ItemRouteParams } from "./page";

async function fetchMember({
  item,
}: ItemRouteParams): Promise<ApiItem | undefined> {
  const modelJSON = await fetchModelJSON();
  const model = createApiModel(modelJSON);
  const pkg = model.tryGetPackageByName("darkcord");
	const entry = pkg?.entryPoints[0];

  if (!entry) {
		return undefined;
	}

  const [memberName] = decodeURIComponent(item).split(":");

  return findMember(model, memberName);
}

export default async function Head({ params }: { params: ItemRouteParams }) {
  const member = (await fetchMember(params))!;

  const ogTitle = `Darkcord Docs | ${member?.displayName}`;

  const searchParams = new URLSearchParams({
    name: member.displayName,
  });

  const url = new URL("https://darkcord-website.vercel.app/api/og_params");
  url.search = searchParams.toString();

  const ogImage = url.toString();
  const description = tryResolveSummaryText(member as ApiDeclaredItem);

  return (
    <>
      <title key="title">Darkcord Docs</title>
      <meta content={description ?? ""} key="description" name="description" />
      <meta content={ogTitle} key="og_title" property="og:title" />
      <meta
        content={description ?? ""}
        key="og_description"
        property="og:description"
      />
      <meta content={ogImage} key="og_image" property="og:image" />
    </>
  );
}
