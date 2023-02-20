export type Access = "private" | "protected" | "public";

export interface Meta {
  filename: string;
  lineno: number;
  path: string;
}

export interface Item {
  description: string;
  id: string;
  ignore?: boolean;
  kind: string;
  longname: string;
  name: string;
  order: number;
}

export interface Type {
  names?: string[] | undefined;
}

export interface Typedef extends Item {
  access?: Access;
  deprecated?: boolean | string;
  kind: "typedef";
  meta: Meta;
  params?: Param[];
  properties?: Param[];
  returns?: Return[];
  scope: Scope;
  see?: string[];
  type: Type;
}

export interface VarType extends Type {
  description?: string | undefined;
  nullable?: boolean | undefined;
  type?: Required<Type> | undefined;
}

export type Scope = "global" | "instance" | "static";

export type RootTypes = Class | External | Interface | Method | Typedef;

export interface Return {
  description?: string;
  nullable?: boolean;
  type: Required<Type>;
}

export interface Param {
  defaultvalue?: string;
  description: string;
  name: string;
  nullable?: boolean;
  optional?: boolean;
  type: Type;
  variable?: string;
}

export interface Method extends Item {
  access?: Access;
  async?: boolean;
  deprecated?: boolean | string;
  examples?: string[];
  exceptions?: Exception[];
  fires?: string[];
  generator?: boolean;
  implements?: string[];
  inherited?: boolean;
  inherits?: string;
  kind: "function";
  memberof?: string;
  meta: Meta;
  params?: Param[];
  returns?: Return[];
  scope: Scope;
  see?: string[];
  virtual?: boolean;
}

export interface Member extends Item {
  access?: Access;
  default?: string;
  deprecated?: boolean | string;
  kind: "member";
  memberof: string;
  meta: Meta;
  nullable?: boolean;
  properties?: Param[];
  readonly?: boolean;
  scope: Scope;
  see?: string[];
  type: Type;
  virtual?: boolean;
}

// @ts-expect-error
export interface Interface extends Class {
  classdesc: string;
  kind: "interface";
}

export interface External extends Item {
  kind: "external";
  meta: Meta;
  see?: string[];
}

export interface Exception {
  description?: string;
  nullable?: boolean;
  type: Type;
}

export interface Event extends Item {
  deprecated?: boolean | string;
  kind: "event";
  memberof: string;
  meta: Meta;
  params?: Param[];
  scope: Scope;
  see?: string[];
}

export interface CustomDocs {
  files: Record<
    string,
    {
      content?: string;
      name?: string;
      path?: string;
      type?: string;
    }
  >;
  name?: string;
}

export interface Class extends Item {
  access?: Access;
  augments?: string[];
  deprecated?: boolean | string;
  implements?: string[];
  kind: "class";
  meta: Meta;
  scope: Scope;
  see?: string[];
  virtual?: boolean;
}

export interface Config {
  custom: string;
  input: string[];
  output: string;
  root: string;
}

export interface Constructor extends Item {
  access?: Access;
  kind: "constructor";
  memberof: string;
  params?: Param[];
  see?: string[];
}

export type ChildTypes = Constructor | Event | Member | Method;
