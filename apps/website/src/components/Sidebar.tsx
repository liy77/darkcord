import { useNav } from "@/contexts/nav";
import { ApiItemKind } from "@/utils/api-extractor-model/src/index";
import { usePathname } from "next/navigation";
import { useMemo } from "react";
import { ItemLink } from "./ItemLink";
import { Section } from "./Section";

export interface SidebarSectionItemData {
  href: string;
  kind: ApiItemKind;
  name: string;
  overloadIndex?: number | undefined;
}

interface GroupedMembers {
  Classes: SidebarSectionItemData[];
}

function groupMembers(
  members: readonly SidebarSectionItemData[],
): GroupedMembers {
  const Classes: SidebarSectionItemData[] = [];

  for (const member of members) {
    switch (member.kind) {
      case "Class":
        Classes.push(member);
        break;
      default:
        break;
    }
  }

  return { Classes };
}

export function Sidebar({ members }: { members: SidebarSectionItemData[] }) {
  const pathname = usePathname();
  const asPathWithoutQueryAndAnchor = `/${
    pathname?.split("/").splice(-1) ?? ""
  }`;
  const { setOpened } = useNav();

  // @ts-nocheck
  const groupItems = useMemo(() => groupMembers(members), [members]);

  return (
    <div className="width 250px height 100vh float left flex flex-col gap-3 p-3 pb-32 lg:pb-12">
      {(Object.keys(groupItems) as (keyof GroupedMembers)[])
        .filter((group) => groupItems[group]?.length)
        .map((group, id) => (
          <Section key={id} title={group}>
            {groupItems[group].map((member, index) => (
              <ItemLink
                className={`dark:border-dark-100 focus:ring-width-2 focus:ring-white ml-5 flex flex-col border-l p-[5px] pl-6 outline-0 focus:rounded focus:border-0 focus:ring ${
                  asPathWithoutQueryAndAnchor === member.href
                    ? "text-blue-4"
                    : "dark:hover:bg-dark-200 hover:bg-light-700"
                }`}
                itemURI={member.href}
                key={index}
                onClick={() => setOpened(false)}
                title={member.name}
              >
                <div className="flex flex-row place-items-center gap-2 lg:text-sm">
                  <span className="truncate">{member.name}</span>
                  {member.overloadIndex && member.overloadIndex > 1 ? (
                    <span className="text-xs">{member.overloadIndex}</span>
                  ) : null}
                </div>
              </ItemLink>
            ))}
          </Section>
        ))}
    </div>
  );
}
