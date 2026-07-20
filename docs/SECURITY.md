# Security Practices

TrackLancer incorporates multiple security layers, from Edge middleware guards to database-level constraints.

## Authentication & Authorization

- **Authentication Setup**: Powered by `better-auth`. Employs passwordless-style email OTP verification to prevent unauthorized account creation. Passwords are securely hashed by the `better-auth` adapter before database insertion.
- **OTP Security**: One-Time Passwords have a strict 10-minute expiry window, are limited to 5 verification attempts to prevent brute-forcing, and are stored as hashed strings in the database.
- **Authorization**: Protected routes utilize dual-layer guarding:
  1. `proxy.ts` Edge Middleware prevents unauthorized page loads.
  2. The `requireRole()` utility enforces role checks (`FREELANCER` vs `CLIENT`) directly inside server controllers, ensuring API and Server Action integrity even if middleware is bypassed.

## Data Validation & Input Sanitization

- **Strict Validation**: All data mutation payloads (whether via REST API or Next.js Server Actions) are aggressively validated against rigorous **Zod** schemas (located in `app/lib/validations/`) before reaching business logic. Furthermore, all controller error responses are strictly sanitized to prevent backend system details from leaking to the frontend.
- **SQL Injection Prevention**: TrackLancer exclusively uses Prisma ORM. Prisma automatically parameterizes all queries, neutralizing SQL injection vectors.
- **XSS Protection**: React's native string interpolation automatically escapes HTML entities, neutralizing most Cross-Site Scripting (XSS) vectors. (Note: Email templates are generated as raw HTML, but this generation happens entirely server-side using trusted data).
- **CSRF Protection**: Handled automatically by `better-auth` endpoints. The `BETTER_AUTH_TRUSTED_ORIGINS` environment variable must be strictly configured to prevent Cross-Site Request Forgery.

## Session & Secrets Management

- **Secrets Handling**: All sensitive keys (Database URLs, Auth secrets, API keys) are strictly managed via environment variables. The `.env` file is heavily `.gitignore`d.
- **Session Revocation**: User sessions track originating IP addresses and User-Agent strings. Users have full visibility into their active sessions via the Settings page and can instantly revoke compromised sessions.
- **Cron Protection**: The `POST /api/cron/cleanup` endpoint, which executes destructive data pruning, is protected via a required Bearer token matching the `CRON_SECRET` environment variable.

## Network & Protocol Security

- **Anti-Enumeration Registration**: The `/api/user/register` endpoint acts as a server-side proxy wrapper around the `better-auth` sign-up logic. It securely checks user existence and halts unnecessary downstream OTP emails if an account already exists, but always returns a generic `200 OK` response to the client. This completely eliminates email enumeration vulnerabilities via network inspection.
- **Security Headers**: Strict security headers are enforced globally via `next.config.ts`, including:
  - `Content-Security-Policy-Report-Only` (CSP)
  - `Strict-Transport-Security` (HSTS) with `preload` and `includeSubDomains`
  - `X-Frame-Options: DENY`
  - `Permissions-Policy` to restrict device hardware APIs
- **Safe Allowed Origins**: CORS and proxy origins are dynamically and securely injected via `BETTER_AUTH_TRUSTED_ORIGINS` and `NEXT_CONFIG_ALLOWEDORIGINS` environment variables, avoiding any hardcoded IP addresses in source control.

## Best Practices for Deployment

- Always enforce `HTTPS` in production.
- Rotate `BETTER_AUTH_SECRET` and `CRON_SECRET` periodically.
- Monitor Vercel logs for repeated failed login or OTP attempts indicating automated abuse.
