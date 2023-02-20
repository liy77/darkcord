import { createCommand } from "commander";
import { readFileSync, writeFileSync } from "fs";
import { dirname, join, extname, basename, relative } from "path";
import { Application, DeclarationReflection, TSConfigReader } from "typedoc";
import { ChildTypes, CustomDocs, RootTypes } from "./utils/types";
import { blue, red } from "colors";
import { Docs } from "./docs";

export interface CLIOptions {
  custom: string;
  input: string[];
  output: string;
  root: string;
}

interface CustomFiles {
  files: {
    id?: string;
    name: string;
    path: string;
  }[];
  id?: string;
  name: string;
  path?: string;
}

const command = createCommand()
  .version(require("../package.json").version)
  .option("-i, --input <string...>", "Source directories to parse JSDocs in")
  .option("-c, --custom <string>", "Custom docs definition file to use")
  .option("-r, --root [string]", "Root directory of the project", ".")
  .option("-o, --output <string>", "Path to output file");

const program = command.parse(process.argv);
const { input, root, output, custom: customDocs } = program.opts<CLIOptions>();

if (!input) {
  console.log(`${red("error")} Missing input file.`);
  process.exit(1);
}

let data: (ChildTypes & RootTypes)[] | DeclarationReflection[] = [];

console.log(`${blue("info")} Parsing Typescript in source files...`);

const app = new Application();

app.options.addReader(new TSConfigReader());
app.bootstrap({ entryPoints: input });

const project = app.convert();

if (project) {
  // @ts-expect-error: Types are lost with this method
  data = app.serializer.toObject(project).children!;
  console.log(`${data.length} items parsed.`);
}

const custom: Record<string, CustomDocs> = {};

if (customDocs) {
  console.log(`${blue("info")} Loading custom docs files...`);

  const customDir = dirname(customDocs);
  const file = readFileSync(customDocs, "utf8");
  const data = JSON.parse(file) as CustomFiles[];

  for (const category of data) {
    const categoryId = category.id ?? category.name.toLowerCase();
    const dir = join(customDir, category.path ?? categoryId);
    custom[categoryId] = {
      name: category.name || category.id!,
      files: {},
    };

    for (const file of category.files) {
      const fileRootPath = join(dir, file.path);
      const extension = extname(file.path);
      const fileId = file.id ?? basename(file.path, extension);
      const fileData = readFileSync(fileRootPath, "utf8");
      custom[categoryId]!.files[fileId] = {
        name: file.name,
        type: extension.toLowerCase().replace(/^\./, ""),
        content: fileData,
        path: relative(root, fileRootPath).replaceAll("\\", "/"),
      };
    }
  }

  const fileCount = Object.keys(custom)
    .map((key) => Object.keys(custom[key]!))
    .reduce((prev, content) => prev + content.length, 0);
  const categoryCount = Object.keys(custom).length;
  console.log(
    `${blue("info")} ${fileCount} custom docs file${
      fileCount === 1 ? "" : "s"
    } in ` +
      `${categoryCount} categor${categoryCount === 1 ? "y" : "ies"} loaded.`,
  );
}

console.log(
  `${blue("info")} Serializing documentation with format version ${
    Docs.FormatVersion
  }...`,
);
const docs = new Docs(
  data,
  { input, custom: customDocs, root, output },
  custom,
);

if (output) {
  console.log(`${blue("info")} Writing to ${output}...`);
  writeFileSync(output, JSON.stringify(docs.serialize()));
}

console.log("✅ Done!");
