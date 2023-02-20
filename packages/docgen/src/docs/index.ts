import { basename, parse } from "node:path";
import type {
  DeclarationReflection,
  LiteralType,
  ParameterReflection,
  SignatureReflection,
  SourceReference,
} from "typedoc";
import { Types, getVarNames, parseType } from "../utils/index";
import type {
  Class,
  Config,
  Constructor,
  Event,
  External,
  Interface,
  Item,
  Member,
  Meta,
  Method,
  Param,
  Typedef,
  VarType,
} from "../utils/types";

export class DocumentedItem<T = DeclarationReflection | Item> {
  constructor(readonly data: T, readonly config: Config) {}

  serialize() {
    try {
      return this.serializer();
    } catch (err: any) {
      err.message = `Error while serializing ${this.toString()}: ${
        err.message
      }`;
    }
  }

  protected serializer() {}

  toString() {
    const data = this.data as unknown as Item | undefined;
    if (!data) return this.constructor.name;
    if (data.id || data.name)
      return `${data.id ?? data.name} (${this.constructor.name})`;
    return this.constructor.name;
  }
}

export class DocumentedVarType extends DocumentedItem<VarType> {
  serializer() {
    const data = this.data;
    const names = data.names?.map((name) => getVarNames(parseType(name)));

    if (!data.description && !data.nullable) {
      return names;
    }

    return {
      types: names,
      description: data.description,
      nullable: data.nullable,
    };
  }
}

export class DocumentedTypeDef extends DocumentedItem<
  DeclarationReflection | Typedef
