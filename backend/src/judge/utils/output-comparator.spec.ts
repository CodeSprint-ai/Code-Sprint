import {
    compareWithMode,
    deepEqual,
} from './output-comparator';
import { CompareMode, OutputSerializer } from '../interfaces/execution-config.interface';

describe('Output Comparator', () => {
    // ─── EXACT Mode ──────────────────────────────────────────────
    describe('EXACT mode', () => {
        it('should match identical primitives', () => {
            expect(compareWithMode('42', 42, CompareMode.EXACT)).toBe(true);
            expect(compareWithMode('"hello"', 'hello', CompareMode.EXACT)).toBe(true);
            expect(compareWithMode('true', true, CompareMode.EXACT)).toBe(true);
            expect(compareWithMode('null', null, CompareMode.EXACT)).toBe(true);
        });

        it('should match identical arrays', () => {
            expect(compareWithMode('[0,1]', [0, 1], CompareMode.EXACT)).toBe(true);
        });

        it('should reject different values', () => {
            expect(compareWithMode('[1,0]', [0, 1], CompareMode.EXACT)).toBe(false);
            expect(compareWithMode('42', 43, CompareMode.EXACT)).toBe(false);
        });

        it('should handle nested objects', () => {
            expect(
                compareWithMode('{"a":1,"b":[2,3]}', { a: 1, b: [2, 3] }, CompareMode.EXACT),
            ).toBe(true);
        });

        it('should handle whitespace in stdout', () => {
            expect(compareWithMode('  [0,1]  \n', [0, 1], CompareMode.EXACT)).toBe(true);
        });

        it('should handle empty output with null expected', () => {
            expect(compareWithMode('', null, CompareMode.EXACT)).toBe(true);
            expect(compareWithMode('  ', null, CompareMode.EXACT)).toBe(true);
        });

        it('should reject __error__ output', () => {
            expect(
                compareWithMode('{"__error__":"runtime error"}', [0, 1], CompareMode.EXACT),
            ).toBe(false);
        });
    });

    // ─── ORDER_INSENSITIVE Mode ──────────────────────────────────
    describe('ORDER_INSENSITIVE mode', () => {
        it('should match arrays regardless of order', () => {
            expect(
                compareWithMode('[1,0]', [0, 1], CompareMode.ORDER_INSENSITIVE),
            ).toBe(true);
        });

        it('should match identical arrays', () => {
            expect(
                compareWithMode('[0,1]', [0, 1], CompareMode.ORDER_INSENSITIVE),
            ).toBe(true);
        });

        it('should reject different arrays', () => {
            expect(
                compareWithMode('[0,1,2]', [0, 1], CompareMode.ORDER_INSENSITIVE),
            ).toBe(false);
        });

        it('should match nested arrays (top-level order insensitive)', () => {
            expect(
                compareWithMode('[[1,2],[3,4]]', [[3, 4], [1, 2]], CompareMode.ORDER_INSENSITIVE),
            ).toBe(true);
        });

        it('should fall back to exact for non-arrays', () => {
            expect(
                compareWithMode('42', 42, CompareMode.ORDER_INSENSITIVE),
            ).toBe(true);
        });
    });

    // ─── SORTED Mode ─────────────────────────────────────────────
    describe('SORTED mode', () => {
        it('should match arrays after sorting', () => {
            expect(compareWithMode('[3,1,2]', [1, 2, 3], CompareMode.SORTED)).toBe(true);
            expect(compareWithMode('[1,2,3]', [3, 2, 1], CompareMode.SORTED)).toBe(true);
        });

        it('should reject arrays with different elements', () => {
            expect(compareWithMode('[1,2,4]', [1, 2, 3], CompareMode.SORTED)).toBe(false);
        });
    });

    // ─── FLOAT_TOLERANCE Mode ────────────────────────────────────
    describe('FLOAT_TOLERANCE mode', () => {
        it('should match numbers within tolerance', () => {
            expect(
                compareWithMode('3.14159', 3.14159000001, CompareMode.FLOAT_TOLERANCE, 1e-6),
            ).toBe(true);
        });

        it('should reject numbers outside tolerance', () => {
            expect(
                compareWithMode('3.14', 3.15, CompareMode.FLOAT_TOLERANCE, 1e-6),
            ).toBe(false);
        });

        it('should match arrays with float tolerance', () => {
            expect(
                compareWithMode(
                    '[1.000001, 2.000002]',
                    [1.0, 2.0],
                    CompareMode.FLOAT_TOLERANCE,
                    1e-4,
                ),
            ).toBe(true);
        });

        it('should handle zero values', () => {
            expect(
                compareWithMode('0', 0, CompareMode.FLOAT_TOLERANCE, 1e-6),
            ).toBe(true);
        });
    });

    // ─── DEEP_UNORDERED Mode ─────────────────────────────────────
    describe('DEEP_UNORDERED mode', () => {
        it('should match deeply unordered arrays', () => {
            expect(
                compareWithMode(
                    '[[2,1],[4,3]]',
                    [[1, 2], [3, 4]],
                    CompareMode.DEEP_UNORDERED,
                ),
            ).toBe(true);
        });

        it('should match deeply unordered nested structures', () => {
            expect(
                compareWithMode(
                    '[[4,3],[2,1]]',
                    [[1, 2], [3, 4]],
                    CompareMode.DEEP_UNORDERED,
                ),
            ).toBe(true);
        });

        it('should reject different structures', () => {
            expect(
                compareWithMode(
                    '[[1,2],[3,5]]',
                    [[1, 2], [3, 4]],
                    CompareMode.DEEP_UNORDERED,
                ),
            ).toBe(false);
        });
    });

    // ─── LINKED_LIST Serializer ──────────────────────────────────
    describe('LINKED_LIST serializer', () => {
        it('should compare linked list arrays', () => {
            expect(
                compareWithMode(
                    '[1,2,3]',
                    [1, 2, 3],
                    CompareMode.EXACT,
                    1e-6,
                    OutputSerializer.LINKED_LIST,
                ),
            ).toBe(true);
        });

        it('should handle empty linked list', () => {
            expect(
                compareWithMode(
                    '[]',
                    [],
                    CompareMode.EXACT,
                    1e-6,
                    OutputSerializer.LINKED_LIST,
                ),
            ).toBe(true);
        });
    });

    // ─── BINARY_TREE Serializer ──────────────────────────────────
    describe('BINARY_TREE serializer', () => {
        it('should compare binary tree arrays', () => {
            expect(
                compareWithMode(
                    '[1,2,3]',
                    [1, 2, 3],
                    CompareMode.EXACT,
                    1e-6,
                    OutputSerializer.BINARY_TREE,
                ),
            ).toBe(true);
        });

        it('should compare with nulls', () => {
            expect(
                compareWithMode(
                    '[1,null,2,3]',
                    [1, null, 2, 3],
                    CompareMode.EXACT,
                    1e-6,
                    OutputSerializer.BINARY_TREE,
                ),
            ).toBe(true);
        });
    });

    // ─── deepEqual ───────────────────────────────────────────────
    describe('deepEqual', () => {
        it('should handle NaN', () => {
            expect(deepEqual(NaN, NaN)).toBe(true);
        });

        it('should handle booleans', () => {
            expect(deepEqual(true, true)).toBe(true);
            expect(deepEqual(true, false)).toBe(false);
        });

        it('should handle null vs undefined', () => {
            expect(deepEqual(null, undefined)).toBe(false);
            expect(deepEqual(null, null)).toBe(true);
        });

        it('should handle deeply nested objects', () => {
            expect(
                deepEqual(
                    { a: { b: { c: [1, 2, 3] } } },
                    { a: { b: { c: [1, 2, 3] } } },
                ),
            ).toBe(true);
        });
    });
});
