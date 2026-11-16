/** Execute demo snippets only from the run action, outside React rendering. */
export async function runDemoScript(code: string, output: Pick<Console, 'log' | 'error' | 'warn' | 'info' | 'clear'>): Promise<number> {
  const AsyncFunction = Object.getPrototypeOf(async function () {}).constructor as new (
    name: string, source: string
  ) => (console: typeof output) => Promise<void>;
  const run = new AsyncFunction('console', code);
  const start = performance.now();
  await run(output);
  return performance.now() - start;
}
