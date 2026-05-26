---
id: best-practices
title: Security Best Practices
sidebar_label: Best Practices
description: Security guidelines for node-demo and Express/Node.js APIs in general — OWASP-aligned.
---

# Security Best Practices

## OWASP Top 10 Alignment

| OWASP Risk | Mitigation in node-demo |
|---|---|
| A01 Broken Access Control | Use `requireAuth` middleware on protected routes |
| A02 Cryptographic Failures | bcrypt for passwords; never store plaintext |
| A03 Injection | Validate all input; use parameterised queries for DB |
| A04 Insecure Design | Layered architecture; validate at boundaries |
| A05 Security Misconfiguration | Helmet.js; no `*` CORS in production |
| A06 Vulnerable Components | `npm audit`; keep dependencies updated |
| A07 Auth & Session Failures | Generic error messages; bcrypt; JWT with expiry |
| A08 Software & Data Integrity | Verify `npm ci` in CI; lock file committed |
| A09 Logging & Monitoring | Pino structured logs; never log secrets |
| A10 SSRF | Validate URLs before outbound requests |

---

## HTTP Security Headers

Install and use **Helmet.js** to set security headers automatically:

```bash
npm install helmet
```

```typescript title="src/app.ts"
import helmet from 'helmet';
app.use(helmet());
```

Headers set by Helmet:

| Header | Purpose |
|---|---|
| `Content-Security-Policy` | Prevents XSS |
| `X-Frame-Options` | Prevents clickjacking |
| `X-Content-Type-Options` | Prevents MIME sniffing |
| `Strict-Transport-Security` | Enforces HTTPS |
| `Referrer-Policy` | Controls referrer info |

---

## CORS

Never use `*` in production:

```typescript
// ❌ Development only
app.use(cors());

// ✅ Production
import cors from 'cors';
app.use(cors({
  origin: ['https://your-frontend.com'],
  methods: ['GET', 'POST', 'PUT', 'DELETE'],
  allowedHeaders: ['Content-Type', 'Authorization'],
}));
```

---

## Rate Limiting

Protect auth endpoints from brute-force attacks:

```bash
npm install express-rate-limit
```

```typescript title="src/middleware/rate-limiter.ts"
import rateLimit from 'express-rate-limit';

export const authRateLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 20,                   // 20 attempts per window
  standardHeaders: true,
  legacyHeaders: false,
  message: { error: 'Too many requests, please try again later.' },
});
```

Apply to auth routes:

```typescript
router.post('/auth/login', authRateLimiter, login);
router.post('/auth/register', authRateLimiter, register);
```

---

## Input Validation

Always validate and sanitise at the request boundary before any business logic runs:

```typescript
// ✅ Validate type, presence, and format
const createUserSchema = z.object({
  email: z.string().trim().email(),
  name: z.string().trim().min(1).max(100),
});

// ✅ Use safeParse to avoid throwing
const result = createUserSchema.safeParse(req.body);
if (!result.success) {
  return res.status(400).json({ error: result.error.flatten() });
}
```

---

## Secrets Management

| Rule | Detail |
|---|---|
| Never commit secrets | Add `.env` to `.gitignore` |
| Never log secrets | Pino must not receive tokens, passwords, or keys |
| Rotate on leak | If a secret is accidentally committed, rotate it immediately |
| Use env variables | Read from `process.env` only in `src/config.ts` |

### Scanning for leaked secrets

```bash
# GitHub secret scanning is enabled by default on public repos
# For local pre-commit scanning, use git-secrets or gitleaks:
npx gitleaks detect --source .
```

---

## Dependency Auditing

```bash
# Check for known vulnerabilities
npm audit

# Auto-fix low/moderate issues
npm audit fix
```

Run `npm audit` in CI and fail the build if critical vulnerabilities are found:

```yaml title=".github/workflows/ci.yml"
- name: Audit dependencies
  run: npm audit --audit-level=high
```

---

## Production Checklist

Before deploying to production, verify:

- [ ] `NODE_ENV=production` is set
- [ ] Helmet.js is applied
- [ ] CORS is restricted to known origins
- [ ] Rate limiting is on auth endpoints
- [ ] All secrets are in environment variables (not code)
- [ ] `npm audit` passes with no high/critical issues
- [ ] HTTPS is enforced (via reverse proxy)
- [ ] Logs do not contain PII or secrets
- [ ] JWT secret is at least 256 bits (32 bytes)
- [ ] bcrypt salt rounds ≥ 12

---

## What NOT to Do

```typescript
// ❌ Logging passwords
logger.info({ password }, 'Login attempt');

// ❌ Returning stack traces to clients
res.status(500).json({ error: err.stack });

// ❌ Wildcard CORS in production
app.use(cors({ origin: '*' }));

// ❌ Storing plaintext passwords
users.set(email, { password });

// ❌ Hardcoded secrets
const jwtSecret = 'my-secret-key';
```
