const assert = require('node:assert/strict');
const fs = require('node:fs');
const path = require('node:path');

// Keep the standard Nest entrypoint and the existing Render start command valid.
const root = path.resolve(__dirname, '..');
const output = path.join(root, 'dist');
assert.ok(fs.existsSync(path.join(output, 'main.js')), 'Missing dist/main.js');

for (const source of fs.readdirSync(path.join(root, 'src', 'migrations'))) {
  if (source.endsWith('.ts') && !source.endsWith('.d.ts')) {
    assert.ok(
      fs.existsSync(path.join(output, 'migrations', source.replace(/\.ts$/, '.js'))),
      `Missing compiled migration: ${source}`,
    );
  }
}

const legacy = path.join(output, 'src');
fs.mkdirSync(legacy, { recursive: true });
fs.writeFileSync(
  path.join(legacy, 'main.js'),
  "// Compatibility entrypoint for Render's existing node dist/src/main.js command.\nmodule.exports = require('../main.js');\n",
);
console.log('Runtime ready: dist/main.js, dist/src/main.js, and compiled migrations.');
