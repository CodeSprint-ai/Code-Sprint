/** Redact private test data at every client response boundary. */
export function filterHiddenResults<T extends { isHidden?: boolean }>(results: T[]): T[] {
  return results.map((result) => result.isHidden
    ? { ...result, input: {}, expected: null, got: null }
    : result);
}
