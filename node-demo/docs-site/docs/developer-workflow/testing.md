---
id: testing
title: Testing
sidebar_label: Testing
description: How to write, organise, and run tests using Vitest in node-demo.
---

# Testing

## Test Runner

node-demo uses **[Vitest](https://vitest.dev/)** — a fast, ESM-native test runner that is API-compatible with Jest but purpose-built for modern TypeScript projects.

---

## Running Tests

| Command | Purpose |
|---|---|
| `npm test` | Run all tests once |
| `npx vitest` | Watch mode — re-runs on file change |
| `npx vitest run --coverage` | Run with coverage report |
| `npx vitest run src/utils` | Run tests matching a path pattern |

---

## File Organisation

Tests live **adjacent** to the source file they test. Never in a separate `tests/` or `__tests__/` directory:

```text
users.controller.ts
users.controller.test.ts   ← co-located
users.routes.ts
users.routes.test.ts       ← co-located
src/utils/price-calculator.ts
src/utils/price-calculator.test.ts  ← co-located
```

---

## Test Structure Conventions

```typescript
import { describe, it, expect, beforeEach, vi } from 'vitest';

describe('ModuleName', () => {
  beforeEach(() => {
    // Reset mocks and state before every test
    vi.restoreAllMocks();
  });

  describe('functionName', () => {
    it('returns expected value for valid input', () => {
      ...
    });

    it('throws when input is negative', () => {
      ...
    });
  });
});
```

### Rules

- Use `describe(ModuleName)` as the outer block
- Use `it(behaviour)` for individual cases — **no `should`** prefix
- Reset mocks in `beforeEach`, not `afterEach`
- Mock dependencies with `vi.fn()`, never rely on real I/O in unit tests

---

## Unit Test Example

```typescript title="src/utils/price-calculator.test.ts"
import { describe, it, expect } from 'vitest';
import { calculateVAT } from './price-calculator.js';

describe('calculateVAT', () => {
  it('returns correct VAT for standard rate', () => {
    expect(calculateVAT(1000, 0.18)).toBe(180);
  });

  it('returns 0 for zero amount', () => {
    expect(calculateVAT(0, 0.18)).toBe(0);
  });

  it('rounds to nearest integer', () => {
    expect(calculateVAT(100, 0.185)).toBe(19); // 18.5 → 19
  });

  it('throws RangeError for negative amount', () => {
    expect(() => calculateVAT(-1, 0.18)).toThrow(RangeError);
  });

  it('throws RangeError for VAT rate above 1', () => {
    expect(() => calculateVAT(100, 1.5)).toThrow(RangeError);
  });

  it('throws RangeError for negative VAT rate', () => {
    expect(() => calculateVAT(100, -0.1)).toThrow(RangeError);
  });
});
```

---

## Controller Test Example

```typescript title="users.controller.test.ts"
import { describe, it, expect, beforeEach } from 'vitest';
import type { Request, Response } from 'express';
import { createUser, clearUsers } from './users.controller.js';

function makeRes() {
  const res = {
    status: vi.fn().mockReturnThis(),
    json: vi.fn().mockReturnThis(),
  } as unknown as Response;
  return res;
}

describe('createUser', () => {
  beforeEach(() => {
    clearUsers();
  });

  it('returns 201 with new user when input is valid', async () => {
    const req = { body: { email: 'alice@example.com', name: 'Alice' } } as Request;
    const res = makeRes();

    await createUser(req, res);

    expect(res.status).toHaveBeenCalledWith(201);
    expect(res.json).toHaveBeenCalledWith(
      expect.objectContaining({ email: 'alice@example.com', name: 'Alice' }),
    );
  });

  it('returns 400 when email is missing', async () => {
    const req = { body: { name: 'Alice' } } as Request;
    const res = makeRes();

    await createUser(req, res);

    expect(res.status).toHaveBeenCalledWith(400);
  });

  it('returns 409 when email already exists', async () => {
    const req = { body: { email: 'alice@example.com', name: 'Alice' } } as Request;
    const res = makeRes();

    await createUser(req, res); // first call — creates user
    await createUser(req, res); // second call — conflict

    expect(res.status).toHaveBeenLastCalledWith(409);
  });
});
```

---

## Mocking

```typescript
import { vi, describe, it, expect, beforeEach } from 'vitest';

// Mock a module
vi.mock('../lib/logger.js', () => ({
  logger: { info: vi.fn(), warn: vi.fn(), error: vi.fn() },
}));

// Mock a function on an object
const mockHashPassword = vi.fn().mockResolvedValue('hashed-password');

// Reset between tests
beforeEach(() => {
  vi.restoreAllMocks();
});
```

---

## Coverage

```bash
npx vitest run --coverage
```

Coverage report is generated in `coverage/`. Open `coverage/index.html` in a browser for a visual breakdown.

Recommended thresholds for production code:

```typescript title="vitest.config.ts"
export default defineConfig({
  test: {
    coverage: {
      provider: 'v8',
      thresholds: {
        lines: 80,
        functions: 80,
        branches: 70,
      },
    },
  },
});
```

---

## Integration Tests

Use `supertest` to test the full HTTP layer without starting a real server:

```bash
npm install --save-dev supertest @types/supertest
```

```typescript title="users.routes.test.ts"
import { describe, it, expect } from 'vitest';
import request from 'supertest';
import express from 'express';
import { usersRouter } from './users.routes.js';

const app = express();
app.use(express.json());
app.use(usersRouter);

describe('POST /users', () => {
  it('returns 201 for valid input', async () => {
    const res = await request(app)
      .post('/users')
      .send({ email: 'bob@example.com', name: 'Bob' });

    expect(res.status).toBe(201);
    expect(res.body).toMatchObject({ email: 'bob@example.com' });
  });
});
```
