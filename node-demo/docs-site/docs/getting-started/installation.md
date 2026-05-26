---
id: installation
title: Installation
sidebar_label: Installation
description: Prerequisites and step-by-step installation guide for node-demo.
---

# Installation

This page walks you through installing node-demo on your local machine.

## Prerequisites

| Requirement | Minimum version | Recommended |
|---|---|---|
| Node.js | 20.0.0 | 20 LTS (latest) |
| npm | 10.0.0 | bundled with Node 20 |
| Git | 2.x | latest |

### Verify your environment

```bash
node --version   # e.g. v20.14.0
npm --version    # e.g. 10.7.0
git --version    # e.g. git version 2.45.1
```

:::tip Using a version manager?
We recommend [nvm](https://github.com/nvm-sh/nvm) (macOS/Linux) or [nvm-windows](https://github.com/coreybutler/nvm-windows) to manage Node.js versions.

```bash
nvm install 20
nvm use 20
```
:::

## Clone the Repository

```bash
git clone https://github.com/your-org/node-demo.git
cd node-demo
```

## Install Dependencies

```bash
npm install
```

This installs:
- **Runtime dependencies** — `express`, `pino`, `bcrypt`
- **Dev dependencies** — `typescript`, `tsx`, `vitest`, `@types/*`

### What gets installed

```
node_modules/
├── bcrypt/           — password hashing
├── express/          — HTTP framework
├── pino/             — structured JSON logging
├── typescript/       — TS compiler (dev)
├── tsx/              — TS execution for dev mode (dev)
└── vitest/           — test runner (dev)
```

## Verify Installation

Run the test suite to confirm everything is wired up correctly:

```bash
npm test
```

You should see output similar to:

```
✓ users.controller.test.ts (3 tests) 12ms
✓ users.routes.test.ts (2 tests) 8ms

Test Files  2 passed (2)
Tests       5 passed (5)
```

Run type-checking:

```bash
npm run typecheck
```

No errors means the TypeScript configuration is healthy.

## Next Steps

- [Local Development](./local-development.md) — how to run in watch mode and make changes
- [Environment Setup](./environment-setup.md) — configure environment variables
