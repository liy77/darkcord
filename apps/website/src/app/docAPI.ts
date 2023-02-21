import { readFile } from "node:fs/promises";
import { join } from "node:path";

export async function fetchModelJSON() {
  if (process.env.NEXT_PUBLIC_LOCAL_DEV) {
    const res = await readFile(
      join(
        process.cwd(),
        "..",
        "..",
        "packages",
        "darkcord",
        "docs",
        "docs.api.json",
      ),
      "utf8",
    );

    return JSON.parse(res);
  }

  const res = await fetch("https://pics.niskii.dev/docs.api.json", {
    next: { revalidate: 3_600 },
  });

  return res.json();
}
