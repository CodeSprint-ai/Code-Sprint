/**
 * Advanced Output Comparison Utility
 *
 * Supports all CompareMode values:
 * ✅ EXACT              — Deep structural equality
 * ✅ ORDER_INSENSITIVE  — Top-level array order doesn't matter
 * ✅ SORTED             — Both arrays are sorted before comparison
 * ✅ FLOAT_TOLERANCE    — Numbers compared with configurable tolerance
 * ✅ DEEP_UNORDERED     — Recursive unordered comparison at all nesting levels
 *
 * Supports OutputSerializer values:
 * ✅ NONE               — Standard JSON comparison
 * ✅ LINKED_LIST         — Deserialize as linked list representation
 * ✅ BINARY_TREE         — Deserialize as BFS-order binary tree
 */

import { CompareMode, OutputSerializer } from '../interfaces/execution-config.interface';

// ─── Main Entry Point ──────────────────────────────────────────────

/**
 * Compare stdout from Judge0 with expected output using the specified mode
 *
 * @param stdout - Raw stdout string from Judge0
 * @param expected - Expected output (any JSON-serializable value)
 * @param mode - Comparison mode
 * @param floatTolerance - Tolerance for FLOAT_TOLERANCE mode (default: 1e-6)
 * @param serializer - Output serializer for special data structures
 * @returns Whether the outputs match
 */
export function compareWithMode(
  stdout: string,
  expected: unknown,
  mode: CompareMode = CompareMode.EXACT,
  floatTolerance: number = 1e-6,
  serializer: OutputSerializer = OutputSerializer.NONE,
): boolean {
  const trimmed = stdout.trim();

  // Handle empty output
  if (!trimmed && (expected === null || expected === undefined)) return true;
  if (!trimmed) return false;

  // Check for runner error output
  try {
    const parsed = JSON.parse(trimmed);
    if (parsed && typeof parsed === 'object' && '__error__' in parsed) {
      return false; // Runtime error in runner
    }
  } catch {
    // Not JSON, continue
  }

  let actual: unknown;
  try {
    actual = JSON.parse(trimmed);
  } catch {
    // If not valid JSON, do string comparison
    const expectedStr =
      typeof expected === 'string' ? expected : JSON.stringify(expected);
    return trimmed === expectedStr?.trim();
  }

  // Apply output serializer
  if (serializer !== OutputSerializer.NONE) {
    actual = deserializeOutput(actual, serializer);
    expected = deserializeOutput(expected, serializer);
  }

  // Apply compare mode
  switch (mode) {
    case CompareMode.EXACT:
      return deepEqual(actual, expected);

    case CompareMode.ORDER_INSENSITIVE:
      return orderInsensitiveCompare(actual, expected);

    case CompareMode.SORTED:
      return sortedCompare(actual, expected);

    case CompareMode.FLOAT_TOLERANCE:
      return deepEqualWithTolerance(actual, expected, floatTolerance);

    case CompareMode.DEEP_UNORDERED:
      return deepUnorderedCompare(actual, expected);

    default:
      return deepEqual(actual, expected);
  }
}

// ─── Deep Equality ─────────────────────────────────────────────────

/**
 * Deep structural equality comparison
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

  if (typeof a === 'number' && typeof b === 'number') {
    if (Number.isNaN(a) && Number.isNaN(b)) return true;
    return a === b;
  }

  return false;
}

// ─── Float Tolerance ───────────────────────────────────────────────

/**
 * Deep equality with floating point tolerance for numbers
 */
function deepEqualWithTolerance(
  a: unknown,
  b: unknown,
  tolerance: number,
): boolean {
  if (a === b) return true;
  if (typeof a !== typeof b) return false;
  if (a === null || b === null) return a === b;

  if (typeof a === 'number' && typeof b === 'number') {
    if (Number.isNaN(a) && Number.isNaN(b)) return true;
    if (Math.abs(a) === 0 && Math.abs(b) === 0) return true;
    const absDiff = Math.abs(a - b);
    // Absolute tolerance check
    if (absDiff <= tolerance) return true;
    // Relative tolerance check
    const maxAbs = Math.max(Math.abs(a), Math.abs(b));
    return maxAbs > 0 && absDiff / maxAbs <= tolerance;
  }

  if (Array.isArray(a) && Array.isArray(b)) {
    if (a.length !== b.length) return false;
    return a.every((val, idx) => deepEqualWithTolerance(val, b[idx], tolerance));
  }

  if (typeof a === 'object' && typeof b === 'object') {
    const aObj = a as Record<string, unknown>;
    const bObj = b as Record<string, unknown>;
    const keysA = Object.keys(aObj);
    const keysB = Object.keys(bObj);

    if (keysA.length !== keysB.length) return false;
    return keysA.every((key) =>
      deepEqualWithTolerance(aObj[key], bObj[key], tolerance),
    );
  }

  return deepEqual(a, b);
}

