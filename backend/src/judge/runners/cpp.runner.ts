import { Language } from '../enums/language.enum';
import { ExecutionConfig } from '../interfaces/execution-config.interface';
import { Runner } from './runner.interface';
import { getCppTemplate } from '../templates/global-templates';

/**
 * C++ Runner Implementation
 *
 * Uses the global C++ runner template.
 * The runner receives all test cases + executionConfig as a single JSON payload.
 *
 * ⚠️ CRITICAL: C++ requires nlohmann/json.hpp (supported in Judge0 GNU++17)
 */
export class CppRunner implements Runner {
  readonly language = Language.CPP;

  build(userCode: string, _config: ExecutionConfig): string {
    const template = getCppTemplate();
    return template.replace('{{USER_CODE}}', userCode);
  }

  serializeInput(input: Record<string, unknown>): string {
    return JSON.stringify(input);
  }
}
