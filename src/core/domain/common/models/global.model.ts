export type PrimaryKey = number | string;

/**
 * @example "published | archived | draft"
 */
export type Status = "published" | "archived" | "draft";

/**
 * Stringified UUIDv4.
 * See [RFC 4112](https://tools.ietf.org/html/rfc4122)
 * @pattern [0-9A-Fa-f]{8}-[0-9A-Fa-f]{4}-4[0-9A-Fa-f]{3}-[89ABab][0-9A-Fa-f]{3}-[0-9A-Fa-f]{12}
 * @example "52907745-7672-470e-a803-a2f8feb52944"
 */
export type Uuid = string;

export type AutoIncrementInteger = number;

/**
 * Stringified Date.
 * @example "2023-01-31T14:18:53.095Z"
 */
export type DateString = string;

/**
 * Stringified Date.
 * @example "01y:01M:01d:01h:01m:01s"
 */
export type PeriodeString = string;

/**
 * Json.
 * @example {
 *  "key1": "value1"
 * }
 */
export type RawJson = string;

export interface ArchiveItemRequest {
  status: "archived";
}

/**
 * @example { "field": { "_eq": "value" }}
 */
export type FilterQuery = string;
