---
id: build-and-run
title: Build & Run
sidebar_label: Build & Run
description: How to build the TypeScript project and run it in development and production modes.
---

# Build & Run

## Available Scripts

| Script | Command | Purpose |
|---|---|---|
| `dev` | `tsx watch src/index.ts` | Development mode with hot reload |
| `build` | `tsc` | Compile TypeScript → `dist/` |
| `start` | `node dist/index.js` | Run compiled production output |
| `typecheck` | `tsc --noEmit` | Type-check without emitting files |
| `test` | `vitest` | Run all tests |

---

## Development Mode

```bash
npm run dev
```

**How it works:**
- `tsx` transpiles TypeScript on the fly — no separate compile step
- `--watch` flag monitors file changes and restarts automatically
- Source maps are preserved for readable stack traces

**When to use:** Day-to-day development, interactive debugging, running exercises.

---

## Production Build

### Step 1 — Compile

```bash
npm run build
```

Output lands in `dist/` mirroring the `src/` structure:

```text
dist/
├── index.js
├── config.js
├── app.js
├── controllers/
│   └── users.controller.js
└── ...
```

### Step 2 — Start

```bash
npm start
```

Runs the compiled JavaScript directly with Node. No TypeScript tooling is loaded at runtime.

### Build + start one-liner

```bash
npm run build && npm start
```

---

## Type Checking

Run a type check without producing output files:

```bash
npm run typecheck
```

:::tip CI usage
Add `npm run typecheck` as a CI step before building. It catches type errors faster than a full compile when you only need correctness feedback.
:::

---

## Environment Variables at Runtime

Set `NODE_ENV=production` before starting to unlock production-grade settings (log level, compression, stricter security):

```bash
NODE_ENV=production PORT=8080 npm start
```

On Windows PowerShell:

```powershell
$env:NODE_ENV = 'production'; $env:PORT = '8080'; npm start
```

---

## Build Output Verification

After building, confirm the output is valid before deploying:

```bash
# Verify the entry point resolves
node --input-type=module --eval "import('./dist/index.js')"
```

---

## Docker (Optional)

```dockerfile title="Dockerfile"
FROM node:20-alpine AS builder
WORKDIR /app
COPY package*.json ./
RUN npm ci
COPY . .
RUN npm run build

FROM node:20-alpine AS runtime
WORKDIR /app
COPY package*.json ./
RUN npm ci --omit=dev
COPY --from=builder /app/dist ./dist
EXPOSE 3000
CMD ["node", "dist/index.js"]
```

Build and run:

```bash
docker build -t node-demo .
docker run -p 3000:3000 node-demo
```

---

## Troubleshooting the Build

| Symptom | Likely cause | Fix |
|---|---|---|
| `Cannot find module '...'` | Missing `.js` extension in import | Add `.js` to all local imports |
| `error TS2307` | Import not found | Check path casing and file existence |
| `SyntaxError: Cannot use import` | Running `tsc` output with CommonJS Node | Ensure `"type": "module"` in `package.json` |
| `tsc: command not found` | TypeScript not installed | `npm install` |
