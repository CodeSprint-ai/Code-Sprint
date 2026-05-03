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
    return `from __future__ import annotations
import sys, json, time, traceback, math, collections
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

    static boolean robustCompare(Object a, Object b) {
        if (a == b) return true;
        if (a == null || b == null) return false;

        if (a instanceof Number && b instanceof Number) {
            Number na = (Number) a;
            Number nb = (Number) b;
            if (na instanceof Double || na instanceof Float || nb instanceof Double || nb instanceof Float) {
                return Math.abs(na.doubleValue() - nb.doubleValue()) < 1e-9;
            }
            return na.longValue() == nb.longValue();
        }

        if (a instanceof List && b instanceof List) {
            List<?> la = (List<?>) a;
            List<?> lb = (List<?>) b;
            if (la.size() != lb.size()) return false;
            for (int i = 0; i < la.size(); i++) {
                if (!robustCompare(la.get(i), lb.get(i))) return false;
            }
            return true;
        }

        if (a instanceof Map && b instanceof Map) {
            Map<?, ?> ma = (Map<?, ?>) a;
            Map<?, ?> mb = (Map<?, ?>) b;
            if (ma.size() != mb.size()) return false;
            for (Map.Entry<?, ?> entry : ma.entrySet()) {
                if (!mb.containsKey(entry.getKey())) return false;
                if (!robustCompare(entry.getValue(), mb.get(entry.getKey()))) return false;
            }
            return true;
        }

        return a.equals(b);
    }

    static boolean orderInsensitiveCompare(List<?> a, List<?> b) {
        if (a.size() != b.size()) return false;
        List<Object> remaining = new ArrayList<>(b);
        for (Object item : a) {
            int foundIdx = -1;
            for (int i = 0; i < remaining.size(); i++) {
                if (robustCompare(item, remaining.get(i))) {
                    foundIdx = i;
                    break;
                }
            }
            if (foundIdx == -1) return false;
            remaining.remove(foundIdx);
        }
        return true;
    }

    static boolean compare(Object output, Object expected, Map<String,Object> config) {
        String mode = (String) config.getOrDefault("compareMode", "EXACT");

        if (mode.equals("ORDER_INSENSITIVE")) {
            if (output instanceof List && expected instanceof List) {
                return orderInsensitiveCompare((List<?>) output, (List<?>) expected);
            }
        }

        return robustCompare(output, expected);
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
    return `#include <iostream>
#include <string>
#include <vector>
#include <map>
#include <unordered_map>
#include <unordered_set>
#include <set>
#include <queue>
#include <stack>
#include <deque>
#include <sstream>
#include <iomanip>
#include <algorithm>
#include <chrono>
#include <cmath>
#include <climits>
#include <numeric>
#include <functional>
#include <utility>
#include <tuple>
#include <type_traits>

using namespace std;

// ─── Minimal JSON Implementation (Zero Dependency, Optimized) ──────

class json {
public:
    enum Type { NULL_T, BOOL_T, NUMBER_T, STRING_T, ARRAY_T, OBJECT_T };
    Type type;
    bool b_val;
    double n_val;
    string s_val;
    vector<json> a_val;
    map<string, json> o_val;

    json() : type(NULL_T) {}
    json(bool b) : type(BOOL_T), b_val(b) {}
    json(double n) : type(NUMBER_T), n_val(n) {}
    json(int n) : type(NUMBER_T), n_val(double(n)) {}
    json(long long n) : type(NUMBER_T), n_val(double(n)) {}
    json(const string& s) : type(STRING_T), s_val(s) {}
    json(const char* s) : type(STRING_T), s_val(s) {}

    static json array() { json j; j.type = ARRAY_T; return j; }
    static json object() { json j; j.type = OBJECT_T; return j; }

    void push_back(const json& j) { if (type == ARRAY_T) a_val.push_back(j); }
    
    json& operator[](const string& key) {
        if (type == OBJECT_T) return o_val[key];
        throw runtime_error("Not an object: " + key);
    }

