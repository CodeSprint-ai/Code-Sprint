import { Language } from '../enums/language.enum';
import { ExecutionConfig } from '../interfaces/execution-config.interface';
import { Runner } from './runner.interface';
import { getPythonTemplate } from '../templates/global-templates';

/**
 * Python Runner Implementation
 *
 * Uses the global Python runner template.
 * The runner receives all test cases + executionConfig as a single JSON payload.
 */
export class PythonRunner implements Runner {
  readonly language = Language.PYTHON;

  build(userCode: string, _config: ExecutionConfig): string {
    const template = getPythonTemplate();
    return template.replace('{{USER_CODE}}', userCode);
  }

  serializeInput(input: Record<string, unknown>): string {
    return JSON.stringify(input);
  }
}
