---
id: folder-structure
title: Folder Structure
sidebar_label: Folder Structure
description: Complete directory layout and file-naming conventions for node-demo.
---

# Folder Structure

## Current Layout

```text
node-demo/
├── array-utils.ts               # Generic array helper functions
├── auth.controller.ts           # Express auth controller (register / login)
├── parser.ts                    # ISO 8601 date parser
├── price-calculator.ts          # Empty scaffold (comment-driven dev exercise)
├── users.controller.ts          # Express users controller (createUser)
├── users.controller.test.ts     # Unit tests for users.controller
├── users.routes.ts              # Express Router — POST /users
├── users.routes.test.ts         # Integration tests for users routes
├── package.json
├── README.md
├── plans/
│   └── security-fix-plan.md     # Agent-mode planning artefact
└── src/
    └── utils/
        └── price-calculator.ts  # VAT calculation utility (with JSDoc)
```

:::note Top-level vs. `src/`
Top-level `.ts` files are **demo exercise files** — self-contained for easy editing during sessions. Production-quality code (with proper JSDoc, validated inputs, and tests) lives under `src/`.
:::

## Recommended Production Layout

When evolving the project into a real application, use this structure:

```text
src/
├── index.ts                     # Application entry point
├── config.ts                    # Typed environment config
├── app.ts                       # Express app factory (testable without listen)
│
├── routes/                      # Route registration only
│   ├── index.ts                 # Aggregates all routers
│   ├── users.routes.ts
│   └── auth.routes.ts
│
├── controllers/                 # Parse request → call service → format response
│   ├── users.controller.ts
│   └── auth.controller.ts
│
├── services/                    # Business logic
│   ├── user.service.ts
│   ├── auth.service.ts
│   └── password.service.ts      # bcrypt extraction target (Module 4.5)
│
├── repositories/                # Data access only
│   └── user.repository.ts
│
├── schemas/                     # Zod validation schemas
│   ├── user.schema.ts
│   └── auth.schema.ts
│
├── middleware/                  # Reusable Express middleware
│   ├── async-handler.ts         # Wraps async controllers
│   ├── error-handler.ts         # Global error handler
│   └── auth.middleware.ts       # JWT verification
│
├── lib/                         # Shared infrastructure
│   └── logger.ts                # Pino logger singleton
│
├── types/                       # Shared TypeScript types
│   └── domain.ts
│
└── utils/                       # Pure utility functions
    └── price-calculator.ts
```

## File-Naming Conventions

| Convention | Example | Rule |
|---|---|---|
| Source files | `kebab-case.ts` | Lowercase, hyphens |
| Test files | `*.test.ts` | Adjacent to source file |
| Type-only files | `domain.ts` | Grouped in `types/` |
| Schemas | `user.schema.ts` | Grouped in `schemas/` |

## Import Paths

All imports use the `.js` extension (required for ESM Node):

```typescript
// ✅ Correct
import { logger } from '../lib/logger.js';
import { createUser } from './users.controller.js';

// ❌ Wrong — will fail at runtime
import { logger } from '../lib/logger';
```

## Test File Co-location

Tests live **next to** their source file, not in a separate `tests/` directory:

```text
src/
├── utils/
│   ├── price-calculator.ts
│   └── price-calculator.test.ts   ← co-located
└── controllers/
    ├── users.controller.ts
    └── users.controller.test.ts   ← co-located
```

This keeps source and test in sync and makes it easy to see test coverage at a glance.
