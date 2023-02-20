import { Nav } from "@/components/Nav";
import { PropsWithChildren } from "react";

export default function DocsLayout({ children }: PropsWithChildren) {
  return (
    <>
      <Nav />
      <article className="pt-18 lg:pl-76">
        <div className="relative z-10 min-h-[calc(100vh_-_70px)]">
          {children}
        </div>
        <div className="h-76 md:h-52" />
      </article>
    </>
  );
}