    const json& operator[](const string& key) const {
        if (type == OBJECT_T) return o_val.at(key);
        throw runtime_error("Not an object: " + key);
    }

    json& operator[](int index) {
        if (type == ARRAY_T) return a_val[index];
        throw runtime_error("Not an array index " + to_string(index));
    }

    bool contains(const string& key) const {
        return type == OBJECT_T && o_val.find(key) != o_val.end();
    }

    string value(const string& key, const string& def) const {
        if (contains(key)) return o_val.at(key).s_val;
        return def;
    }

    size_t size() const {
        if (type == ARRAY_T) return a_val.size();
        if (type == OBJECT_T) return o_val.size();
        return 0;
    }

    // --- Conversions ---
    template<typename T> T as() const;
    template<typename T> vector<T> as_vector() const;

    // --- Templated Constructors for Assignment ---
    json(const vector<int>& v) : type(ARRAY_T) { for (int x : v) a_val.push_back(json(x)); }
    json(const vector<string>& v) : type(ARRAY_T) { for (const string& s : v) a_val.push_back(json(s)); }
    json(const vector<double>& v) : type(ARRAY_T) { for (double d : v) a_val.push_back(json(d)); }

    template<typename T> json& operator=(const T& val) {
        *this = json(val);
        return *this;
    }

    string dump() const {
        switch (type) {
            case NULL_T: return "null";
            case BOOL_T: return b_val ? "true" : "false";
            case NUMBER_T: {
                ostringstream oss;
                if (n_val == (long long)n_val) oss << (long long)n_val;
                else oss << fixed << setprecision(10) << n_val;
                string s = oss.str();
                if (s.find('.') != string::npos) {
                    s.erase(s.find_last_not_of('0') + 1, string::npos);
                    if (s.back() == '.') s.pop_back();
                }
                return s;
            }
            case STRING_T: {
                string r = "\\\"";
                for (char c : s_val) {
                    if (c == '\"') r += "\\\\\\\"";
                    else if (c == '\\\\') r += "\\\\\\\\";
                    else if (c == '\\b') r += "\\\\b";
                    else if (c == '\\f') r += "\\\\f";
                    else if (c == '\\n') r += "\\\\n";
                    else if (c == '\\r') r += "\\\\r";
                    else if (c == '\\t') r += "\\\\t";
                    else r += c;
                }
                return r + "\\\"";
            }
            case ARRAY_T: {
                string s = "[";
                for (size_t i = 0; i < a_val.size(); ++i) {
                    s += a_val[i].dump();
                    if (i < a_val.size() - 1) s += ",";
                }
                return s + "]";
            }
            case OBJECT_T: {
                string s = "{";
                size_t i = 0;
                for (auto it = o_val.begin(); it != o_val.end(); ++it) {
                    s += "\\\"" + it->first + "\\\":" + it->second.dump();
                    if (++i < o_val.size()) s += ",";
                }
                return s + "}";
            }
        }
        return "null";
    }

    static json parse(string& s, size_t& pos) {
        skip(s, pos);
        if (pos >= s.size()) return json();
        if (s[pos] == '{') return parse_obj(s, pos);
        if (s[pos] == '[') return parse_arr(s, pos);
        if (s[pos] == '\"') return parse_str(s, pos);
        if (isdigit(s[pos]) || s[pos] == '-') return parse_num(s, pos);
        if (s.compare(pos, 4, "true") == 0) { pos += 4; return json(true); }
        if (s.compare(pos, 5, "false") == 0) { pos += 5; return json(false); }
        if (s.compare(pos, 4, "null") == 0) { pos += 4; return json(); }
        return json();
    }

    static json parse(const string& s) {
        size_t pos = 0;
        return parse((string&)s, pos);
    }

private:
    static void skip(string& s, size_t& pos) {
        while (pos < s.size() && isspace(s[pos])) pos++;
    }

