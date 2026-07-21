# Performance & Optimization

MileGlide relies heavily on Next.js 16 optimizations and efficient database querying to maintain a responsive user experience. 

## Rendering Strategy

- **Server Components (SSR)**: Approximately 29 core components (layouts, dashboard frames, un-interactive cards) render entirely on the server. This reduces client bundle size and drastically improves First Contentful Paint (FCP).
- **Client Components (CSR)**: Approximately 38 components utilize the `"use client"` directive. These are reserved strictly for interactive elements (forms, modals, toast notifications, chart rendering).
- **Dynamic Rendering**: MileGlide is highly dynamic; data changes frequently based on role and active projects. As such, Static Site Generation (SSG) and Incremental Static Regeneration (ISR) are currently not utilized.

## Caching Layers

- **Request Deduplication**: `React.cache()` wraps the core `getSession()` function, ensuring that even if 10 different components require the user's session data during a single render cycle, only one database query is executed.
- **Client-Side Polling**: SWR is used heavily by Client Components (especially the Activity feed). SWR caches data locally and intelligently revalidates in the background, keeping the UI snappy while reducing server load.

## Data Fetching & Aggregation

- **Batch Fetching Pattern**: Heavy dashboard views require data from multiple tables. Rather than utilizing waterfall requests, MileGlide employs specialized Server Actions (`FreelancerDashboardStats.ts` and `ClientDashboardStats.ts`) that execute concurrent queries using `Promise.all()`.
- **Cursor-Based Pagination**: Used exclusively across the platform (Activity logs, Project lists, Payment histories). Unlike offset-based pagination (`SKIP 50000 LIMIT 10`), cursor-based pagination uses an indexed anchor (`WHERE id > cursor LIMIT 10`), guaranteeing constant `O(1)` query performance regardless of database size. Page sizes are tightly constrained (4 to 25 items depending on the view).

## Database Optimizations

- **Indexing**: Over 15 indexes exist across the database. High-traffic relational foreign keys (`userId`, `projectId`) and status enums (`payment_status`, `Projectstatus`) are explicitly indexed to ensure complex filtered queries remain performant.
- **Automated Pruning**: A secured cron job endpoint (`/api/cron/cleanup`) aggressively deletes `Activity` notifications older than 7 days and unaccepted `PENDING` projects older than 30 days, preventing database bloat.
- **Data Selection**: Prisma queries utilize strict `select` and `include` blocks to prevent over-fetching unused columns.

## Current Bottlenecks & Suggested Improvements

> [!TIP]
> The following areas represent the highest-yield opportunities for performance optimization as the user base scales.

1. **Absence of a Caching Tier**: MileGlide currently lacks a Redis or Memcached layer. Every data request hits PostgreSQL. Implementing caching for heavy aggregate queries (like Dashboard Stats) will be necessary at scale.
2. **Chart Data Generation**: Revenue chart arrays are dynamically calculated via SQL groupings on every single dashboard load. Materializing this view or caching the result nightly would dramatically reduce DB CPU load.
3. **Raw SQL Usage**: The `clientController.ts` uses raw SQL (`$queryRaw`) to count distinct clients. This bypasses Prisma's internal optimizations and should ideally be rewritten using Prisma Aggregates if supported.
4. **Connection Pooling**: Due to the serverless nature of Next.js API routes, database connections can be exhausted rapidly. Utilizing Neon's built-in PgBouncer pooling is critical.
