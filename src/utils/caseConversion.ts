/**
 * Converts a camelCase string to snake_case
 * @param str The camelCase string to convert
 * @returns The snake_case version of the string
 */
export function camelToSnakeCase(str: string): string {
  // Handle empty string
  if (!str) return str;

  let result = '';

  for (let i = 0; i < str.length; i++) {
    const char = str[i];
    const prevChar = i > 0 ? str[i - 1] : '';
    const nextChar = i < str.length - 1 ? str[i + 1] : '';

    // Check if we need to insert an underscore
    if (i > 0 && /[A-Z]/.test(char)) {
      // Case 1: lowercase/digit followed by uppercase (camelCase -> camel_case)
      if (/[a-z\d]/.test(prevChar)) {
        result += '_';
      }
      // Case 2: uppercase followed by uppercase+lowercase (XMLHttp -> xml_http)
      else if (/[A-Z]/.test(prevChar) && nextChar && /[a-z]/.test(nextChar)) {
        result += '_';
      }
    }

    result += char.toLowerCase();
  }

  // Remove leading underscore if present
  return result.replace(/^_/, '');
}

/**
 * Converts an array of camelCase strings to snake_case
 * @param arr The array of camelCase strings to convert
 * @returns The array with all strings converted to snake_case
 */
export function camelToSnakeCaseArray(arr: string[]): string[] {
  return arr.map((item) => camelToSnakeCase(item));
}