> {
  serializer() {
    const data = this.data as DeclarationReflection;
    const signature = (data.signatures ?? [])[0] ?? data;
    let meta;

    const sources = data.sources?.[0];
    if (sources) {
      meta = new DocumentedItemMeta(sources, this.config).serialize();
    }

    const see = signature.comment?.blockTags?.filter(
      (block) => block.tag === "@see",
    ).length
      ? signature.comment.blockTags
          .filter((block) => block.tag === "@see")
          .map((block) =>
            block.content
              .find((contentText) => contentText.kind === "text")
              ?.text.trim(),
          )
      : undefined;

    const baseReturn = {
      name: signature.name,
      description:
        signature.comment?.summary
          ?.reduce((prev, curr) => (prev += curr.text), "")
          .trim() || undefined,
      see,
      access:
        data.flags.isPrivate ||
        signature.comment?.blockTags?.some(
          (block) => block.tag === "@private" || block.tag === "@internal",
        )
          ? "private"
          : undefined,
      deprecated: signature.comment?.blockTags?.some(
        (block) => block.tag === "@deprecated",
      )
        ? signature.comment.blockTags
            .find((block) => block.tag === "@deprecated")
            ?.content.reduce((prev, curr) => (prev += curr.text), "")
            .trim() ?? true
        : undefined,
      type: signature.type
        ? new DocumentedVarType(
            { names: [parseType(signature.type)] },
            this.config,
          ).serialize()
        : undefined,
      meta,
    };

    let typeDef: DeclarationReflection | undefined;
    if (Types.isReflection(data.type)) {
      typeDef = data.type.declaration;
    } else if (data.kindString === "Interface") {
      typeDef = data;
    } else if (data.kindString === "Enumeration") {
      return {
        ...baseReturn,
        props: data.children?.length
          ? data.children.map((child) => ({
              name: child.name,
              description:
                child.comment?.summary
                  ?.reduce((prev, curr) => (prev += curr.text), "")
                  .trim() || undefined,
              type: [[[(child.type as LiteralType | undefined)?.value]]],
            }))
          : undefined,
      };
    }

    if (typeDef) {
      const { children, signatures } = typeDef;

      if (children && children.length > 0) {
        const props = children.map((child) => ({
          name: child.name,
          description:
            child.comment?.summary
              ?.reduce((prev, curr) => (prev += curr.text), "")
              .trim() ||
            child.signatures?.[0]?.comment?.summary
              ?.reduce((prev, curr) => (prev += curr.text), "")
              .trim() ||
            undefined,
          optional:
            child.flags.isOptional || typeof child.defaultValue !== "undefined",
          default:
            (child.defaultValue === "..." ? undefined : child.defaultValue) ??
            (child.comment?.blockTags
              ?.find((block) => block.tag === "@default")
              ?.content.reduce((prev, curr) => (prev += curr.text), "")
              .trim() ||
              undefined),
          type: child.type
            ? new DocumentedVarType(
                { names: [parseType(child.type)] },
                this.config,
              ).serialize()
            : child.kindString === "Method"
            ? new DocumentedVarType(
                {
                  names: [
                    parseType({
                      type: "reflection",
                      declaration: child,
                    }),
                  ],
                  description: child.signatures?.[0]?.comment?.blockTags
                    ?.find((block) => block.tag === "@returns")
                    ?.content.reduce((prev, curr) => (prev += curr.text), "")
                    .trim(),
                },
                this.config,
              ).serialize()
            : undefined,
        }));

        return {
          ...baseReturn,
          props,
        };
      }

      if (signatures && signatures.length > 0) {
        const sig = signatures[0];

        const params = sig?.parameters?.map((param) => ({
          name: param.name,
          description:
            param.comment?.summary
              ?.reduce((prev, curr) => (prev += curr.text), "")
              .trim() || undefined,
          optional:
            param.flags.isOptional || typeof param.defaultValue !== "undefined",
          default:
            (param.defaultValue === "..." ? undefined : param.defaultValue) ??
            (param.comment?.blockTags
              ?.find((block) => block.tag === "@default")
              ?.content.reduce((prev, curr) => (prev += curr.text), "")
              .trim() ||
              undefined),
          type: param.type
            ? new DocumentedVarType(
                { names: [parseType(param.type)] },
                this.config,
              ).serialize()
            : undefined,
        }));

        const see = sig?.comment?.blockTags?.filter(
          (block) => block.tag === "@see",
        ).length
          ? sig.comment.blockTags
              .filter((block) => block.tag === "@see")
              .map((block) =>
                block.content
                  .find((contentText) => contentText.kind === "text")
                  ?.text.trim(),
              )
          : undefined;

        return {
          ...baseReturn,
          description:
            sig?.comment?.summary
              ?.reduce((prev, curr) => (prev += curr.text), "")
              .trim() || undefined,
          see,
          access:
            sig?.flags.isPrivate ||
            sig?.comment?.blockTags?.some(
              (block) => block.tag === "@private" || block.tag === "@internal",
            )
              ? "private"
              : undefined,
          deprecated: sig?.comment?.blockTags?.some(
            (block) => block.tag === "@deprecated",
          )
            ? sig.comment.blockTags
                .find((block) => block.tag === "@deprecated")
                ?.content.reduce((prev, curr) => (prev += curr.text), "")
                .trim() ?? true
            : undefined,
          params,
          returns: sig?.type
            ? [
                new DocumentedVarType(
                  {
                    names: [parseType(sig.type)],
                    description:
                      sig.comment?.blockTags
                        ?.find((block) => block.tag === "@returns")
                        ?.content.reduce(
                          (prev, curr) => (prev += curr.text),
                          "",
                        )
                        .trim() || undefined,
                  },
                  this.config,
                ).serialize(),
              ]
            : undefined,
          returnsDescription:
            sig?.comment?.blockTags
              ?.find((block) => block.tag === "@returns")
              ?.content.reduce((prev, curr) => (prev += curr.text), "")
              .trim() || undefined,
          meta,
        };
      }
    }

    return baseReturn;
  }
}

export class DocumentedParam extends DocumentedItem<
  Param | ParameterReflection
