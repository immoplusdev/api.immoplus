import { SchemaObject } from "./open-api-spec.interface";

export interface Type<T = any> extends Function {
  new (...args: any[]): T;
}
export interface SchemaObjectMetadata extends Omit<SchemaObject, 'type' | 'required'> {
  type?: Type<unknown> | Function | [Function] | string | Record<string, any>;
  isArray?: boolean;
  required?: boolean;
  name?: string;
  enumName?: string;
}
