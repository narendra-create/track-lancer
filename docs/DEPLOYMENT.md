# Deployment Guide

MileGlide is optimized for deployment on Vercel, leaning heavily into Next.js App Router features and Edge middleware.

## Prerequisites

- **Node.js**: v20 or higher.
- **Database**: A PostgreSQL instance. Neon (Serverless Postgres) is highly recommended for compatibility with Prisma's Edge adapters.
- **Email Service**: A verified Resend account.
- **Platform**: Vercel (recommended) or any Next.js compatible hosting environment.

## Environment Variables

Ensure the following environment variables are securely added to your production environment:

| Variable | Description | Example |
|---|---|---|
| `DATABASE_URL` | PostgreSQL connection string with pooling | `postgresql://user:pass@ep-host.region.aws.neon.tech/neondb?sslmode=require` |
| `BETTER_AUTH_SECRET` | Cryptographically secure random string | `generate-via-openssl-rand-hex-32` |
| `BETTER_AUTH_URL` | The canonical URL of your deployed app | `https://mileglide.com` |
| `BETTER_AUTH_TRUSTED_ORIGINS` | Comma-separated allowed origins (Optional) | `https://mileglide.com,https://www.mileglide.com` |
| `RESEND_API_KEY` | Production API key from Resend | `re_123456789...` |
| `RESEND_FROM_EMAIL` | Sender email domain (Must be verified in Resend) | `MileGlide <noreply@mileglide.com>` |
| `CRON_SECRET` | Secret token to authorize automated cleanup jobs | `secure_cron_token_xyz` |

## Build and Deployment Steps

MileGlide does not currently use Docker or complex CI/CD pipelines. It relies on standard Node.js build processes.

1. **Install Dependencies**:
   ```bash
   npm ci
   ```
2. **Generate Prisma Client**:
   This generates the tailored Prisma client specifically to `app/generated/prisma`.
   ```bash
   npx prisma generate
   ```
3. **Apply Migrations**:
   Run this during the build phase to ensure the database schema is up-to-date.
   ```bash
   npx prisma migrate deploy
   ```
4. **Build the Next.js Application**:
   ```bash
   npm run build
   ```
5. **Start Production Server**:
   *(If not utilizing Vercel's managed serverless deployment)*
   ```bash
   npm start
   ```

## Cron Job Configuration

MileGlide requires a periodic cron job to prune stale database entries (activities older than 7 days, pending projects older than 30 days).

If deploying on Vercel, setup a `vercel.json` cron configuration. Otherwise, configure an external scheduler (like GitHub Actions or AWS EventBridge) to send a `POST` request to:

`POST https://<your-domain>/api/cron/cleanup`

**Headers Required**:
```json
{
  "Authorization": "Bearer <YOUR_CRON_SECRET>"
}
```

## Troubleshooting

- **Prisma Client Issues**: MileGlide uses the `@prisma/adapter-pg` and exports generated files to a custom directory (`app/generated/prisma`). If Vercel builds fail claiming "PrismaClient is not defined", ensure the `postinstall` script or Vercel build command explicitly runs `npx prisma generate`.
- **Authentication Failures on Production**: Verify that `BETTER_AUTH_URL` exactly matches your production domain (including `https://`). Ensure `BETTER_AUTH_SECRET` is identical across all environments.
- **Database Connection Limits**: If using Neon, ensure you are utilizing the pooled connection string (often ending in `?pgbouncer=true` or utilizing connection pooling at the Neon dashboard level) to prevent Vercel Serverless functions from exhausting connection limits.
