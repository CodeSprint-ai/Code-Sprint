import { Injectable } from '@nestjs/common';
import { Language, normalizeLanguage } from '../enums/language.enum';
import { Runner } from './runner.interface';
import { JavaRunner } from './java.runner';
import { PythonRunner } from './python.runner';
import { CppRunner } from './cpp.runner';

/**
 * RunnerFactory - Factory pattern for language-specific runners
 * 
 * ❌ No if-else chains
 * ❌ No switch inside controller
 * ✅ Clean factory pattern
 */
@Injectable()
export class RunnerFactory {
  private readonly runners: Map<Language, Runner>;

  constructor() {
    this.runners = new Map<Language, Runner>([
      [Language.JAVA, new JavaRunner()],
      [Language.PYTHON, new PythonRunner()],
      [Language.CPP, new CppRunner()],
    ]);
  }

  /**
   * Get the appropriate runner for a language
   * @param language - Language enum value or string (e.g., 'java', 'python', 'cpp', 'c++')
   * @returns The runner for the specified language
   * @throws Error if language is not supported
   */
  getRunner(language: Language | string): Runner {
    const lang = typeof language === 'string' 
      ? normalizeLanguage(language) 
      : language;
    
    const runner = this.runners.get(lang);
    
    if (!runner) {
      throw new Error(
        `No runner found for language: ${language}. Supported: java, python, cpp`
      );
    }
    
    return runner;
  }

  /**
   * Check if a language is supported
   */
  isSupported(language: string): boolean {
    try {
      const normalized = normalizeLanguage(language);
      return this.runners.has(normalized);
    } catch {
      return false;
    }
  }

  /**
   * Get all supported languages
   */
  getSupportedLanguages(): Language[] {
    return Array.from(this.runners.keys());
  }
}

