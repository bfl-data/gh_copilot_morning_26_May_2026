# copilot-demo-node

![Node.js 20+](https://img.shields.io/badge/node-%3E%3D20-3C873A?logo=node.js&logoColor=white)
![TypeScript 5.5](https://img.shields.io/badge/typescript-5.5-3178C6?logo=typescript&logoColor=white)
![Vitest 2](https://img.shields.io/badge/tests-vitest-6E9F18)

Small TypeScript demo snippets used for GitHub Copilot training sessions. The workspace is intentionally minimal and includes a few focused files that are useful for prompt-driven coding, bug-fixing, refactoring, and test-writing exercises.

## What This Project Does

This repository contains a compact set of examples rather than a full application:

- `array-utils.ts` provides small array helpers, including an intentionally incorrect `findLastEven` implementation for bug-fix demos.
- `parser.ts` exposes a simple ISO date parser that returns `null` instead of throwing on invalid input.
- `auth.controller.ts` shows an Express-style authentication controller with inline password hashing and verification, intended for refactoring exercises.
- `price-calculator.ts` is an empty scaffold used for comment-driven development demos.

## Why This Project Is Useful

- Gives you small, isolated TypeScript surfaces that are easy to modify during live demos or workshops.
- Covers several realistic tasks: utilities, parsing, controller logic, validation, and refactoring.
- Includes deliberate training hooks, such as inline comments describing bugs or future extraction work.
- Uses common Node.js tooling and libraries: TypeScript, Express, bcrypt, and Vitest.

## Project Layout

```text
.
|-- array-utils.ts
|-- auth.controller.ts
|-- parser.ts
|-- price-calculator.ts
`-- package.json
```

## Getting Started

### Prerequisites

- Node.js 20 or later
- npm 10 or later

### Install

```bash
npm install
```

### Available Scripts

```bash
npm run test
npm run typecheck
npm run build
```

### Current Workspace Notes

This snapshot is intentionally incomplete for training purposes. The `package.json` includes app-oriented scripts such as `dev` and `start`, but this workspace does not currently include a `src/` entry point or a `tsconfig.json`. In practice, the most useful way to work with this repository is to edit the individual TypeScript files directly and add tests around them as part of the exercises.

## Usage Examples

### Array Utilities

```ts
import { chunk, head, last, findLastEven } from './array-utils';

head([10, 20, 30]);
// => 10

last([10, 20, 30]);
// => 30

chunk([1, 2, 3, 4, 5], 2);
// => [[1, 2], [3, 4], [5]]

findLastEven([1, 2, 3, 4, 5, 6]);
// documented intent: 6
// current demo behavior is intentionally incorrect
```

### Date Parsing

```ts
import { parseDate } from './parser';

parseDate('2026-05-26T09:30:00Z');
// => Date

parseDate('not-a-date');
// => null
```

### Authentication Controller Demo

`auth.controller.ts` is designed as a refactoring exercise. It shows registration and login handlers with:

- request validation for `email` and `password`
- in-memory user storage
- bcrypt hashing and comparison
- structured logging hooks

If you want to use it in an Express app, treat it as a starting point and add the missing surrounding project structure first.

## Getting Help

- Open an issue or discussion in the repository that contains this training project.
- Review the Node.js docs: <https://nodejs.org/en/docs>
- Review the TypeScript docs: <https://www.typescriptlang.org/docs/>
- Review the Vitest docs: <https://vitest.dev/>

## Maintainers And Contributions

This repository is described in `package.json` as a Synechron Copilot training demo used for in-session exercises.

If you maintain this project, consider adding:

- `CONTRIBUTING.md` for contribution workflow and coding expectations
- `LICENSE` if the repository is intended for reuse outside the training environment
- a small test suite that covers the demo utilities and controller behavior

Contributions should stay aligned with the training purpose of the repository: keep examples small, focused, and easy to modify during guided sessions.