import type { JSONOutput } from "typedoc";

export function isASymbol(char: string) {
  return "-!$%^&*()_+|~=`{}[]:;<>?,. ".includes(char);
}

export namespace Types {
  export function isObjectAnd(o: unknown, t: string): boolean {
    return typeof o === "object" && o !== null && "type" in o && o.type === t;
  }

  export function isQuery(o: unknown): o is JSONOutput.QueryType {
    return isObjectAnd(o, "query");
  }

  export function isUnknown(o: unknown): o is JSONOutput.UnknownType {
    return isObjectAnd(o, "unknown");
  }

  export function isUnion(o: unknown): o is JSONOutput.UnionType {
    return isObjectAnd(o, "union");
  }

  export function isTypeOperator(o: unknown): o is JSONOutput.TypeOperatorType {
    return isObjectAnd(o, "typeOperator");
  }

  export function isReflection(o: unknown): o is JSONOutput.ReflectionType {
    return isObjectAnd(o, "reflection");
  }

  export function isArray(o: unknown): o is JSONOutput.ArrayType {
    return isObjectAnd(o, "array");
  }

  export function isTuple(o: unknown): o is JSONOutput.TupleType {
    return isObjectAnd(o, "tuple");
  }

  export function isIntrinsic(o: unknown): o is JSONOutput.IntrinsicType {
    return isObjectAnd(o, "intrinsic");
  }

  export function isLiteral(o: unknown): o is JSONOutput.LiteralType {
    return isObjectAnd(o, "literal");
  }

  export function isPredicate(o: unknown): o is JSONOutput.PredicateType {
    return isObjectAnd(o, "predicate");
  }

  export function isReference(o: unknown): o is JSONOutput.ReferenceType {
    return isObjectAnd(o, "reference");
  }

  export function isConditional(o: unknown): o is JSONOutput.ConditionalType {
    return isObjectAnd(o, "conditional");
  }

  export function isIndexedAccess(
    o: unknown,
  ): o is JSONOutput.IndexedAccessType {
    return isObjectAnd(o, "indexedAccess");
  }

  export function isIntersection(o: unknown): o is JSONOutput.IntersectionType {
    return isObjectAnd(o, "intersection");
  }

  export function isInferred(o: unknown): o is JSONOutput.InferredType {
    return isObjectAnd(o, "inferred");
  }
}

export function parseType(
  t: JSONOutput.Type | JSONOutput.SomeType | string,
): string {
  if (typeof t === "string") return t;

  if (Types.isArray(t)) return `Array<${parseType(t.elementType)}>`;

  if (Types.isLiteral(t)) return t.value === "string" ? `"${t.value}"` : `${t.value}`;

  if (Types.isConditional(t))
    return `${parseType(t.checkType)} extends ${parseType(
      t.extendsType,
    )} ? ${parseType(t.trueType)} : ${parseType(t.falseType)}`;

  if (Types.isTuple(t))
    return `[${(t.elements ?? []).map(parseType).join(", ")}]`;

  if (Types.isTypeOperator(t)) return `${t.operator} ${parseType(t.target)}`;

  if (Types.isQuery(t)) return `(typeof ${parseType(t.queryType)})`;

  if (Types.isIntersection(t)) return t.types.map(parseType).join(" & ");

  if (Types.isUnion(t))
    return t.types
      .map(parseType)
      .filter((c) => c && c.trim().length > 0)
      .join(" |");

  if (Types.isReference(t))
    return (
      t.name +
      (t.typeArguments ? `<${t.typeArguments.map(parseType).join(", ")}>` : "")
    );

  if (Types.isPredicate(t))
    return (
      (t.asserts ? "asserts " : "") +
      t.name +
      (t.targetType ? ` is ${parseType(t.targetType)}` : "")
    );

  if (Types.isInferred(t) || Types.isUnknown(t) || Types.isIntrinsic(t))
    return t.name;

  if (Types.isIndexedAccess(t))
    return `${parseType(t.objectType)}[${parseType(t.indexType)}]`;

  if (Types.isReflection(t)) {
    const o = {} as Record<string, string>;

    const d = t.declaration!;

    if (d.children && d.children.length > 0) {
      for (const child of d.children) {
        if (child.type) o[child.name] = parseType(child.type);
      }

      return `{\n${Object.entries(o)
        .map(([k, v]) => `${k}: ${v}`)
        .join(",\n")}\n}`;
    }

    if (d.signatures && d.signatures.length > 0) {
      const s = d.signatures[0];
      const params = s?.parameters?.map(
        (p) => `${p.name}: ${p.type ? parseType(p.type) : "unknown"}`,
      );

      return `(${params?.join(", ") ?? "...args: unknown[]"}) => ${
        s?.type ? parseType(s.type) : "unknown"
      }`;
    }

    return "{}";
  }

  return "unknown";
}

export function getVarNames(str: string) {
  const res: string[][] = [];
  let currGroup: string[] = [];
  let currStr = "";

  for (const char of str) {
    const currentlyInASymbolSection = isASymbol(currStr[0]!);
    const charIsASymbol = isASymbol(char);

    if (currStr.length && currentlyInASymbolSection !== charIsASymbol) {
      if (char === ".") {
        continue;
      }

      currGroup.push(currStr);
      currStr = char;

      if (!charIsASymbol) {
        res.push(currGroup);
        currGroup = [];
      }
    } else {
      currStr += char;
    }
  }

  currGroup.push(currStr);
  res.push(currGroup);

  return res;
}
