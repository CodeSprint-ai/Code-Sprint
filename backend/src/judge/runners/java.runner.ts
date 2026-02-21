import { Language } from '../enums/language.enum';
import { ExecutionConfig } from '../interfaces/execution-config.interface';
import { Runner } from './runner.interface';
import { getJavaTemplate } from '../templates/global-templates';

/**
 * Java Runner Implementation
 *
 * Uses the global Java runner template.
 * The runner receives all test cases + executionConfig as a single JSON payload.
 */
export class JavaRunner implements Runner {
  readonly language = Language.JAVA;

  build(userCode: string, _config: ExecutionConfig): string {
    const template = getJavaTemplate();
    return template.replace('{{USER_CODE}}', userCode);
  }

  serializeInput(input: Record<string, unknown>): string {
    return JSON.stringify(input);
  }
}
