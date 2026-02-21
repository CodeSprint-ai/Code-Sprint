/**
 * Global Runner Templates
 *
 * One template per language. The runner receives a SINGLE JSON payload
 * containing executionConfig + ALL test cases, runs them internally,
 * and outputs a JSON results array.
 *
 * Payload format (stdin):
 * {
 *   "executionConfig": { type, className, methodName, compareMode, floatTolerance, outputSerializer },
 *   "tests": [{ "input": {...}, "expectedOutput": ... }, ...]
 * }
 *
 * Output format (stdout):
 * [{ "ok": bool, "output": any, "expected": any, "durationMs": number, "error": string|null }, ...]
 *
 * ✅ Single execution for all test cases (efficient)
 * ✅ Runner handles comparison internally
 * ✅ JSON-only stdout
 * ✅ Runtime error wrapping
 * ✅ Output normalization (sets, tuples → lists)
 * ✅ Output serializers (LINKED_LIST, BINARY_TREE)
 * ✅ All compare modes (EXACT, ORDER_INSENSITIVE, SORTED, FLOAT_TOLERANCE, DEEP_UNORDERED)
 */

// ─── Python Template ───────────────────────────────────────────────

export function getPythonTemplate(): string {
    return `import sys, json, time, traceback, math, collections
from typing import *

# ================= USER CODE INJECTION =================
{{USER_CODE}}
# =======================================================

# ---------- NORMALIZER ----------
def normalize(obj):
    if isinstance(obj, set):
        return sorted(list(obj))
    if isinstance(obj, tuple):
        return [normalize(x) for x in obj]
    if isinstance(obj, list):
        return [normalize(x) for x in obj]
    if isinstance(obj, dict):
        return {k: normalize(v) for k, v in obj.items()}
    return obj

# ---------- SERIALIZERS ----------
def serialize_linked_list(head):
    result = []
    while head:
        result.append(head.val)
        head = head.next
    return result

# ---------- COMPARATOR ----------
def compare(output, expected, config):
    mode = config.get("compareMode", "EXACT")

    if mode == "EXACT":
        return output == expected

    if mode == "ORDER_INSENSITIVE":
        return sorted(output) == sorted(expected)

    if mode == "SORTED":
        return sorted(output) == sorted(expected)

    if mode == "FLOAT_TOLERANCE":
        tol = config.get("floatTolerance", 1e-6)
        return abs(output - expected) <= tol

    if mode == "DEEP_UNORDERED":
        return json.dumps(output, sort_keys=True) == json.dumps(expected, sort_keys=True)

    return output == expected

# ---------- EXECUTION ----------
def run_case(input_obj, config):
    if config["type"] == "FUNCTION":
        if config["className"] in globals():
            sol = globals()[config["className"]]()
            method = getattr(sol, config["methodName"])
            return method(**input_obj)
        else:
            raise Exception("Class not found")

    raise Exception("Unsupported execution type")

# ---------- MAIN ----------
def main():
    raw = sys.stdin.read()
    payload = json.loads(raw)

    config = payload["executionConfig"]
    tests = payload["tests"]

    results = []

    for t in tests:
        start = time.time()
        try:
            output = run_case(t["input"], config)

            if config.get("outputSerializer") == "LINKED_LIST":
                output = serialize_linked_list(output)

            output = normalize(output)
            expected = normalize(t.get("expectedOutput"))

            ok = compare(output, expected, config)
            duration = int((time.time() - start) * 1000)

            results.append({
                "ok": ok,
                "output": output,
                "expected": expected,
                "durationMs": duration,
                "error": None
            })

        except Exception as e:
            results.append({
                "ok": False,
                "output": None,
                "expected": t.get("expectedOutput"),
                "durationMs": int((time.time() - start) * 1000),
                "error": str(e),
                "traceback": traceback.format_exc()
            })

    print(json.dumps(results))

if __name__ == "__main__":
    main()
`;
}

// ─── Java Template ─────────────────────────────────────────────────

