import { readFile } from "node:fs/promises";
import { join } from "node:path";

export async function fetchModelJSON() {

    const res = await readFile(
      join(
        process.cwd(),
        "public",
        "docs.api.json",
      ),
      "utf8",
    );

    return JSON.parse(res);
  

  // const res = await fetch("https://pics.niskii.dev/docs.api.json", {
  //   next: { revalidate: 3_600 },
  // });

  // return res.json();
}
