---
id: environment-setup
title: Environment Setup
sidebar_label: Environment Setup
description: Configure environment variables and runtime settings for node-demo.
---

# Environment Setup

## Overview

node-demo follows the **12-factor app** convention: all environment-specific configuration is supplied via environment variables. Source code never reads `process.env` directly outside of a dedicated config module.

## Environment Files

Create a `.env` file in the project root (this file is gitignored):

```bash
cp .env.example .env
```

:::warning Never commit `.env`
The `.env` file holds secrets. It is listed in `.gitignore`. If you accidentally commit it, rotate all secrets immediately.
:::

## Variable Reference

| Variable | Required | Default | Description |
|---|---|---|---|
| `NODE_ENV` | No | `development` | Runtime environment (`development` \| `production` \| `test`) |
| `PORT` | No | `3000` | HTTP port the Express server listens on |
| `LOG_LEVEL` | No | `info` | Pino log level (`trace` \| `debug` \| `info` \| `warn` \| `error`) |
| `BCRYPT_SALT_ROUNDS` | No | `12` | Cost factor for bcrypt password hashing |

### `.env.example`

```dotenv
# Runtime
NODE_ENV=development
PORT=3000

# Logging
LOG_LEVEL=info

# Auth
BCRYPT_SALT_ROUNDS=12
```

## Config Module Pattern

Access environment variables through a typed config module, never via raw `process.env` calls in business code:

```typescript title="src/config.ts"
function requireEnv(key: string): string {
  const value = process.env[key];
  if (!value) throw new Error(`Missing required environment variable: ${key}`);
  return value;
}

export const config = {
  nodeEnv: process.env['NODE_ENV'] ?? 'development',
  port: Number(process.env['PORT'] ?? 3000),
  logLevel: process.env['LOG_LEVEL'] ?? 'info',
  bcryptSaltRounds: Number(process.env['BCRYPT_SALT_ROUNDS'] ?? 12),
} as const;
```

## Per-Environment Overrides

| File | Purpose |
|---|---|
| `.env` | Local development secrets (gitignored) |
| `.env.test` | Test-specific overrides (can be committed if secret-free) |
| `.env.example` | Template for new developers (committed) |

Load the test environment in Vitest config:

```typescript title="vitest.config.ts"
import { defineConfig } from 'vitest/config';

export default defineConfig({
  test: {
    env: {
      NODE_ENV: 'test',
      LOG_LEVEL: 'silent',
    },
  },
});
```

## Validating on Startup

Validate required variables as early as possible so the server fails fast with a clear message instead of crashing mid-request:

```typescript title="src/index.ts"
import { config } from './config.js';

// Throws early if any required variable is missing
console.log(`Starting in ${config.nodeEnv} mode on port ${config.port}`);
```