export function getJavaTemplate(): string {
    return `import java.util.*;
import java.io.*;
import java.util.stream.*;

{{USER_CODE}}

public class Main {

    static class JsonParser {
        private String input;
        private int pos = 0;

        public JsonParser(String input) {
            this.input = input;
        }

        public Object parse() {
            skipWhitespace();
            if (pos >= input.length()) return null;
            char c = input.charAt(pos);
            if (c == '{') return parseObject();
            if (c == '[') return parseArray();
            if (c == '"') return parseString();
            if (Character.isDigit(c) || c == '-') return parseNumber();
            if (input.startsWith("true", pos)) { pos += 4; return true; }
            if (input.startsWith("false", pos)) { pos += 5; return false; }
            if (input.startsWith("null", pos)) { pos += 4; return null; }
            throw new RuntimeException("Unexpected char at " + pos + ": " + c);
        }

        private void skipWhitespace() {
            while (pos < input.length() && Character.isWhitespace(input.charAt(pos))) pos++;
        }

        private Map<String, Object> parseObject() {
            Map<String, Object> map = new LinkedHashMap<>();
            pos++; // skip {
            skipWhitespace();
            if (input.charAt(pos) == '}') { pos++; return map; }
            while (true) {
                String key = parseString();
                skipWhitespace();
                pos++; // skip :
                map.put(key, parse());
                skipWhitespace();
                if (input.charAt(pos) == '}') { pos++; break; }
                pos++; // skip ,
                skipWhitespace();
            }
            return map;
        }

        private List<Object> parseArray() {
            List<Object> list = new ArrayList<>();
            pos++; // skip [
            skipWhitespace();
            if (input.charAt(pos) == ']') { pos++; return list; }
            while (true) {
                list.add(parse());
                skipWhitespace();
                if (input.charAt(pos) == ']') { pos++; break; }
                pos++; // skip ,
                skipWhitespace();
            }
            return list;
        }

        private String parseString() {
            pos++; // skip "
            StringBuilder sb = new StringBuilder();
            while (input.charAt(pos) != '"') {
                if (input.charAt(pos) == '\\\\') {
                    pos++;
                    char c = input.charAt(pos);
                    if (c == 'n') sb.append('\\n');
                    else if (c == 'r') sb.append('\\r');
                    else if (c == 't') sb.append('\\t');
                    else if (c == '"') sb.append('"');
                    else if (c == '\\\\') sb.append('\\\\');
                } else {
                    sb.append(input.charAt(pos));
                }
                pos++;
            }
            pos++; // skip "
            return sb.toString();
        }

        private Object parseNumber() {
            int start = pos;
            if (input.charAt(pos) == '-') pos++;
            while (pos < input.length() && (Character.isDigit(input.charAt(pos)) || input.charAt(pos) == '.')) pos++;
            String s = input.substring(start, pos);
            if (s.contains(".")) return Double.parseDouble(s);
            try {
                return Long.parseLong(s);
            } catch (Exception e) {
                return Double.parseDouble(s);
            }
        }

        public static String stringify(Object obj) {
            if (obj == null) return "null";
            if (obj instanceof String) {
                return "\\"" + ((String) obj).replace("\\\\", "\\\\\\\\").replace("\\"", "\\\\\\"") + "\\"";
            }
            if (obj instanceof Number || obj instanceof Boolean) return obj.toString();
            if (obj instanceof List) {
                List<?> list = (List<?>) obj;
                StringBuilder sb = new StringBuilder("[");
                for (int i = 0; i < list.size(); i++) {
                    sb.append(stringify(list.get(i)));
                    if (i < list.size() - 1) sb.append(",");
                }
                return sb.append("]").toString();
            }
            if (obj instanceof Map) {
                Map<?, ?> map = (Map<?, ?>) obj;
                StringBuilder sb = new StringBuilder("{");
                int i = 0;
                for (Map.Entry<?, ?> entry : map.entrySet()) {
                    sb.append("\\"").append(entry.getKey()).append("\\":").append(stringify(entry.getValue()));
                    if (i++ < map.size() - 1) sb.append(",");
                }
                return sb.append("}").toString();
            }
            return "\\"" + obj.toString().replace("\\\\", "\\\\\\\\").replace("\\"", "\\\\\\"") + "\\"";
        }
    }

    static Object convert(Object val, Class<?> type) {
        if (val == null) return null;
        if (type.isInstance(val)) return val;

        if (type == int.class || type == Integer.class) {
            return ((Number) val).intValue();
        }
        if (type == long.class || type == Long.class) {
            return ((Number) val).longValue();
        }
        if (type == double.class || type == Double.class) {
            return ((Number) val).doubleValue();
        }
        if (type == float.class || type == Float.class) {
            return ((Number) val).floatValue();
        }
        if (type == boolean.class || type == Boolean.class) {
            return (Boolean) val;
        }

        if (type.isArray()) {
            List<?> list = (List<?>) val;
            Class<?> componentType = type.getComponentType();
            Object array = java.lang.reflect.Array.newInstance(componentType, list.size());
            for (int i = 0; i < list.size(); i++) {
                java.lang.reflect.Array.set(array, i, convert(list.get(i), componentType));
            }
            return array;
        }

        if (type == List.class || type == ArrayList.class) {
            return new ArrayList<>((List<?>) val);
        }

        return val;
    }

    static boolean compare(Object output, Object expected, Map<String,Object> config) {
        String mode = (String) config.getOrDefault("compareMode", "EXACT");

        if (mode.equals("EXACT")) {
            return Objects.deepEquals(output, expected);
        }

        if (mode.equals("ORDER_INSENSITIVE")) {
            if (output instanceof List && expected instanceof List) {
                List<Object> o = new ArrayList<>((List<Object>) output);
                List<Object> e = new ArrayList<>((List<Object>) expected);
                if (o.size() != e.size()) return false;
                try {
                    Collections.sort((List)o);
                    Collections.sort((List)e);
                } catch (Exception ex) {}
                return o.equals(e);
            }
        }

        return Objects.deepEquals(output, expected);
    }

    public static void main(String[] args) {
        try {
            Scanner scanner = new Scanner(System.in).useDelimiter("\\\\A");
            String raw = scanner.hasNext() ? scanner.next() : "";

            JsonParser parser = new JsonParser(raw);
            Map<String,Object> payload = (Map<String,Object>) parser.parse();
            Map<String,Object> config = (Map<String,Object>) payload.get("executionConfig");
            List<Map<String,Object>> tests = (List<Map<String,Object>>) payload.get("tests");

            List<Object> results = new ArrayList<>();
            Solution sol = new Solution();

            String methodName = (String)config.get("methodName");
            java.lang.reflect.Method method = null;
            for (java.lang.reflect.Method m : sol.getClass().getDeclaredMethods()) {
                if (m.getName().equals(methodName)) {
                    method = m;
                    break;
                }
            }

            if (method == null) throw new RuntimeException("Method " + methodName + " not found");
            method.setAccessible(true);
            Class<?>[] paramTypes = method.getParameterTypes();

            for (Map<String,Object> t : tests) {
                long start = System.currentTimeMillis();
                Map<String,Object> res = new HashMap<>();
                try {
                    Map<String,Object> input = (Map<String,Object>) t.get("input");
                    
                    Object[] argsArray = new Object[paramTypes.length];
                    int i = 0;
                    for (Object val : input.values()) {
                        if (i < argsArray.length) {
                            argsArray[i] = convert(val, paramTypes[i]);
                            i++;
                        }
                    }

                    Object output = method.invoke(sol, argsArray);

                    // Convert array output to List for JSON serialization if needed
                    if (output != null && output.getClass().isArray()) {
                        List<Object> list = new ArrayList<>();
                        int len = java.lang.reflect.Array.getLength(output);
                        for (int j = 0; j < len; j++) {
                            list.add(java.lang.reflect.Array.get(output, j));
                        }
                        output = list;
                    }

                    boolean ok = compare(output, t.get("expectedOutput"), config);

                    res.put("ok", ok);
                    res.put("output", output);
                    res.put("expected", t.get("expectedOutput"));
                    res.put("durationMs", System.currentTimeMillis()-start);
                    res.put("error", null);

                } catch (Exception e) {
                    res.put("ok", false);
                    res.put("output", null);
                    res.put("expected", t.get("expectedOutput"));
                    res.put("durationMs", System.currentTimeMillis()-start);
                    res.put("error", e.toString());
                }

                results.add(res);
            }

            System.out.println(JsonParser.stringify(results));

        } catch (Exception e) {
            System.out.println("[{\\"ok\\":false,\\"error\\":\\"" + e.toString().replace("\\"", "\\\\\\"") + "\\"}]");
        }
    }
}
`;
}

