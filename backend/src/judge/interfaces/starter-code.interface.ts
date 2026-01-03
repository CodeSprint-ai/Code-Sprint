/**
 * Starter code structure for function-based problems
 * What the USER sees in the editor
 */
export interface StarterCode {
  java: string;
  python: string;
  cpp: string;
}

/**
 * Runner template structure
 * What Judge0 actually executes (user NEVER sees this)
 * Contains JSON parsing, Solution instantiation, and output formatting
 */
export interface RunnerTemplate {
  java: string;
  python: string;
  cpp: string;
}

