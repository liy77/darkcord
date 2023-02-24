import { FiZap } from "react-icons/fi";
import { Icon } from "../Icon";
import { DocsItem } from "./Item";

export function DarkcordPluginsItems() {
  return (
    <DocsItem
      target="_blank"
      rel="noopener noreferrer"
      href="https://github.com/darkcordjs/voice"
      title="@darkcord/voice"
      description="3 stars · 0 forks"
    >
      <Icon as={FiZap} size={20} />
    </DocsItem>
  );
}