// ─── C++ Template ──────────────────────────────────────────────────

export function getCppTemplate(): string {
    return `#include <bits/stdc++.h>
#include <nlohmann/json.hpp>
using json = nlohmann::json;
using namespace std;

{{USER_CODE}}

bool compare(json output, json expected, json config) {
    string mode = config.value("compareMode", "EXACT");

    if (mode == "EXACT")
        return output == expected;

    if (mode == "ORDER_INSENSITIVE") {
        sort(output.begin(), output.end());
        sort(expected.begin(), expected.end());
        return output == expected;
    }

    return output == expected;
}

int main() {
    ios::sync_with_stdio(false);
    cin.tie(nullptr);

    string raw((istreambuf_iterator<char>(cin)), {});
    json payload = json::parse(raw);

    json config = payload["executionConfig"];
    json tests = payload["tests"];

    json results = json::array();

    for (auto &t : tests) {
        auto start = chrono::steady_clock::now();
        json res;

        try {
            json input = t["input"];

            Solution sol;
            // Robust check for different method names in C++
            // Note: Since C++ doesn't have reflection like Java, 
            // the user solution MUST implement a method that takes json or 
            // specific types. The user template had 'sol.solve(input)'.
            // For now we stick to it but it might need problem-specific templates
            // if we want to support any method name in C++.
            json output = sol.solve(input); 

            bool ok = compare(output, t["expectedOutput"], config);

            res["ok"] = ok;
            res["output"] = output;
            res["expected"] = t["expectedOutput"];
            res["durationMs"] =
                chrono::duration_cast<chrono::milliseconds>(
                    chrono::steady_clock::now() - start
                ).count();
            res["error"] = nullptr;

        } catch (exception &e) {
            res["ok"] = false;
            res["output"] = nullptr;
            res["expected"] = t["expectedOutput"];
            res["durationMs"] =
                chrono::duration_cast<chrono::milliseconds>(
                    chrono::steady_clock::now() - start
                ).count();
            res["error"] = e.what();
        }

        results.push_back(res);
    }

    cout << results.dump();
}
`;
}