    static json parse_obj(string& s, size_t& pos) {
        json j = object();
        pos++; // {
        skip(s, pos);
        if (s[pos] == '}') { pos++; return j; }
        while (true) {
            string key = parse_str(s, pos).s_val;
            skip(s, pos);
            pos++; // :
            j.o_val[key] = parse(s, pos);
            skip(s, pos);
            if (s[pos] == '}') { pos++; break; }
            pos++; // ,
            skip(s, pos);
        }
        return j;
    }

    static json parse_arr(string& s, size_t& pos) {
        json j = array();
        pos++; // [
        skip(s, pos);
        if (s[pos] == ']') { pos++; return j; }
        while (true) {
            j.a_val.push_back(parse(s, pos));
            skip(s, pos);
            if (s[pos] == ']') { pos++; break; }
            pos++; // ,
            skip(s, pos);
        }
        return j;
    }

    static json parse_str(string& s, size_t& pos) {
        pos++; // \"
        string res;
        while (pos < s.size() && s[pos] != '\"') {
            if (s[pos] == '\\\\') {
                pos++;
                if (pos >= s.size()) break;
                if (s[pos] == 'n') res += '\\n';
                else if (s[pos] == 'r') res += '\\r';
                else if (s[pos] == 't') res += '\\t';
                else if (s[pos] == 'b') res += '\\b';
                else if (s[pos] == 'f') res += '\\f';
                else res += s[pos];
            } else res += s[pos];
            pos++;
        }
        pos++; // \"
        return json(res);
    }

    static json parse_num(string& s, size_t& pos) {
        size_t start = pos;
        if (s[pos] == '-') pos++;
        while (pos < s.size() && (isdigit(s[pos]) || s[pos] == '.' || s[pos] == 'e' || s[pos] == 'E' || s[pos] == '+')) pos++;
        try {
            return json(stod(s.substr(start, pos - start)));
        } catch (...) {
            return json(0.0);
        }
    }
    
    friend bool operator==(const json& a, const json& b) {
        if (a.type != b.type) {
            if (a.type == NUMBER_T && b.type == NUMBER_T) 
                return abs(a.n_val - b.n_val) < 1e-7;
            return false;
        }
        switch (a.type) {
            case NULL_T: return true;
            case BOOL_T: return a.b_val == b.b_val;
            case NUMBER_T: return abs(a.n_val - b.n_val) < 1e-7;
            case STRING_T: return a.s_val == b.s_val;
            case ARRAY_T:
                if (a.a_val.size() != b.a_val.size()) return false;
                for (size_t i = 0; i < a.a_val.size(); ++i)
                    if (!(a.a_val[i] == b.a_val[i])) return false;
                return true;
            case OBJECT_T:
                if (a.o_val.size() != b.o_val.size()) return false;
                for (auto it = a.o_val.begin(); it != a.o_val.end(); ++it) {
                    if (b.o_val.find(it->first) == b.o_val.end()) return false;
                    if (!(it->second == b.o_val.at(it->first))) return false;
                }
                return true;
        }
        return false;
    }
};

// --- Conversion Implementations ---
template<> int json::as<int>() const { return (int)n_val; }
template<> double json::as<double>() const { return n_val; }
template<> string json::as<string>() const { return s_val; }
template<> bool json::as<bool>() const { return b_val; }

template<typename T> vector<T> json::as_vector() const {
    vector<T> res;
    for (size_t i = 0; i < a_val.size(); ++i) res.push_back(a_val[i].as<T>());
    return res;
}

// Specializations for as<vector<...>> to support call_member
template<> vector<int> json::as<vector<int>>() const { return as_vector<int>(); }
template<> vector<string> json::as<vector<string>>() const { return as_vector<string>(); }
template<> vector<double> json::as<vector<double>>() const { return as_vector<double>(); }

// --- Helper for calling methods with guaranteed evaluation order ---
template<typename T> struct remover { using type = T; };
template<typename T> struct remover<T&> { using type = T; };
template<typename T> struct remover<const T&> { using type = T; };

