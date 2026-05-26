# Plan: Auth Controller Security Fixes

## TL;DR
Address 5 security issues in `auth.controller.ts` by adding Zod validation, rate limiting, asyncHandler wrapping, Pino redaction, and fixing user enumeration. Requires installing 2 new deps and creating 4 new files before modifying the controller.

---

## Phase 1 — Install Dependencies
1. Install `zod` and `express-rate-limit` + `@types/express-rate-limit` via npm.
   - These block all other phases.

## Phase 2 — Create Infrastructure Files (parallel steps)
2. Create `src/lib/logger.ts` — Pino logger with `redact: ['req.body.password', 'req.headers.authorization']` (fixes Issue 4). Also note: `auth.controller.ts` currently imports from `'../lib/logger.js'` which resolves only if the file moves to `src/controllers/`. Update import path in `auth.controller.ts` to `'./src/lib/logger.js'` or create a root-level re-export. *Parallel with steps 3 and 4.*
3. Create `src/middleware/async-handler.ts` — wraps async Express handlers, forwards errors to `next()` (fixes Issue 5). *Parallel with steps 2 and 4.*
4. Create `src/schemas/auth.schema.ts` — Zod schema `AuthSchema` with `email: z.string().email().max(254).toLowerCase().trim()` and `password: z.string().min(8).max(128)` (fixes Issue 1). *Parallel with steps 2 and 3.*

## Phase 3 — Update auth.controller.ts (depends on Phase 2)
5. Update `auth.controller.ts`:
   - Import and apply `AuthSchema.parse()` at the top of both handlers (replaces manual existence checks).
   - Wrap both handlers with `asyncHandler` (fixes Issue 5).
   - Fix register to return generic `200` with vague message on duplicate email instead of `409` (fixes Issue 3).
   - Fix logger import path to match new `src/lib/logger.ts` location.

## Phase 4 — Create Auth Routes with Rate Limiting (parallel with Phase 3)
6. Create `src/routes/auth.routes.ts` — Express Router applying `express-rate-limit` (10 req / 15 min) to both `POST /register` and `POST /login`, mounting `authController` handlers via `asyncHandler` (fixes Issue 2). *Can be developed in parallel with step 5.*

## Phase 5 — Verification
7. Run `npm run typecheck` to verify no TypeScript errors across new and modified files.
8. Run `npm test` to confirm existing tests still pass.
9. Manually verify rate-limit behavior in tests or curl: confirm 429 after 10 rapid requests.
10. Confirm `zod` validation rejects: empty email, invalid email format, password < 8 chars.
11. Confirm register with existing email returns `200`, not `409`.

---

## Relevant Files
- `auth.controller.ts` — modify: schema parse, asyncHandler, enumeration fix, logger import
- `package.json` — add `zod`, `express-rate-limit`, `@types/express-rate-limit`
- `src/lib/logger.ts` — create: Pino with redact
- `src/middleware/async-handler.ts` — create
- `src/schemas/auth.schema.ts` — create
- `src/routes/auth.routes.ts` — create

## Decisions / Scope
- Issue 6 (in-memory store) is explicitly out of scope — demo context only.
- `bcrypt` saltRounds=12, UUID generation, and no-password-in-response are already correct — no changes needed.
- Auth controller stays at root for now; logger import path will be adjusted to match its current location.
