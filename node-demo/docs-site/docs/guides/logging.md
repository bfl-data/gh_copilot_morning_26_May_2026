---
id: logging
title: Logging Strategy
sidebar_label: Logging
description: How to use the Pino logger in node-demo — conventions, levels, and structured logging patterns.
---

# Logging Strategy

## Logger Setup

node-demo uses **[Pino](https://getpino.io/)** — a structured JSON logger designed for Node.js. It is fast, low-overhead, and outputs newline-delimited JSON by default.

```typescript title="src/lib/logger.ts"
import pino from 'pino';
import { config } from '../config.js';

export const logger = pino({
  level: config.logLevel,
  ...(config.nodeEnv !== 'production' && {
    transport: {
      target: 'pino-pretty',
      options: { colorize: true },
    },
  }),
});
```

Import the shared logger everywhere — never create a new Pino instance per file:

```typescript
import { logger } from '../lib/logger.js';
```

---

## Log Levels

| Level | Method | When to use |
|---|---|---|
| `trace` | `logger.trace()` | Fine-grained debugging (usually disabled) |
| `debug` | `logger.debug()` | Development-time diagnostic info |
| `info` | `logger.info()` | Normal application flow events |
| `warn` | `logger.warn()` | Recoverable issues, unexpected but non-fatal |
| `error` | `logger.error()` | Failures that need investigation |
| `fatal` | `logger.fatal()` | Process-level failures before shutdown |

Default level: `info` (configurable via `LOG_LEVEL` env variable).

---

## Structured Logging Patterns

Always pass a **context object first**, then a message string:

```typescript
// ✅ Correct — context object + message
logger.info({ userId, taskId }, 'Task updated');
logger.warn({ email }, 'Login failed: bad password');
logger.error({ err, requestId }, 'Database write failed');

// ❌ Wrong — message only, no context
logger.info('Task updated');

// ❌ Wrong — interpolated string instead of structured fields
logger.info(`User ${userId} updated task ${taskId}`);
```

### Log with error object

Pino serialises `Error` objects under the `err` key:

```typescript
try {
  await db.save(record);
} catch (err) {
  logger.error({ err, record }, 'Failed to save record');
  throw err; // still bubble — don't swallow
}
```

---

## What to Log

### Always log

| Event | Level | Example |
|---|---|---|
| User registered | `info` | `logger.info({ email }, 'User registered')` |
| User logged in | `info` | `logger.info({ email }, 'User logged in')` |
| Request validation failure | `warn` | `logger.warn({ body }, 'Validation failed')` |
| Authentication failure | `warn` | `logger.warn({ email }, 'Login failed: bad password')` |
| Unexpected errors | `error` | `logger.error({ err }, 'Unhandled error')` |

### Never log

:::danger PII & Secrets
- Passwords (plaintext or hashed)
- Authentication tokens / JWTs
- Full request bodies containing PII
- Credit card numbers, national IDs
- API keys or secrets
:::

```typescript
// ❌ Never do this
logger.info({ password }, 'Login attempt');
logger.info({ token }, 'Token issued');

// ✅ Log only safe identifiers
logger.info({ email }, 'Login attempt');
```

---

## Log Output Formats

### Development (`pino-pretty`)

```
[14:23:05.123] INFO  (node-demo/12345): User registered
    email: "alice@example.com"
```

### Production (JSON)

```json
{
  "level": 30,
  "time": 1716700985123,
  "pid": 12345,
  "hostname": "web-1",
  "email": "alice@example.com",
  "msg": "User registered"
}
```

JSON output integrates with log aggregators (Datadog, Splunk, Azure Monitor, Loki).

---

## Request Logging

Add request-level logging with a middleware:

```typescript title="src/middleware/request-logger.ts"
import type { Request, Response, NextFunction } from 'express';
import { logger } from '../lib/logger.js';

export function requestLogger(req: Request, res: Response, next: NextFunction): void {
  const start = Date.now();
  res.on('finish', () => {
    logger.info(
      {
        method: req.method,
        url: req.url,
        status: res.statusCode,
        durationMs: Date.now() - start,
      },
      'Request completed',
    );
  });
  next();
}
```

---

## Silencing Logs in Tests

Set `LOG_LEVEL=silent` in your test environment to suppress output:

```typescript title="vitest.config.ts"
export default defineConfig({
  test: {
    env: { LOG_LEVEL: 'silent' },
  },
});
```

Or pass `{ level: 'silent' }` when constructing a test-specific logger instance.
