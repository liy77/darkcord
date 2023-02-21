import { FiEdit } from "react-icons/fi";
import { Icon } from "./Icon";

export function ExternalLink({ href, title }: { href: string; title: string }) {
  return (
    <a
      className="inline-flex place-items-center gap-2 text-sm font-semibold"
      href={href}
      target="_blank"
      rel="noopener noreferrer"
    >
      <Icon as={FiEdit} size={16} />
      {title}
    </a>
  );
}
