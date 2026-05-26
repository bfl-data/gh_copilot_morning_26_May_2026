---
id: coding-standards
title: Coding Standards
sidebar_label: Coding Standards
description: TypeScript, Express, and general coding conventions for the node-demo project.
---

# Coding Standards

These conventions are enforced by GitHub Copilot instructions and should be followed in all contributions.

---

## Language & Toolchain

| Concern | Standard |
|---|---|
| Language | TypeScript 5.5+, **strict mode** |
| Runtime | Node.js ≥ 20 LTS |
| Module system | ESM (`"type": "module"`) |
| Framework | Express 4.x |
| No `any` | Use `unknown` and narrow. Flag with `TODO` if unavoidable |

### TypeScript strict mode

```json title="tsconfig.json (key options)"
{
  "compilerOptions": {
    "strict": true,
    "noUncheckedIndexedAccess": true,
    "exactOptionalPropertyTypes": true
  }
}
```

---

## Naming Conventions

| Kind | Convention | Example |
|---|---|---|
| Variables & functions | `camelCase` | `createUser`, `parseBody` |
| Types, interfaces, classes | `PascalCase` | `UserRecord`, `CreateUserBody` |
| File names | `kebab-case.ts` | `users.controller.ts` |
| Test files | `*.test.ts` | `users.controller.test.ts` |
| Environment variables | `UPPER_SNAKE_CASE` | `NODE_ENV`, `LOG_LEVEL` |

---

## Import Style

Use ESM `import`. Never `require()`. Always use `.js` extensions on local imports:

```typescript
// ✅ Correct
import { logger } from '../lib/logger.js';
import type { Request, Response } from 'express';

// ❌ Wrong — CommonJS
const logger = require('../lib/logger');

// ❌ Wrong — missing .js extension
import { logger } from '../lib/logger';
```

---

## UUID Generation

Use the native `crypto.randomUUID()`. Do **not** install the `uuid` package:

```typescript
// ✅ Native — no dependency
const id = crypto.randomUUID();

// ❌ Unnecessary dependency
import { v4 as uuidv4 } from 'uuid';
```

---

## Async / Await

Use `async/await` exclusively. Never `.then()` chains in new code:

```typescript
// ✅ Correct
const hash = await bcrypt.hash(password, 12);

// ❌ Wrong
bcrypt.hash(password, 12).then((hash) => { ... });
```

---

## Architecture Rules

```
Route → Controller → Service → Repository
```

| Layer | Can call | Cannot call |
|---|---|---|
| Route | Controller | Service, Repository |
| Controller | Service | Repository directly |
| Service | Repository | Controller, Express types |
| Repository | DB / external | Service, Controller |

---

## JSDoc Requirements

All **exported** functions and classes require JSDoc. Include `@param`, `@returns`, `@throws`, and `@example`:

```typescript
/**
 * Creates a new user for POST /users requests.
 *
 * @param req - Express request containing a JSON body with `email` and `name`.
 * @param res - Express response.
 * @returns A JSON response with the created user (201) or an error.
 * @throws Never intentionally throws; unexpected errors bubble up.
 * @example
 * app.post('/users', createUser);
 */
export async function createUser(req: Request, res: Response): Promise<Response> {
  ...
}
```

---

## Logging Rules

| Situation | Logger method |
|---|---|
| Normal application event | `logger.info` |
| Recoverable issue | `logger.warn` |
| Unexpected failure | `logger.error` |
| Never | `console.log`, `console.error` |

Always pass a context object first:

```typescript
logger.info({ userId, taskId }, 'Task updated');  // ✅
logger.info('Task updated');                       // ❌
```

---

## Git Conventions

### Commit message format

```
type(scope): subject
```

Allowed types: `feat`, `fix`, `chore`, `docs`, `refactor`, `test`

```text
feat(auth): add refresh token rotation
fix(users): handle missing avatar fallback
test(price-calculator): add edge cases for zero amount
```

### Branching

```text
feature/user-authentication
fix/login-validation
refactor/logger-cleanup
docs/api-setup
```

- **Never commit directly to `main` or `master`**
- All changes go through Pull Requests
- Keep PRs focused and small
- Rebase or sync regularly with `main`

---

## Code Quality Checklist

Before opening a PR:

- [ ] `npm run typecheck` passes with no errors
- [ ] `npm test` passes with no failures
- [ ] No `console.log` or `console.error` in source files
- [ ] No `as any` casts without a TODO comment
- [ ] Exported functions have JSDoc
- [ ] Branch follows naming convention
- [ ] Commit messages follow `type(scope): subject`