> {
  serializer() {
    const data = this.data as ParameterReflection;

    return {
      name: data.name,
      description:
        data.comment?.summary
          ?.reduce((prev, curr) => (prev += curr.text), "")
          .trim() || undefined,
      optional:
        data.flags.isOptional || typeof data.defaultValue !== "undefined",
      default:
        (data.defaultValue === "..." ? undefined : data.defaultValue) ??
        (data.comment?.blockTags
          ?.find((block) => block.tag === "@default")
          ?.content.reduce((prev, curr) => (prev += curr.text), "")
          .trim() ||
          undefined),
      variable: data.flags.isRest,
      type: data.type
        ? new DocumentedVarType(
            { names: [parseType(data.type)] },
            this.config,
          ).serialize()
        : undefined,
    };
  }
}

export class DocumentedItemMeta extends DocumentedItem<Meta | SourceReference> {
  override serializer() {
    const data = this.data as SourceReference;

    return {
      line: data.line,
      file: basename(data.fileName),
      path: undefined,
      url: data.url,
    };
  }
}

export class DocumentedMethod extends DocumentedItem<
  DeclarationReflection | Method
> {
  serializer() {
    const data = this.data as DeclarationReflection;
    const signature = (data.signatures ?? [])[0] ?? data;
    let meta;

    const sources = data.sources?.[0];
    if (sources) {
      meta = new DocumentedItemMeta(sources, this.config).serialize();
    }

    const see = signature.comment?.blockTags?.filter(
      (block) => block.tag === "@see",
    ).length
      ? signature.comment.blockTags
          .filter((block) => block.tag === "@see")
          .map((block) =>
            block.content
              .find((innerContent) => innerContent.kind === "text")
              ?.text.trim(),
          )
      : undefined;

    const examples = signature.comment?.blockTags?.filter(
      (block) => block.tag === "@example",
    ).length
      ? signature.comment.blockTags
          .filter((block) => block.tag === "@example")
          .map((block) =>
            block.content
              .reduce((prev, curr) => (prev += curr.text), "")
              .trim(),
          )
      : undefined;

    return {
      name: signature.name,
      description:
        signature.comment?.summary
          ?.reduce((prev, curr) => (prev += curr.text), "")
          .trim() || undefined,
      see,
      scope: data.flags.isStatic ? "static" : undefined,
      access:
        data.flags.isPrivate ||
        signature.comment?.blockTags?.some(
          (block) => block.tag === "@private" || block.tag === "@internal",
        )
          ? "private"
          : undefined,
      examples,
      abstract:
        signature.comment?.blockTags?.some(
          (block) => block.tag === "@abstract",
        ) || undefined,
      deprecated: signature.comment?.blockTags?.some(
        (block) => block.tag === "@deprecated",
      )
        ? signature.comment.blockTags
            .find((block) => block.tag === "@deprecated")
            ?.content.reduce((prev, curr) => (prev += curr.text), "")
            .trim() ?? true
        : undefined,
      params: signature.parameters
        ? (signature as SignatureReflection).parameters?.map((param) =>
            new DocumentedParam(param, this.config).serialize(),
          )
        : undefined,
      returns: signature.type
        ? [
            new DocumentedVarType(
              {
                names: [parseType(signature.type)],
                description:
                  signature.comment?.blockTags
                    ?.find((block) => block.tag === "@returns")
                    ?.content.reduce((prev, curr) => (prev += curr.text), "")
                    .trim() || undefined,
              },
              this.config,
            ).serialize(),
          ]
        : undefined,
      returnsDescription:
        signature.comment?.blockTags
          ?.find((block) => block.tag === "@returns")
          ?.content.reduce((prev, curr) => (prev += curr.text), "")
          .trim() || undefined,
      meta,
    };
  }
}

export class DocumentedMember extends DocumentedItem<
  DeclarationReflection | Member
