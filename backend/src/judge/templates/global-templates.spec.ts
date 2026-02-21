import { getPythonTemplate, getJavaTemplate, getCppTemplate } from './global-templates';

describe('Global Templates', () => {
    // ─── Python Template ─────────────────────────────────────────
    describe('Python template', () => {
        it('should contain {{USER_CODE}} placeholder', () => {
            const template = getPythonTemplate();
            expect(template).toContain('{{USER_CODE}}');
        });

        it('should contain normalizer', () => {
            const template = getPythonTemplate();
            expect(template).toContain('def normalize');
        });

        it('should contain comparator with all modes', () => {
            const template = getPythonTemplate();
            expect(template).toContain('EXACT');
            expect(template).toContain('ORDER_INSENSITIVE');
            expect(template).toContain('SORTED');
            expect(template).toContain('FLOAT_TOLERANCE');
            expect(template).toContain('DEEP_UNORDERED');
        });

        it('should contain serializers', () => {
            const template = getPythonTemplate();
            expect(template).toContain('serialize_linked_list');
            expect(template).toContain('LINKED_LIST');
        });

        it('should read executionConfig and tests from payload', () => {
            const template = getPythonTemplate();
            expect(template).toContain('executionConfig');
            expect(template).toContain('payload["tests"]');
        });

        it('should output JSON results array', () => {
            const template = getPythonTemplate();
            expect(template).toContain('json.dumps(results)');
        });

        it('should handle errors safely', () => {
            const template = getPythonTemplate();
            expect(template).toContain('traceback');
            expect(template).toContain('except Exception');
        });

        it('should inject user code correctly', () => {
            const template = getPythonTemplate();
            const code = 'class Solution:\n    def twoSum(self, nums, target):\n        return [0,1]';
            const result = template.replace('{{USER_CODE}}', code);
            expect(result).toContain(code);
            expect(result).not.toContain('{{USER_CODE}}');
        });
    });

    // ─── Java Template ───────────────────────────────────────────
    describe('Java template', () => {
        it('should contain {{USER_CODE}} placeholder', () => {
            const template = getJavaTemplate();
            expect(template).toContain('{{USER_CODE}}');
        });

        it('should contain Main class', () => {
            const template = getJavaTemplate();
            expect(template).toContain('public class Main');
        });

        it('should contain compare function', () => {
            const template = getJavaTemplate();
            expect(template).toContain('static boolean compare');
            expect(template).toContain('EXACT');
            expect(template).toContain('ORDER_INSENSITIVE');
        });

        it('should read payload from stdin', () => {
            const template = getJavaTemplate();
            expect(template).toContain('System.in.readAllBytes');
            expect(template).toContain('executionConfig');
        });

        it('should use reflection for method invocation', () => {
            const template = getJavaTemplate();
            expect(template).toContain('getMethod');
            expect(template).toContain('invoke');
        });
    });

    // ─── C++ Template ────────────────────────────────────────────
    describe('C++ template', () => {
        it('should contain {{USER_CODE}} placeholder', () => {
            const template = getCppTemplate();
            expect(template).toContain('{{USER_CODE}}');
        });

        it('should include nlohmann/json', () => {
            const template = getCppTemplate();
            expect(template).toContain('nlohmann/json.hpp');
        });

        it('should contain compare function', () => {
            const template = getCppTemplate();
            expect(template).toContain('bool compare');
            expect(template).toContain('EXACT');
            expect(template).toContain('ORDER_INSENSITIVE');
        });

        it('should read payload from stdin', () => {
            const template = getCppTemplate();
            expect(template).toContain('istreambuf_iterator');
            expect(template).toContain('executionConfig');
        });

        it('should measure duration with chrono', () => {
            const template = getCppTemplate();
            expect(template).toContain('chrono::steady_clock');
            expect(template).toContain('durationMs');
        });
    });
});
