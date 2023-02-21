import { FiGithub, FiMap } from "react-icons/fi";
import { Icon } from "../Icon";
import { DocsItem } from "./Item";

export function DarkcordUtilsItems() {
  return (
    <div className="flex gap-2 flex-col">
      <DocsItem
        props={{ target: "_blank", rel: "noopener noreferrer" }}
        link="https://darkcord-guide.vercel.app"
        title="Guide"
      >
        <Icon as={FiMap} size={20} />
      </DocsItem>

      <DocsItem
        props={{ target: "_blank", rel: "noopener noreferrer" }}
        link="https://github.com/JustAWaifuHunter/darkcord"
        title="GitHub Repository"
        description="16 stars · 1 forks"
      >
        <Icon as={FiGithub} size={20} />
      </DocsItem>
    </div>
  );
}
