/**
 * Converts a camelCase string to snake_case
 * @param str The camelCase string to convert
 * @returns The snake_case version of the string
 */
export function camelToSnakeCase(str: string): string {
  return str.replace(/([A-Z])/g, '_$1').toLowerCase();
}

/**
 * Converts an array of camelCase strings to snake_case
 * @param arr The array of camelCase strings to convert
 * @returns The array with all strings converted to snake_case
 */
export function camelToSnakeCaseArray(arr: string[]): string[] {
  return arr.map((item) => camelToSnakeCase(item));
}
