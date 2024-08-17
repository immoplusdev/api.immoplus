export function omitObjectProperties<T = any>(obj: T, keysToOmit: string[]): T {
  return Object.keys(obj)
    .filter(key => !keysToOmit.includes(key))
    .reduce((result, key) => {
      result[key] = obj[key];
      return result;
    }, {}) as T;
}