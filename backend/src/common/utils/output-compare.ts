export function normalizeOutput(s: string) {
  return (s ?? '').replace(/\r/g, '').trim().split(/\s+/).join(' ');
}

export function compareOutput(expected: string, got: string) {
  return normalizeOutput(expected) === normalizeOutput(got);
}
