/**
 * Supported languages for code execution
 * ❌ No JavaScript
 * ✅ Java, Python, C++ only
 */
export enum Language {
  JAVA = 'java',
  PYTHON = 'python',
  CPP = 'cpp',
}

/**
 * Judge0 language IDs
 * Reference: https://ce.judge0.com/languages
 */
export const LanguageId: Record<Language, number> = {
  [Language.JAVA]: 62, // Java (OpenJDK 13.0.1)
  [Language.PYTHON]: 71, // Python (3.8.1)
  [Language.CPP]: 54, // C++ (GCC 9.2.0) - GNU++17
} as const;

/**
 * Language display names
 */
export const LanguageDisplayName: Record<Language, string> = {
  [Language.JAVA]: 'Java',
  [Language.PYTHON]: 'Python 3',
  [Language.CPP]: 'C++17',
} as const;

/**
 * Check if a language string is supported
 */
export function isValidLanguage(lang: string): lang is Language {
  const normalized = lang.toLowerCase();
  return (
    normalized === Language.JAVA ||
    normalized === Language.PYTHON ||
    normalized === 'python3' ||
    normalized === Language.CPP ||
    normalized === 'c++'
  );
}

/**
 * Normalize language string to Language enum
 */
export function normalizeLanguage(lang: string): Language {
  const normalized = lang.toLowerCase();
  
  switch (normalized) {
    case 'java':
      return Language.JAVA;
    case 'python':
    case 'python3':
      return Language.PYTHON;
    case 'cpp':
    case 'c++':
      return Language.CPP;
    default:
      throw new Error(`Unsupported language: ${lang}. Supported: java, python, cpp`);
  }
}

