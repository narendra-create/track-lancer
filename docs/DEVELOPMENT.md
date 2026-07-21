# Development Guide

This document outlines the workflow, conventions, and standards for developing within the MileGlide codebase.

## Local Setup

1. **Clone & Install**:
   ```bash
   git clone <repo>
   cd mileglide
   npm install
   ```
2. **Environment Configuration**:
   Create a `.env` file in the root directory (refer to README for required variables).
3. **Database Initialization**:
   ```bash
   npx prisma generate
   npx prisma migrate dev
   ```
4. **Seed Mock Data (Optional but Recommended)**:
   ```bash
   npm run seed
   ```
5. **Start Development Server**:
   ```bash
   npm run dev
   ```
   *Note: The dev server is configured to run on `0.0.0.0`, making it accessible via your local LAN network (useful for testing on mobile devices).*

## Folder & Routing Conventions

The `app` directory strictly follows Next.js App Router conventions:

- `app/(auth)/`: Unprotected authentication routes.
- `app/(protected)/client/`: Exclusively for users with the `CLIENT` role.
- `app/(protected)/freelancer/`: Exclusively for users with the `FREELANCER` role.
- `app/components/`: Reusable UI. Role-specific components must be placed in `client/` or `freelancer/` subdirectories.
- `app/lib/controllers/`: Contains pure business logic. Files follow a `<Resource>Controller.ts` pattern.
- `app/lib/actions/`: Next.js Server Actions (data mutations invoked from the client).
- `app/lib/validations/`: Zod schemas. Every external input MUST have a schema here.
- `types/`: Comprehensive TypeScript interfaces organized by feature (e.g., `dashboard.ts`, `milestones.ts`).

## Naming Conventions (Current State)

> [!WARNING]
> MileGlide currently contains several legacy naming inconsistencies. When modifying existing code, adhere to the file's current styling. When creating new files, follow the standard conventions.

- **Files**: Use `PascalCase` for React components (`DashboardProject.tsx`), and `camelCase` for utilities/controllers (`milestoneController.ts`).
- **Inconsistencies to note**: 
  - Utilities file is named `utilitys.ts` (instead of `utilities.ts`).
  - Types file is named `activitys.ts`.
  - Enums often contain pluralization errors (`Categorys`, `Projectstatus` vs `ProjectStatus`).
  - Database fields contain typos (e.g., `raiesdByuserId` in `CancellRequest`).

## Code Style & Standards

1. **Strict TypeScript**: Do not use `any`. Resolve type warnings. Use the `types/` directory for defining complex interfaces before implementing them.
2. **No Extraneous Comments**: The codebase relies on self-documenting, descriptive variable and function names. Only use comments for outlining major logic sections or explaining non-obvious workarounds.
3. **Utility Reuse**: Before writing helper functions (e.g., date formatting, currency parsing), check `app/lib/utilitys.ts` to see if a method already exists.
4. **Data Fetching**: All complex queries must be abstracted into Controllers (`app/lib/controllers`). UI components should never directly query Prisma.

## Feature Implementation Workflow

When adding a new feature, follow this vertical slice methodology:

1. **Database**: Update `prisma/schema.prisma` and run `npx prisma migrate dev`.
2. **Types**: Define the expected data structures in the `types/` folder.
3. **Validation**: Create rigorous Zod schemas in `app/lib/validations/`.
4. **Controller**: Write the core business logic (CRUD operations, transaction wrapping) in `app/lib/controllers/`.
5. **API/Action**: Expose the controller logic via a Server Action (`app/lib/actions/`) or REST endpoint (`app/api/`).
6. **Component**: Build the interactive React component (`app/components/`).
7. **Page**: Integrate the component into the appropriate route within `app/`.

## Debugging Tips

- Use standard Browser DevTools and the Next.js Error Overlay for client-side issues.
- Run `npx prisma studio` to open a local web interface for directly inspecting and manipulating your PostgreSQL development database.
