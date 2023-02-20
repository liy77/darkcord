import { dirname, join, relative } from "node:path";
import { DeclarationReflection } from "typedoc";
import {
  DocumentedClass,
  DocumentedMethod,
  DocumentedInterface,
  DocumentedTypeDef,
  DocumentedExternal,
  DocumentedConstructor,
  DocumentedEvent,
  DocumentedMember,
} from "./docs/index";
import type { ChildTypes, Config, CustomDocs, RootTypes } from "./utils/types";

export class Docs {
  readonly classes = new Map<string, DocumentedClass>();

  readonly functions = new Map<string, DocumentedMethod>();

  readonly interfaces = new Map<string, DocumentedInterface>();

  readonly typedefs = new Map<string, DocumentedTypeDef>();

  readonly externals = new Map<string, DocumentedExternal>();

  constructor(
    data: DeclarationReflection[] | RootTypes[],
    private config: Config,
    private custom?: Record<string, CustomDocs>,
  ) {
    const items = data as DeclarationReflection[];

    for (const item of items) {
      switch (item.kindString) {
        case "Class": {
          this.classes.set(item.name, new DocumentedClass(item, config));
          if (item.children) {
            this.parse(item.children, item);
          }

          break;
        }

        case "Function": {
          this.functions.set(item.name, new DocumentedMethod(item, config));
          break;
        }

        case "Interface":
        case "Type alias":
        case "Enumeration":
          this.typedefs.set(item.name, new DocumentedTypeDef(item, config));
          if (item.children) {
            this.parse(item.children, item);
          }

          break;

        default:
          break;
      }
    }
  }

  parse(
    items: ChildTypes[] | DeclarationReflection[],
    prop?: DeclarationReflection,
  ) {
    const it = items as DeclarationReflection[];

    for (const member of it) {
      let item:
        | DocumentedConstructor
        | DocumentedEvent
        | DocumentedMember
        | DocumentedMethod
        | null = null;

      switch (member.kindString) {
        case "Constructor": {
          item = new DocumentedConstructor(member, this.config);
          break;
        }

        case "Method": {
          const event = prop?.groups?.find((group) => group.title === "Events");
          if ((event?.children as unknown as number[])?.includes(member.id)) {
            item = new DocumentedEvent(member, this.config);
            break;
          }

          item = new DocumentedMethod(member, this.config);
          break;
        }

        case "Property": {
          item = new DocumentedMember(member, this.config);
          break;
        }

        default: {
          console.warn(
            `- Unknown documentation kind "${
              member.kindString
            }" - \n${JSON.stringify(member)}\n`,
          );
        }
      }

      const parent =
        this.classes.get(prop!.name) ?? this.interfaces.get(prop!.name);
      if (parent) {
        if (item) {
          parent.add(item);
        } else {
          console.warn(
            `- Documentation item could not be constructed for "${
              member.name
            }" - \n${JSON.stringify(member)}\n`,
          );
        }

        continue;
      }

      const info = [];
      const name = (member.name || item?.data.name) ?? "UNKNOWN";
      const meta =
        member.kindString === "constructor"
          ? null
          : {
              file: member.sources?.[0]?.fileName,
              line: member.sources?.[0]?.line,
              path: dirname(member.sources?.[0]?.fileName ?? ""),
            };

      if (prop!.name) {
        info.push(`member of "${prop!.name}"`);
      }

      if (meta) {
        info.push(
          `${relative(this.config.root, join(meta.path, meta.file ?? ""))}${
            meta.line ? `:${meta.line}` : ""
          }`,
        );
      }

      console.warn(
        `- "${name}"${
          info.length ? ` (${info.join(", ")})` : ""
        } has no accessible parent.`,
      );
      if (!name && !info.length) {
        console.warn("Raw object:", member);
      }
    }
  }

  serialize() {
    return {
      meta: {
        generator: require("../package.json").version,
        format: Docs.FormatVersion,
        date: Date.now(),
      },
      classes: [...this.classes.values()].map((_class) => _class.serialize()),
      functions: [...this.functions.values()].map((_function) =>
        _function.serialize(),
      ),
      interfaces: [...this.interfaces.values()].map((_interface) =>
        _interface.serialize(),
      ),
      typedefs: [...this.typedefs.values()].map((_typedef) =>
        _typedef.serialize(),
      ),
      externals: [...this.externals.values()].map((_external) =>
        _external.serialize(),
      ),
      custom: this.custom,
    };
  }

  static readonly FormatVersion = 30;
}
