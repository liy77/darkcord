"use client";

import { useMemo } from "react";
import { Section } from "./Section";

export interface TableOfContentsSerializedMethod {
  kind: "Method" | "MethodSignature";
  name: string;
  overloadIndex?: number;
}

export interface TableOfContentsSerializedProperty {
  kind: "Property" | "PropertySignature";
  name: string;
}

export type TableOfContentsSerialized =
  | TableOfContentsSerializedMethod
  | TableOfContentsSerializedProperty;

export interface TableOfContentsItemProps {
  serializedMembers: TableOfContentsSerialized[];
}

export function TableOfContentsPropertyItem({
  property,
}: {
  property: TableOfContentsSerializedProperty;
}) {
  return (
    <a
      className="dark:border-dark-100 border-light-800 dark:hover:bg-dark-200 dark:active:bg-dark-100 hover:bg-light-700 active:bg-light-800 pl-6.5 focus:ring-width-2 focus:ring-white ml-[10px] border-l p-[5px] text-sm outline-0 focus:rounded focus:border-0 focus:ring"
      href={`#${property.name}`}
      key={property.name}
      title={property.name}
    >
      <span className="line-clamp-1">{property.name}</span>
    </a>
  );
}

export function TableOfContentsMethodItem({
  method,
}: {
  method: TableOfContentsSerializedMethod;
}) {
  if (method.overloadIndex && method.overloadIndex > 1) {
    return null;
  }

  const key = `${method.name}${
    method.overloadIndex && method.overloadIndex > 1
      ? `:${method.overloadIndex}`
      : ""
  }`;

  return (
    <a
      className="dark:border-dark-100 border-light-800 dark:hover:bg-dark-200 dark:active:bg-dark-100 hover:bg-light-700 active:bg-light-800 pl-6.5 focus:ring-width-2 focus:ring-white ml-[10px] flex flex-row place-items-center gap-2 border-l p-[5px] text-sm outline-0 focus:rounded focus:border-0 focus:ring"
      href={`#${key}`}
      key={key}
      title={method.name}
    >
      <span className="line-clamp-1">{method.name}</span>
      {method.overloadIndex && method.overloadIndex > 1 ? (
        <span className="text-xs">{method.overloadIndex}</span>
      ) : null}
    </a>
  );
}

export function TableOfContentItems({
  serializedMembers,
}: TableOfContentsItemProps) {
  const propertyItems = useMemo(
    () =>
      serializedMembers
        .filter(
          (member): member is TableOfContentsSerializedProperty =>
            member.kind === "Property" || member.kind === "PropertySignature",
        )
        .map((prop) => (
          <TableOfContentsPropertyItem key={prop.name} property={prop} />
        )),
    [serializedMembers],
  );

  const methodItems = useMemo(
    () =>
      serializedMembers
        .filter(
          (member): member is TableOfContentsSerializedMethod =>
            member.kind === "Method" || member.kind === "MethodSignature",
        )
        .map((member) => (
          <TableOfContentsMethodItem
            key={`${member.name}${
              member.overloadIndex ? `:${member.overloadIndex}` : ""
            }`}
            method={member}
          />
        )),
    [serializedMembers],
  );

  return (
    <div className="flex flex-col break-all p-3 pb-8">
      <div className="mt-4 ml-3">
        <span className="font-semibold">Contents</span>
      </div>
      <div className="mt-5.5 ml-2 flex flex-col gap-2">
        {propertyItems.length ? (
          <Section title="Properties">
            <div className="flex flex-col">{propertyItems}</div>
          </Section>
        ) : null}
        {methodItems.length ? (
          <Section title="Methods">
            <div className="flex flex-col">{methodItems}</div>
          </Section>
        ) : null}
      </div>
    </div>
  );
}
