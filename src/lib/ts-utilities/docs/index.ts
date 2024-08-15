import { SchemaObjectMetadata } from "./types";

export interface ApiPropertyOptions extends Omit<SchemaObjectMetadata, "name" | "enum"> {
  name?: string;
  enum?: any[] | Record<string, any> | (() => (any[] | Record<string, any>));
  enumName?: string;
}

export declare function DocProperty(options?: ApiPropertyOptions): PropertyDecorator;
export declare function createDocPropertyDecorator(options?: ApiPropertyOptions, overrideExisting?: boolean): PropertyDecorator;
export declare function DocPropertyOptional(options?: ApiPropertyOptions): PropertyDecorator;
export declare function DocResponseProperty(options?: Pick<ApiPropertyOptions, 'type' | 'example' | 'format' | 'enum' | 'deprecated'>): PropertyDecorator;