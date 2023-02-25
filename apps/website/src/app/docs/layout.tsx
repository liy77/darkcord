import { CmdKDialog } from "@/components/CmdK";
import { Header } from "@/components/Header";
import { Nav } from "@/components/Nav";
import { createApiModel } from "@/utils/createApiModel";
import { serializeIntoSidebarItemData } from "@/utils/serializeIntoSidebarItemData";
import { ApiFunction } from "@/utils/api-extractor-model/src/index";
import { notFound } from "next/navigation";
import { PropsWithChildren, ReactElement } from "react";
import { fetchModelJSON } from "../docAPI";
import { Providers } from "./providers";

export default async function DocsLayout({ children }: PropsWithChildren) {
  const modelJSON = await fetchModelJSON();
  const model = createApiModel(modelJSON);

	const pkg = model.tryGetPackageByName("darkcord");

	if (!pkg) {
		return notFound();
	}

	const entry = pkg.entryPoints[0];

  if (!entry) {
		return notFound();
	}

  const members = entry.members.filter((member) => {
    if (member.kind !== "Function") {
      return true;
    }

    return (member as ApiFunction).overloadIndex === 1;
  });

  return (
    <Providers>
      <Header />
      <article className="pt-18 lg:pl-76 position fix">
        <div className="position fixed z-10 min-h-[calc(100vh_-_70px)]">
          <main>{children}</main>
        </div>
        <Nav
            members={members.map((member) => serializeIntoSidebarItemData(member))}
          />
      </article>
      <CmdKDialog />
    </Providers>
  );
}