> {
  serializer() {
    const data = this.data as DeclarationReflection;
    const signature = (data.signatures ?? [])[0] ?? data;
    let meta;

    const sources = data.sources?.[0];
    if (sources) {
      meta = new DocumentedItemMeta(sources, this.config).serialize();
    }

    const see = signature.comment?.blockTags?.filter(
      (block) => block.tag === "@see",
    ).length
      ? signature.comment.blockTags
          .filter((block) => block.tag === "@see")
          .map((block) =>
            block.content
              .find((contentText) => contentText.kind === "text")
              ?.text.trim(),
          )
      : undefined;

    const base = {
      name: signature.name,
      description:
        signature.comment?.summary
          ?.reduce((prev, curr) => (prev += curr.text), "")
          .trim() || undefined,
      see,
      scope: data.flags.isStatic ? "static" : undefined,
      access:
        data.flags.isPrivate ||
        signature.comment?.blockTags?.some(
          (block) => block.tag === "@private" || block.tag === "@internal",
        )
          ? "private"
          : undefined,
      readonly: data.flags.isReadonly,
      abstract:
        signature.comment?.blockTags?.some(
          (block) => block.tag === "@abstract",
        ) || undefined,
      deprecated: signature.comment?.blockTags?.some(
        (block) => block.tag === "@deprecated",
      )
        ? signature.comment.blockTags
            .find((block) => block.tag === "@deprecated")
            ?.content.reduce((prev, curr) => (prev += curr.text), "")
            .trim() ?? true
        : undefined,
      default:
        (data.defaultValue === "..." ? undefined : data.defaultValue) ??
        (signature.comment?.blockTags
          ?.find((block) => block.tag === "@default")
          ?.content.reduce((prev, curr) => (prev += curr.text), "")
          .trim() ||
          undefined),
      type: signature.type
        ? new DocumentedVarType(
            { names: [parseType(signature.type)] },
            this.config,
          ).serialize()
        : undefined,
      meta,
    };

    if (data.kindString === "Accessor") {
      const getter = data.getSignature;
      const hasSetter = data.setSignature;

      if (!getter) {
        throw new Error("Can't parse accessor without getter.");
      }

      if (!hasSetter) {
        base.readonly = true;
      }

      const see = getter.comment?.blockTags?.filter(
        (block) => block.tag === "@see",
      ).length
        ? getter.comment.blockTags
            .filter((block) => block.tag === "@see")
            .map((block) =>
              block.content
                .find((contentText) => contentText.kind === "text")
                ?.text.trim(),
            )
        : undefined;

      return {
        ...base,
        description:
          getter.comment?.summary
            ?.reduce((prev, curr) => (prev += curr.text), "")
            .trim() || undefined,
        see,
        access:
          data.flags.isPrivate ||
          getter.comment?.blockTags?.some(
            (block) => block.tag === "@private" || block.tag === "@internal",
          )
            ? "private"
            : undefined,
        readonly: base.readonly || !hasSetter,
        abstract:
          getter.comment?.blockTags?.some(
            (block) => block.tag === "@abstract",
          ) || undefined,
        deprecated: getter.comment?.blockTags?.some(
          (block) => block.tag === "@deprecated",
        )
          ? getter.comment.blockTags
              .find((block) => block.tag === "@deprecated")
              ?.content.reduce((prev, curr) => (prev += curr.text), "")
              .trim() ?? true
          : undefined,
        default:
          base.default ??
          (getter.comment?.blockTags
            ?.find((block) => block.tag === "@default")
            ?.content.reduce((prev, curr) => (prev += curr.text), "")
            .trim() ||
            undefined),
        type: getter.type ? parseType(getter.type) : undefined,
      };
    }

    return base;
  }
}

export class DocumentedConstructor extends DocumentedItem<
  Constructor | DeclarationReflection
