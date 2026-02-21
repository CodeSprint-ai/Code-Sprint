/**
 * Execution Configuration for Judge System
 *
 * Each problem stores an ExecutionConfig that tells the global runner
 * HOW to execute the user's code — class name, method name, comparison mode, etc.
 *
 * ❌ Problems do NOT store runner templates
 * ✅ Global runners generate code from this config
 */

// ─── Execution Types ──────────────────────────────────────────────

/**
 * The type of problem execution
 *
 * FUNCTION       — User writes a method inside a class (e.g. Solution.twoSum)
 * STDIN_STDOUT   — User reads from stdin, writes to stdout directly
 * CLASS_DESIGN   — User designs a full class with multiple methods (e.g. LRUCache)
 */
export enum ExecutionType {
    FUNCTION = 'FUNCTION',
    STDIN_STDOUT = 'STDIN_STDOUT',
    CLASS_DESIGN = 'CLASS_DESIGN',
}

// ─── Compare Modes ────────────────────────────────────────────────

/**
 * How to compare actual output vs expected output
 *
 * EXACT              — Deep structural equality (default)
 * ORDER_INSENSITIVE  — Top-level array elements can be in any order
 * SORTED             — Both arrays are sorted before comparison
 * FLOAT_TOLERANCE    — Numbers compared with configurable tolerance (floatTolerance)
 * DEEP_UNORDERED     — Recursive unordered comparison at all nesting levels
 */
export enum CompareMode {
    EXACT = 'EXACT',
    ORDER_INSENSITIVE = 'ORDER_INSENSITIVE',
    SORTED = 'SORTED',
    FLOAT_TOLERANCE = 'FLOAT_TOLERANCE',
    DEEP_UNORDERED = 'DEEP_UNORDERED',
}

// ─── Output Serializers ────────────────────────────────────────────

/**
 * Special output serializers for data structure problems
 *
 * NONE         — Output is a primitive or standard JSON (array, object, string, number)
 * LINKED_LIST  — Output is serialized as array representing a linked list [1,2,3]
 * BINARY_TREE  — Output is serialized as BFS-order array [1,2,3,null,null,4,5]
 */
export enum OutputSerializer {
    NONE = 'NONE',
    LINKED_LIST = 'LINKED_LIST',
    BINARY_TREE = 'BINARY_TREE',
}

// ─── Execution Config ──────────────────────────────────────────────

/**
 * Per-problem execution configuration
 *
 * This is the ONLY thing a problem stores to drive the judge system.
 * The global runner templates use this config to generate executable code.
 *
 * @example Two Sum problem:
 * {
 *   type: ExecutionType.FUNCTION,
 *   className: 'Solution',
 *   methodName: 'twoSum',
 *   compareMode: CompareMode.ORDER_INSENSITIVE,
 *   floatTolerance: 1e-6,
 *   outputSerializer: OutputSerializer.NONE,
 * }
 *
 * @example LRU Cache problem:
 * {
 *   type: ExecutionType.CLASS_DESIGN,
 *   className: 'LRUCache',
 *   methodName: '',          // not used for CLASS_DESIGN
 *   compareMode: CompareMode.EXACT,
 *   outputSerializer: OutputSerializer.NONE,
 * }
 *
 * @example Raw I/O problem:
 * {
 *   type: ExecutionType.STDIN_STDOUT,
 *   className: '',           // not used for STDIN_STDOUT
 *   methodName: '',          // not used for STDIN_STDOUT
 *   compareMode: CompareMode.EXACT,
 *   outputSerializer: OutputSerializer.NONE,
 * }
 */
export interface ExecutionConfig {
    type: ExecutionType;
    className: string;
    methodName: string;
    compareMode: CompareMode;
    floatTolerance?: number;
    outputSerializer: OutputSerializer;
}
