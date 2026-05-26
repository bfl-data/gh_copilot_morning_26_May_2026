---
id: faq
title: FAQ & Troubleshooting
sidebar_label: FAQ
description: Frequently asked questions and troubleshooting guide for node-demo.
---

# FAQ & Troubleshooting

## Installation & Setup

### `npm install` fails with peer dependency errors

**Cause:** Mismatched Node.js version.

**Fix:**
```bash
node --version  # should be ≥ 20
nvm use 20      # if using nvm
npm install
```

---

### `Cannot find module` at runtime

**Cause:** Missing `.js` extension on local ESM imports.

**Fix:** Add `.js` to every local import:

```typescript
// ❌ Broken
import { logger } from '../lib/logger';

// ✅ Fixed
import { logger } from '../lib/logger.js';
```

---

### `SyntaxError: Cannot use import statement`

**Cause:** Running TypeScript source directly with `node` instead of `tsx`.

**Fix:**

```bash
# ✅ Use tsx for TypeScript
npx tsx src/index.ts

# ✅ Or compile first, then run
npm run build && npm start
```

---

### `tsc` reports errors but `tsx` works fine

**Cause:** `tsx` intentionally skips type errors to stay fast. Always run `npm run typecheck` to catch real issues.

**Fix:**
```bash
npm run typecheck
```

---

## Tests

### Tests pass locally but fail in CI

**Common causes:**

1. **Uncommitted files** — ensure all new files are committed
2. **Environment variables** — CI may not have `.env`. Check if tests depend on env vars that should default
3. **Case-sensitive paths** — Linux is case-sensitive; Windows is not. Fix import casing

---

### `vi.fn()` is not resetting between tests

**Cause:** Using `vi.clearAllMocks()` instead of `vi.restoreAllMocks()`, or not resetting in `beforeEach`.

**Fix:**
```typescript
beforeEach(() => {
  vi.restoreAllMocks(); // not afterEach
});
```

---

### Test output is noisy with log messages

**Fix:** Set `LOG_LEVEL=silent` in the test environment:

```typescript title="vitest.config.ts"
export default defineConfig({
  test: {
    env: { LOG_LEVEL: 'silent' },
  },
});
```

---

## Auth

### `bcrypt.compare` always returns `false`

**Cause:** You are comparing against a differently hashed value or re-hashing the already-hashed password.

**Fix:** Hash only once at registration. Compare the raw password against the stored hash:

```typescript
// Registration — hash once
const hash = await bcrypt.hash(plainPassword, 12);

// Login — compare plain against stored hash
const valid = await bcrypt.compare(plainPassword, storedHash); // not against a re-hash
```

---

### `users.has(email)` returns `false` for duplicate emails

**Cause:** Email casing is not normalised consistently.

**Fix:** Always normalise before storing and before looking up:

```typescript
const email = rawEmail.trim().toLowerCase();
```

---

## Logging

### Pino output is raw JSON in development

**Fix:** Install `pino-pretty` as a dev dependency and pipe:

```bash
npm install --save-dev pino-pretty
npm run dev | npx pino-pretty
```

Or configure the transport in the logger:

```typescript
transport: {
  target: 'pino-pretty',
  options: { colorize: true },
},
```

---

### `logger is not a function` / logger import fails

**Cause:** The shared logger at `src/lib/logger.ts` does not exist yet in the training repo.

**Fix:** Create it:

```typescript title="src/lib/logger.ts"
import pino from 'pino';
export const logger = pino({ level: process.env['LOG_LEVEL'] ?? 'info' });
```

---

## TypeScript

### `Object is possibly 'undefined'` with array indexing

**Cause:** `noUncheckedIndexedAccess` is enabled. Array indexing returns `T | undefined`.

**Fix:** Guard before use:

```typescript
const n = numbers[i];
if (n !== undefined && n % 2 === 0) {
  return n;
}
```

---

### `Type 'unknown' is not assignable to type 'X'`

**Fix:** Narrow the type before using it:

```typescript
function isString(value: unknown): value is string {
  return typeof value === 'string';
}

if (isString(value)) {
  // value is string here
}
```

---

## Common Mistakes Reference

| Mistake | Correct approach |
|---|---|
| `console.log(...)` | `logger.info({...}, 'message')` |
| `import x from 'y'` without `.js` | `import x from 'y.js'` |
| `as any` | Use `unknown` and narrow |
| `.then()` chains | `await` |
| Direct `process.env` access | Via `src/config.ts` |
| Business logic in route file | Move to service layer |
| Catching errors and swallowing | Let them bubble to global handler |
| Logging passwords/tokens | Log only safe identifiers (email, id) |

---

## Getting More Help

- [Vitest documentation](https://vitest.dev/)
- [Express.js guide](https://expressjs.com/en/guide/routing.html)
- [Pino documentation](https://getpino.io/)
- [TypeScript handbook](https://www.typescriptlang.org/docs/handbook/)
- [bcrypt npm page](https://www.npmjs.com/package/bcrypt)
