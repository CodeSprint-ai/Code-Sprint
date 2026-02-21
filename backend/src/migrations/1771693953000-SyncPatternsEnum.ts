import { MigrationInterface, QueryRunner } from "typeorm";

export class SyncPatternsEnum1771693953000 implements MigrationInterface {
    name = 'SyncPatternsEnum1771693953000'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TYPE "public"."problems_patterns_enum" RENAME TO "problems_patterns_enum_old"`);
        await queryRunner.query(`CREATE TYPE "public"."problems_patterns_enum" AS ENUM('ARRAY', 'HASH_TABLE', 'SLIDING_WINDOW', 'TWO_POINTERS', 'FAST_AND_SLOW_POINTERS', 'MERGE_INTERVALS', 'CYCLIC_SORT', 'INPLACE_REVERSAL_OF_LINKED_LIST', 'TREE_BFS', 'TREE_DFS', 'TWO_HEAPS', 'SUBSETS', 'MODIFIED_BINARY_SEARCH', 'TOP_K_ELEMENTS', 'K_WAY_MERGE', 'TOPOLOGICAL_SORT', 'BITWISE_XOR', 'DYNAMIC_PROGRAMMING', 'BACKTRACKING', 'GRAPH', 'GREEDY', 'STACK', 'QUEUE', 'BINARY_SEARCH', 'LINKED_LIST', 'KADANE_ALGORITHM', 'STRING', 'MATRIX', 'INPLACE', 'RECURSION', 'TRIE', 'HEAPS', 'MONOTONIC_STACK', 'MONOTONIC_QUEUE', 'FIBONACCI', 'HASH_MAP', 'HEAP', 'DFS', 'BFS', 'DP', 'HASHING', 'SORTING', 'STRING_SEARCH', 'KMP')`);
        await queryRunner.query(`ALTER TABLE "problems" ALTER COLUMN "patterns" DROP DEFAULT`);
        await queryRunner.query(`ALTER TABLE "problems" ALTER COLUMN "patterns" TYPE "public"."problems_patterns_enum"[] USING "patterns"::"text"::"public"."problems_patterns_enum"[]`);
        await queryRunner.query(`ALTER TABLE "problems" ALTER COLUMN "patterns" SET DEFAULT '{}'`);
        await queryRunner.query(`DROP TYPE "public"."problems_patterns_enum_old"`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TYPE "public"."problems_patterns_enum" RENAME TO "problems_patterns_enum_old"`);
        await queryRunner.query(`CREATE TYPE "public"."problems_patterns_enum" AS ENUM('ARRAY', 'HASH_TABLE', 'SLIDING_WINDOW', 'TWO_POINTERS', 'FAST_AND_SLOW_POINTERS', 'MERGE_INTERVALS', 'CYCLIC_SORT', 'INPLACE_REVERSAL_OF_LINKED_LIST', 'TREE_BFS', 'TREE_DFS', 'TWO_HEAPS', 'SUBSETS', 'MODIFIED_BINARY_SEARCH', 'TOP_K_ELEMENTS', 'K_WAY_MERGE', 'TOPOLOGICAL_SORT', 'BITWISE_XOR', 'DYNAMIC_PROGRAMMING', 'BACKTRACKING', 'GRAPH', 'GREEDY', 'STACK', 'QUEUE', 'BINARY_SEARCH', 'LINKED_LIST', 'KADANE_ALGORITHM', 'STRING', 'MATRIX', 'INPLACE', 'RECURSION', 'TRIE', 'HEAPS', 'MONOTONIC_STACK', 'MONOTONIC_QUEUE', 'FIBONACCI', 'HASH_MAP', 'HEAP', 'DFS', 'BFS', 'DP')`);
        await queryRunner.query(`ALTER TABLE "problems" ALTER COLUMN "patterns" DROP DEFAULT`);
        await queryRunner.query(`ALTER TABLE "problems" ALTER COLUMN "patterns" TYPE "public"."problems_patterns_enum"[] USING "patterns"::"text"::"public"."problems_patterns_enum"[]`);
        await queryRunner.query(`ALTER TABLE "problems" ALTER COLUMN "patterns" SET DEFAULT '{}'`);
        await queryRunner.query(`DROP TYPE "public"."problems_patterns_enum_old"`);
    }

}
