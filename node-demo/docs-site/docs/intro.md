---
id: intro
title: Introduction
sidebar_label: Introduction
slug: /intro
description: Overview of the node-demo TypeScript training project — what it is, who it's for, and how to navigate the docs.
---

# node-demo

> A focused TypeScript/Express training project used for GitHub Copilot live-coding sessions and workshops.

## What Is node-demo?

**node-demo** (`copilot-demo-node`) is a compact Node.js / TypeScript codebase designed for hands-on GitHub Copilot demonstrations. Each module is a deliberately small, realistic slice of production code — utilities, parsers, controllers — that acts as a sandbox for exercises such as:

- Prompt-driven feature generation
- Bug detection and fixing
- Refactoring with AI assistance
- Writing tests from scratch

:::info Training Project
This repository is **intentionally minimal**. It is not a full production application. Some files contain deliberate bugs or incomplete implementations as training hooks for Copilot sessions.
:::

## Key Technologies

| Layer | Technology |
|---|---|
| Runtime | Node.js ≥ 20 LTS |
| Language | TypeScript 5.5 (strict mode) |
| HTTP framework | Express 4.x |
| Password hashing | bcrypt 5.x |
| Logging | Pino 9.x |
| Testing | Vitest 2.x |
| Module system | ESM (`"type": "module"`) |

## Repository Modules

| File | Purpose |
|---|---|
| `array-utils.ts` | Generic array helpers (`head`, `last`, `chunk`, `findLastEven`) |
| `parser.ts` | ISO 8601 date parser returning `null` on invalid input |
| `auth.controller.ts` | Express auth controller with `register` / `login` endpoints |
| `users.controller.ts` | Express users controller with `createUser` endpoint |
| `users.routes.ts` | Express Router wiring `POST /users` |
| `src/utils/price-calculator.ts` | VAT calculation utility |

## Who Should Read This?

These docs target **developers** who are:

- Attending a GitHub Copilot workshop and need a reference alongside the exercises
- Onboarding to the repo and want context on design decisions
- Contributing new training exercises

## Where to Start

1. **New to the project?** → [Installation](./getting-started/installation.md)
2. **Want to run it locally?** → [Local Development](./getting-started/local-development.md)
3. **Exploring the design?** → [Architecture Overview](./architecture/overview.md)
4. **Looking up an endpoint?** → [API Reference](./api/users.md)