> {
  serializer() {
    const data = this.data as DeclarationReflection;
    const signature = (data.signatures ?? [])[0] ?? data;

    const see = signature.comment?.blockTags?.filter(
      (block) => block.tag === "@see",
    ).length
      ? signature.comment.blockTags
          .filter((block) => block.tag === "@see")
          .map((block) =>
            block.content
              .find((textContent) => textContent.kind === "text")
              ?.text.trim(),
          )
      : undefined;

    return {
      name: signature.name,
      description:
        signature.comment?.summary
          ?.reduce((prev, curr) => (prev += curr.text), "")
          .trim() || undefined,
      see,
      access:
        data.flags.isPrivate ||
        signature.comment?.blockTags?.some(
          (block) => block.tag === "@private" || block.tag === "@internal",
        )
          ? "private"
          : undefined,
      params: signature.parameters
        ? (signature as SignatureReflection).parameters?.map((param) =>
            new DocumentedParam(param, this.config).serialize(),
          )
        : undefined,
    };
  }
}

export class DocumentedEvent extends DocumentedItem<
  DeclarationReflection | Event
> {
  serializer() {
    const data = this.data as DeclarationReflection;
    const signature = (data.signatures ?? [])[0] ?? data;
    let meta;

    const sources = data.sources?.[0];
    if (sources) {
      meta = new DocumentedItemMeta(sources, this.config).serialize();
    }

    const see = signature.comment?.blockTags?.filter(
      (block) => block.tag === "@see",
    ).length
      ? signature.comment.blockTags
          .filter((block) => block.tag === "@see")
          .map((block) =>
            block.content
              .find((contentText) => contentText.kind === "text")
              ?.text.trim(),
          )
      : undefined;

    const examples = signature.comment?.blockTags?.filter(
      (block) => block.tag === "@example",
    ).length
      ? signature.comment.blockTags
          .filter((block) => block.tag === "@example")
          .map((block) =>
            block.content
              .reduce((prev, curr) => (prev += curr.text), "")
              .trim(),
          )
      : undefined;

    return {
      // @ts-expect-error
      name: signature.parameters?.[0]?.type?.value,
      description:
        signature.comment?.summary
          ?.reduce((prev, curr) => (prev += curr.text), "")
          .trim() || undefined,
      see,
      access:
        data.flags.isPrivate ||
        signature.comment?.blockTags?.some(
          (block) => block.tag === "@private" || block.tag === "@internal",
        )
          ? "private"
          : undefined,
      examples,
      deprecated: signature.comment?.blockTags?.some(
        (block) => block.tag === "@deprecated",
      )
        ? signature.comment.blockTags
            .find((block) => block.tag === "@deprecated")
            ?.content.reduce((prev, curr) => (prev += curr.text), "")
            .trim() ?? true
        : undefined,
      params: signature.parameters
        ? (signature as SignatureReflection).parameters
            ?.slice(1)
            .map((param) => new DocumentedParam(param, this.config).serialize())
        : undefined,
      returns: signature.type
        ? [
            new DocumentedVarType(
              {
                names: [parseType(signature.type)],
                description:
                  signature.comment?.blockTags
                    ?.find((block) => block.tag === "@returns")
                    ?.content.reduce((prev, curr) => (prev += curr.text), "")
                    .trim() || undefined,
              },
              this.config,
            ).serialize(),
          ]
        : undefined,
      returnsDescription:
        signature.comment?.blockTags
          ?.find((block) => block.tag === "@returns")
          ?.content.reduce((prev, curr) => (prev += curr.text), "")
          .trim() || undefined,
      meta,
    };
  }
}

export class DocumentedClass extends DocumentedItem<
  Class | DeclarationReflection
