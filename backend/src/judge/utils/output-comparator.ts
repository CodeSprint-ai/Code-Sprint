/**
 * Output Comparison Utility
 * 
 * Rules:
 * ✅ Parse stdout as JSON
 * ✅ Deep equality comparison
 * ✅ Ignore whitespace
 * ✅ Order matters unless specified
 */

/**
 * Deep equality comparison for JSON values
 */
export function deepEqual(a: unknown, b: unknown): boolean {
  if (a === b) return true;
  if (typeof a !== typeof b) return false;
  if (a === null || b === null) return a === b;

  if (Array.isArray(a) && Array.isArray(b)) {
    if (a.length !== b.length) return false;
    return a.every((val, idx) => deepEqual(val, b[idx]));
  }

  if (typeof a === 'object' && typeof b === 'object') {
    const aObj = a as Record<string, unknown>;
    const bObj = b as Record<string, unknown>;
    const keysA = Object.keys(aObj);
    const keysB = Object.keys(bObj);

    if (keysA.length !== keysB.length) return false;
    return keysA.every((key) => deepEqual(aObj[key], bObj[key]));
  }

  // Handle number comparison with tolerance for floating point
  if (typeof a === 'number' && typeof b === 'number') {
    if (Number.isNaN(a) && Number.isNaN(b)) return true;
    // Use relative tolerance for floating point comparison
    const tolerance = 1e-9;
    return Math.abs(a - b) < tolerance || Math.abs(a - b) / Math.max(Math.abs(a), Math.abs(b)) < tolerance;
  }

  return false;
}

/**
 * Compare stdout from Judge0 with expected output
 * @param stdout - Raw stdout string from Judge0
 * @param expected - Expected output (any JSON-serializable value)
 * @returns Whether the outputs match
 */
export function compareOutput(stdout: string, expected: unknown): boolean {
  const trimmed = stdout.trim();

  // Handle empty output
  if (!trimmed && expected === null) return true;
  if (!trimmed && expected === undefined) return true;
  if (!trimmed) return false;

  try {
    const actual = JSON.parse(trimmed);
    return deepEqual(actual, expected);
  } catch {
    // If not valid JSON, do string comparison
    const expectedStr = typeof expected === 'string'
      ? expected
      : JSON.stringify(expected);
    return trimmed === expectedStr.trim();
  }
}

/**
 * Unordered comparison for arrays (when order doesn't matter)
 */
export function compareUnorderedArrays(a: unknown[], b: unknown[]): boolean {
  if (a.length !== b.length) return false;

  const bCopy = [...b];
  for (const item of a) {
    const idx = bCopy.findIndex((bItem) => deepEqual(item, bItem));
    if (idx === -1) return false;
    bCopy.splice(idx, 1);
  }

  return true;
}