template<size_t I, typename Ret, typename Class, typename... Args, typename... CurrentArgs>
typename enable_if<I == sizeof...(Args), Ret>::type
call_recursive(Class* obj, Ret (Class::*func)(Args...), const vector<json>& vals, CurrentArgs&&... args) {
    return (obj->*func)(forward<CurrentArgs>(args)...);
}

template<size_t I, typename Ret, typename Class, typename... Args, typename... CurrentArgs>
typename enable_if<I < sizeof...(Args), Ret>::type
call_recursive(Class* obj, Ret (Class::*func)(Args...), const vector<json>& vals, CurrentArgs&&... args) {
    using ArgType = typename tuple_element<I, tuple<Args...>>::type;
    auto next_arg = vals[I].as<typename remover<ArgType>::type>();
    return call_recursive<I+1>(obj, func, vals, forward<CurrentArgs>(args)..., next_arg);
}

template<typename Ret, typename Class, typename... Args>
Ret call_member(Class* obj, Ret (Class::*func)(Args...), const json& input) {
    vector<json> vals;
    if (input.type == json::OBJECT_T) {
        for (auto it = input.o_val.begin(); it != input.o_val.end(); ++it) vals.push_back(it->second);
    } else if (input.type == json::ARRAY_T) {
        vals = input.a_val;
    } else {
        throw runtime_error("Expected object or array for method arguments");
    }
    
    if (vals.size() < sizeof...(Args)) throw runtime_error("Too few arguments provided");
    return call_recursive<0>(obj, func, vals);
}

// ─── Solver and Execution ───────────────────────────────────────────

{{USER_CODE}}

bool compare(const json& output, const json& expected, const json& config) {
    string mode = config.value("compareMode", "EXACT");

    if (mode == "ORDER_INSENSITIVE") {
        if (output.type != json::ARRAY_T || expected.type != json::ARRAY_T) return output == expected;
        if (output.a_val.size() != expected.a_val.size()) return false;
        
        vector<bool> used(expected.a_val.size(), false);
        for (size_t k = 0; k < output.a_val.size(); ++k) {
            bool found = false;
            for (size_t i = 0; i < expected.a_val.size(); ++i) {
                if (!used[i] && output.a_val[k] == expected.a_val[i]) {
                    used[i] = true;
                    found = true;
                    break;
                }
            }
            if (!found) return false;
        }
        return true;
    }

    return output == expected;
}

int main() {
    ios::sync_with_stdio(false);
    cin.tie(nullptr);

    string raw, line;
    raw.reserve(1000000); 
    while (getline(cin, line)) raw += line;
    if (raw.empty()) return 0;

    json payload = json::parse(raw);
    json config = payload["executionConfig"];
    json tests = payload["tests"];

    json results = json::array();

    for (auto it = tests.a_val.begin(); it != tests.a_val.end(); ++it) {
        json& t = *it;
        auto start = chrono::steady_clock::now();
        json res = json::object();

        try {
            json input = t["input"];
            Solution sol;
            
            // Generate valid call based on methodName
            // We use a helper to detect if a "solve" method exists, 
            // otherwise we use our template trick to call the specific name.
            
            json output;
            
            // If the user's class has a 'solve' method taking json, use it.
            // Otherwise, use the methodName from config.
            // Since we can't do this easily at compile time without knowing the name,
            // we'll use a placeholder that the runner replaces.
            
            {{METHOD_CALL_BLOCK}}

            bool ok = compare(output, t["expectedOutput"], config);

            res["ok"] = ok;
            res["output"] = output;
            res["expected"] = t["expectedOutput"];
            res["durationMs"] = (double)chrono::duration_cast<chrono::milliseconds>(
                chrono::steady_clock::now() - start
            ).count();
            res["error"] = json(); // null

        } catch (exception &e) {
            res["ok"] = false;
            res["output"] = json();
            res["expected"] = t["expectedOutput"];
            res["durationMs"] = (double)chrono::duration_cast<chrono::milliseconds>(
                chrono::steady_clock::now() - start
            ).count();
            res["error"] = string(e.what());
        }

        results.push_back(res);
    }

    cout << results.dump() << endl;
    return 0;
}
`;
}