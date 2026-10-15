/** Isomorphic input validation to ensure exercise data stays bounded. */
export const MAX_WORKBOOK_CHARS=4000;
export function validWorkbookText(input:unknown):input is string {
  return typeof input==="string"&&input.trim().length>=1&&input.length<=MAX_WORKBOOK_CHARS;
}
