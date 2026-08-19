/**
 * Post-build smoke test for the published artifact.
 *
 * TMDBrJS is ESM-only. CommonJS consumers reach it through Node's `require(esm)`,
 * which only works while the module graph stays synchronous — a single top-level
 * await anywhere in the bundle (ours or a dependency's) silently breaks them.
 *
 * Each check runs in its own process on purpose: within one process, an earlier
 * `import()` populates the ESM cache and a later `require()` of the same module
 * returns the cached namespace without ever exercising the synchronous path,
 * which would make this test pass against a bundle that is broken for real
 * CommonJS consumers.
 */
import { execFileSync } from 'node:child_process';
import { fileURLToPath } from 'node:url';

const dist = fileURLToPath(new URL('../dist/index.mjs', import.meta.url));

const checks = [
  {
    name: 'ESM import',
    args: [
      '--input-type=module',
      '-e',
      `import { Client } from ${JSON.stringify(dist)};
       if (typeof Client !== 'function') throw new Error('Client missing from ESM import');`,
    ],
  },
  {
    name: 'CommonJS require(esm)',
    args: [
      '-e',
      `const { Client } = require(${JSON.stringify(dist)});
       if (typeof Client !== 'function') throw new Error('Client missing from require()');`,
    ],
  },
];

let failed = false;
for (const { name, args } of checks) {
  try {
    execFileSync(process.execPath, args, { stdio: 'pipe' });
    console.log(`✔ ${name}`);
  } catch (error) {
    failed = true;
    console.error(`✘ ${name}\n${error.stderr?.toString().trim() ?? error.message}`);
  }
}

if (failed) {
  console.error('\nsmoke test failed: the built package does not load cleanly');
  process.exit(1);
}
console.log('\nsmoke test passed');
