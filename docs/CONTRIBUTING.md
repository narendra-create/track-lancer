# Contributing Guidelines

MileGlide is a proprietary platform (Copyright 2026 narendra-create). While open-source contributions are not accepted, internal development teams and authorized contractors must adhere to the following guidelines to ensure codebase integrity and maintainability.

## 1. Getting Started

1. Request repository access from the project administrator.
2. Clone the repository locally.
3. Follow the setup steps outlined in `docs/DEVELOPMENT.md`.
4. Ensure you have access to a PostgreSQL development database and a Resend API key.

## 2. Branch Naming Conventions

All work must be conducted on isolated branches. Never commit directly to `main`.

- **Features**: `feature/<issue-number>-<short-description>` (e.g., `feature/14-upi-qr-enhancement`)
- **Bug Fixes**: `fix/<issue-number>-<short-description>` (e.g., `fix/22-dashboard-stats-calc`)
- **Documentation**: `docs/<short-description>` (e.g., `docs/api-updates`)
- **Refactors**: `refactor/<short-description>`

## 3. Commit Guidelines

MileGlide utilizes [Conventional Commits](https://www.conventionalcommits.org/). This standardizes our history and makes tracking regressions easier.

**Format**: `<type>(<scope>): <subject>`

**Allowed Types**:
- `feat`: A new feature.
- `fix`: A bug fix.
- `docs`: Documentation only changes.
- `style`: Changes that do not affect the meaning of the code (white-space, formatting, missing semi-colons, etc).
- `refactor`: A code change that neither fixes a bug nor adds a feature.
- `perf`: A code change that improves performance.
- `test`: Adding missing tests or correcting existing tests.

**Example**: `feat(dashboard): add weekly revenue breakdown to freelancer chart`

## 4. Pull Request (PR) Process

1. Push your branch to the central repository.
2. Open a Pull Request against the `main` branch.
3. **PR Description**: Clearly explain the "Why" and "What" of the change. Link the PR to the relevant issue tracker ID.
4. **UI Changes**: If your PR alters visual components, you MUST include "Before" and "After" screenshots or a screen recording in the PR description.
5. **Database Changes**: If your PR alters the database, ensure your PR includes the generated Prisma migration file (`prisma/migrations/...`).

## 5. Code Review Checklist

Reviewers will check your PR against the following strict criteria:

- **Type Safety**: Are there any `any` types or suppressed TypeScript warnings? (These will be rejected).
- **Validation**: Are all new inputs rigorously validated via Zod?
- **Reuse**: Did you duplicate logic that already exists in `app/lib/utilitys.ts`?
- **Architecture**: Did you place business logic inside a UI component instead of a Controller? (These will be rejected).
- **Security**: Have role guards (`requireRole`) been applied to any new controller methods?

## 6. Issue Reporting

If you discover a bug or wish to propose a feature, create an Issue.

**Bug Reports MUST include**:
- A clear, concise title.
- Exact steps to reproduce the bug.
- Expected vs. Actual behavior.
- Environment details (Browser, OS, local vs. staging).

## 7. Code of Conduct

As an internal team, we operate with mutual respect. Constructive criticism during code reviews is expected; personal attacks are zero-tolerance. Adhere strictly to the architectural standards defined in the `AGENTS.md` and this documentation suite.
