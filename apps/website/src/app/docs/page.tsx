import { MDXRemote } from "@/components/MDXRemote";
import { serialize } from "next-mdx-remote/serialize";
import { readFile } from "node:fs/promises";
import { join } from "node:path";
import rehypeIgnore from "rehype-ignore";
import rehypePrettyCode from "rehype-pretty-code";
import rehypeRaw from "rehype-raw";
import rehypeSlug from "rehype-slug";
import remarkGfm from "remark-gfm";
import shikiThemeDarkPlus from "shiki/themes/dark-plus.json";
import shikiThemeLightPlus from "shiki/themes/light-plus.json";

async function loadREADME() {
  return readFile(join(process.cwd(), "public", "README.md"), "utf8");
}

async function generateMDX(readme: string) {
  return serialize(readme, {
    mdxOptions: {
      remarkPlugins: [remarkGfm],
      remarkRehypeOptions: { allowDangerousHtml: true },
      rehypePlugins: [
        rehypeRaw,
        rehypeIgnore,
        rehypeSlug,
        [
          rehypePrettyCode,
          {
            theme: {
              dark: shikiThemeDarkPlus,
              light: shikiThemeLightPlus,
            },
          },
        ],
      ],
      format: "md",
    },
  });
}

export default async function Page() {
  const readmeSource = await loadREADME();
  const mdxSource = await generateMDX(readmeSource);

  return (
    <article className="position fixed dark:bg-dark-800 bg-white p-6 pb-20 shadow">
      <div className="prose max-w-none">
        <MDXRemote {...mdxSource} />
      </div>
    </article>
  );
}
