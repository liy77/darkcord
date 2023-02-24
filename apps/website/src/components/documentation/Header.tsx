import Link from "next/link";
import { FiCode } from "react-icons/fi";
import { Icon } from "../Icon";

export function Header({
  name,
  sourceURL,
}: {
  name: string;
  sourceURL?: string | undefined;
}) {
  return (
    <div className="flex flex-col">
      <h2 className="flex flex-row place-items-center justify-between gap-2 break-all text-2xl font-bold">
        <span className="flex place-items-center text-4xl gap-2">{name}</span>
        {sourceURL && (
          <Link href={sourceURL} target="_blank" rel="noopener noreferrer">
            <Icon as={FiCode} size={20} />
          </Link>
        )}
      </h2>
    </div>
  );
}
