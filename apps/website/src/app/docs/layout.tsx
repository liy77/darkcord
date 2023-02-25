import { CmdKDialog } from "@/components/CmdK";
import { Header } from "@/components/Header";
import { createApiModel } from "@/utils/createApiModel";
import { ApiFunction } from "@/utils/api-extractor-model/src/index";
import { notFound } from "next/navigation";
import { PropsWithChildren, ReactElement } from "react";
import { fetchModelJSON } from "../docAPI";
import { Providers } from "./providers";

export default async function DocsLayout({ children }: PropsWithChildren) {

  return (
    <Providers>
      <Header />
      <article className="pt-18 lg:pl-76 position fix">
        <div className="position fixed z-10 min-h-[calc(100vh_-_70px)]">
          <main>{children}</main>
        </div>
      </article>
      <CmdKDialog />
    </Providers>
  );
}
