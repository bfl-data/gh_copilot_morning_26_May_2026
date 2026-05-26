---
id: error-handling
title: Error Handling
sidebar_label: Error Handling
description: How errors are structured, propagated, and serialised in node-demo.
---

# Error Handling

## Philosophy

- **Let errors bubble** — do not swallow errors with `try/catch` unless you can meaningfully recover
- **Validate at the boundary** — parse and reject invalid input as early as possible in the controller
- **Consistent response shape** — all error responses use the same JSON structure
- **No internals in responses** — stack traces and internal messages never reach the client

---

## Error Response Shape

All endpoints return errors in this envelope:

```typescript
type ErrorResponse = {
  error: string;
};
```

### Example

```json
{
  "error": "name and email are required"
}
```

### Future: structured error envelope

For machine-readable error handling, extend the shape:

```typescript
type StructuredError = {
  error: {
    code: string;      // e.g. "VALIDATION_ERROR", "EMAIL_IN_USE"
    message: string;   // human-readable
    details?: unknown; // optional field-level errors from Zod
  };
};
```

---

## HTTP Status Code Conventions

| Code | Meaning | When used |
|---|---|---|
| `200` | OK | Successful read / login |
| `201` | Created | Resource successfully created |
| `400` | Bad Request | Missing or invalid input |
| `401` | Unauthorized | Invalid credentials |
| `404` | Not Found | Resource does not exist |
| `409` | Conflict | Duplicate resource (e.g. email in use) |
| `422` | Unprocessable Entity | Semantically invalid input (Zod) |
| `500` | Internal Server Error | Unexpected failures |

---

## Validation Errors

Input validation is performed in the controller with a type guard parser:

```typescript
function parseCreateUserBody(body: unknown): CreateUserBody | null {
  if (typeof body !== 'object' || body === null) return null;
  const { email, name } = body as Record<string, unknown>;
  if (typeof email !== 'string' || typeof name !== 'string') return null;

  const normalizedEmail = email.trim().toLowerCase();
  const normalizedName = name.trim();
  if (!normalizedEmail || !normalizedName) return null;

  return { email: normalizedEmail, name: normalizedName };
}
```

When validation fails, return `400` immediately:

```typescript
const input = parseCreateUserBody(req.body);
if (!input) {
  return res.status(400).json({ error: 'name and email are required' });
}
```

### Using Zod (recommended upgrade)

```typescript title="src/schemas/user.schema.ts"
import { z } from 'zod';

export const createUserSchema = z.object({
  email: z.string().trim().email().min(1),
  name: z.string().trim().min(1),
});

export type CreateUserInput = z.infer<typeof createUserSchema>;
```

```typescript title="src/controllers/users.controller.ts"
import { createUserSchema } from '../schemas/user.schema.js';

const result = createUserSchema.safeParse(req.body);
if (!result.success) {
  return res.status(400).json({
    error: { code: 'VALIDATION_ERROR', details: result.error.flatten() },
  });
}
```

---

## Global Error Handler

Add a global error-handling middleware as the **last** middleware in `app.ts`:

```typescript title="src/middleware/error-handler.ts"
import type { Request, Response, NextFunction } from 'express';
import { logger } from '../lib/logger.js';

export function errorHandler(
  err: unknown,
  _req: Request,
  res: Response,
  _next: NextFunction,
): void {
  logger.error({ err }, 'Unhandled error');
  const status = err instanceof AppError ? err.statusCode : 500;
  const message = err instanceof AppError ? err.message : 'Internal server error';
  res.status(status).json({ error: message });
}
```

```typescript title="src/app.ts"
import { errorHandler } from './middleware/error-handler.js';

// ... routes ...
app.use(errorHandler); // must be last
```

---

## Async Handler Wrapper

Prevent uncaught promise rejections in async controllers by wrapping them:

```typescript title="src/middleware/async-handler.ts"
import type { Request, Response, NextFunction, RequestHandler } from 'express';

type AsyncFn = (req: Request, res: Response, next: NextFunction) => Promise<unknown>;

export function asyncHandler(fn: AsyncFn): RequestHandler {
  return (req, res, next) => {
    fn(req, res, next).catch(next);
  };
}
```

Usage:

```typescript
router.post('/users', asyncHandler(createUser));
```

---

## Domain Errors

Define typed domain errors to carry HTTP status codes:

```typescript title="src/lib/errors.ts"
export class AppError extends Error {
  constructor(
    message: string,
    public readonly statusCode: number,
    public readonly code: string,
  ) {
    super(message);
    this.name = 'AppError';
  }
}

export class NotFoundError extends AppError {
  constructor(resource: string) {
    super(`${resource} not found`, 404, 'NOT_FOUND');
  }
}

export class ConflictError extends AppError {
  constructor(message: string) {
    super(message, 409, 'CONFLICT');
  }
}
```

---

## What NOT to Do

```typescript
// ❌ Swallowing errors
try {
  await doSomething();
} catch {
  // silent — bugs disappear here
}

// ❌ Leaking internals
res.status(500).json({ error: err.stack });

// ❌ console.log instead of logger
console.error(err);
```