> {
  readonly props = new Map<string, DocumentedMember>();

  readonly methods = new Map<string, DocumentedMethod>();

  readonly events = new Map<string, DocumentedEvent>();

  construct: DocumentedConstructor | null = null;

  extends: DocumentedVarType | null = null;

  implements: DocumentedVarType | null = null;

  constructor(data: Class | DeclarationReflection, config: Config) {
    super(data, config);

    const newData = data as DeclarationReflection;
    const extended = newData.extendedTypes?.[0];
    if (extended) {
      this.extends = new DocumentedVarType(
        { names: [parseType(extended)] },
        this.config,
      );
    }

    const implemented = newData.implementedTypes?.[0];
    if (implemented) {
      this.implements = new DocumentedVarType(
        { names: [parseType(implemented)] },
        this.config,
      );
    }
  }

  add(
    item:
      | DocumentedConstructor
      | DocumentedEvent
      | DocumentedMember
      | DocumentedMethod,
  ) {
    if (item instanceof DocumentedConstructor) {
      if (this.construct) {
        throw new Error(`Doc ${this.data.name} already has constructor`);
      }

      this.construct = item;
    } else if (item instanceof DocumentedMethod) {
      const prefix =
        // @ts-expect-error
        item.data.scope === "static" || item.data.flags?.isStatic ? "s-" : "";
      if (this.methods.has(prefix + item.data.name)) {
        throw new Error(
          `Doc ${this.data.name} already has method ${item.data.name}`,
        );
      }

      this.methods.set(prefix + item.data.name, item);
    } else if (item instanceof DocumentedMember) {
      if (this.props.has(item.data.name)) {
        throw new Error(
          `Doc ${this.data.name} already has prop ${item.data.name}`,
        );
      }

      this.props.set(item.data.name, item);
    } else if (item instanceof DocumentedEvent) {
      if (this.events.has(item.data.name)) {
        throw new Error(
          `Doc ${this.data.name} already has event ${item.data.name}`,
        );
      }

      this.events.set(item.data.name, item);
    }
  }

  serializer() {
    const data = this.data as DeclarationReflection;
    const signature = (data.signatures ?? [])[0] ?? data;
    let meta: any;

    const sources = data.sources?.[0];
    if (sources) {
      meta = new DocumentedItemMeta(sources, this.config).serialize();
    }

    const see = signature.comment?.blockTags?.filter(
      (block) => block.tag === "@see",
    ).length
      ? signature.comment.blockTags
          .filter((block) => block.tag === "@see")
          .map((block) =>
            block.content
              .find((contentText) => contentText.kind === "text")
              ?.text.trim(),
          )
      : undefined;

    return {
      name:
        signature.name === "default"
          ? parse(meta?.file ?? "default").name
          : signature.name,
      description:
        signature.comment?.summary
          .reduce((prev, curr) => (prev += curr.text), "")
          .trim() || undefined,
      see,
      extends: this.extends?.serialize(),
      implements: this.implements?.serialize(),
      access:
        data.flags.isPrivate ||
        signature.comment?.blockTags?.some(
          (block) => block.tag === "@private" || block.tag === "@internal",
        )
          ? "private"
          : undefined,
      abstract:
        signature.comment?.blockTags?.some(
          (block) => block.tag === "@abstract",
        ) || undefined,
      deprecated: signature.comment?.blockTags?.some(
        (block) => block.tag === "@deprecated",
      )
        ? signature.comment.blockTags
            .find((block) => block.tag === "@deprecated")
            ?.content.reduce((prev, curr) => (prev += curr.text), "")
            .trim() ?? true
        : undefined,
      construct: this.construct?.serialize(),
      props: this.props.size
        ? [...this.props.values()].map((param) => param.serialize())
        : undefined,
      methods: this.methods.size
        ? [...this.methods.values()].map((method) => method.serialize())
        : undefined,
      events: this.events.size
        ? [...this.events.values()].map((event) => event.serialize())
        : undefined,
    };
  }
}

export class DocumentedExternal extends DocumentedItem<External> {
  serializer() {
    return {
      name: this.data.name,
      description: this.data.description,
      see: this.data.see,
      meta: new DocumentedItemMeta(this.data.meta, this.config).serialize(),
    };
  }
}

export class DocumentedInterface extends DocumentedClass {
  serializer() {
    const data = this.data as unknown as Interface;
    const serialized = super.serializer();
    serialized.description = data.classdesc;
    return serialized;
  }
}