// ─── Order Insensitive (top-level only) ────────────────────────────

/**
 * Top-level array order doesn't matter, nested elements compared exactly
 */
function orderInsensitiveCompare(actual: unknown, expected: unknown): boolean {
  if (!Array.isArray(actual) || !Array.isArray(expected)) {
    return deepEqual(actual, expected);
  }

  if (actual.length !== expected.length) return false;

  const remaining = [...expected];
  for (const item of actual) {
    const idx = remaining.findIndex((r) => deepEqual(item, r));
    if (idx === -1) return false;
    remaining.splice(idx, 1);
  }

  return true;
}

// ─── Sorted Compare ────────────────────────────────────────────────

/**
 * Sort both arrays before comparison
 */
function sortedCompare(actual: unknown, expected: unknown): boolean {
  if (!Array.isArray(actual) || !Array.isArray(expected)) {
    return deepEqual(actual, expected);
  }

  if (actual.length !== expected.length) return false;

  const sortFn = (a: unknown, b: unknown): number => {
    const sa = JSON.stringify(a);
    const sb = JSON.stringify(b);
    return sa < sb ? -1 : sa > sb ? 1 : 0;
  };

  const sortedActual = [...actual].sort(sortFn);
  const sortedExpected = [...expected].sort(sortFn);

  return sortedActual.every((val, idx) => deepEqual(val, sortedExpected[idx]));
}

// ─── Deep Unordered Compare ────────────────────────────────────────

/**
 * Recursive unordered comparison at all nesting levels
 * Arrays at any depth can be in any order
 */
function deepUnorderedCompare(actual: unknown, expected: unknown): boolean {
  if (actual === expected) return true;
  if (typeof actual !== typeof expected) return false;
  if (actual === null || expected === null) return actual === expected;

  if (Array.isArray(actual) && Array.isArray(expected)) {
    if (actual.length !== expected.length) return false;

    const remaining = [...expected];
    for (const item of actual) {
      const idx = remaining.findIndex((r) => deepUnorderedCompare(item, r));
      if (idx === -1) return false;
      remaining.splice(idx, 1);
    }
    return true;
  }

  if (typeof actual === 'object' && typeof expected === 'object') {
    const aObj = actual as Record<string, unknown>;
    const bObj = expected as Record<string, unknown>;
    const keysA = Object.keys(aObj);
    const keysB = Object.keys(bObj);

    if (keysA.length !== keysB.length) return false;
    return keysA.every((key) =>
      deepUnorderedCompare(aObj[key], bObj[key]),
    );
  }

  if (typeof actual === 'number' && typeof expected === 'number') {
    if (Number.isNaN(actual) && Number.isNaN(expected)) return true;
    return actual === expected;
  }

  return actual === expected;
}

// ─── Output Serializers ────────────────────────────────────────────

/**
 * Deserialize output based on serializer type
 */
function deserializeOutput(
  value: unknown,
  serializer: OutputSerializer,
): unknown {
  switch (serializer) {
    case OutputSerializer.LINKED_LIST:
      return normalizeLinkedList(value);
    case OutputSerializer.BINARY_TREE:
      return normalizeBinaryTree(value);
    default:
      return value;
  }
}

/**
 * Normalize linked list representation
 * Both [1,2,3] and {val:1, next:{val:2, next:{val:3, next:null}}}
 * are normalized to [1,2,3]
 */
function normalizeLinkedList(value: unknown): unknown[] {
  if (Array.isArray(value)) return value;
  if (value === null) return [];

  // Handle node-based representation
  const result: unknown[] = [];
  let current = value as Record<string, unknown> | null;
  let maxIter = 10000; // Safety limit
  while (current && maxIter-- > 0) {
    result.push(current.val ?? current.value);
    current = (current.next as Record<string, unknown> | null) ?? null;
  }
  return result;
}

/**
 * Normalize binary tree representation
 * Both BFS-order array [1,2,3,null,null,4,5] and nested node objects
 * are normalized to the BFS-order array
 */
function normalizeBinaryTree(value: unknown): unknown[] {
  if (Array.isArray(value)) return value;
  if (value === null) return [];

  // Handle node-based representation → convert to BFS array
  const result: unknown[] = [];
  const queue: (Record<string, unknown> | null)[] = [
    value as Record<string, unknown>,
  ];

  while (queue.length > 0) {
    const node = queue.shift()!;
    if (node === null || node === undefined) {
      result.push(null);
      continue;
    }
    result.push(node.val ?? node.value);
    queue.push(
      (node.left as Record<string, unknown> | null) ?? null,
    );
    queue.push(
      (node.right as Record<string, unknown> | null) ?? null,
    );
  }

  // Trim trailing nulls
  while (result.length > 0 && result[result.length - 1] === null) {
    result.pop();
  }

  return result;
}
