# MileGlide API & Controllers Reference

This document outlines the API Routes and the internal Controller methods that drive the business logic of MileGlide.

## 1. REST API Routes

### 1.1 Auth (Catch-All)
- **Route**: `GET, POST /api/auth/[...all]`
- **Purpose**: Fully managed by `better-auth`. Handles sign-up, sign-in, sign-out, email verification, and password resets.
- **Auth**: Handled internally.

### 1.2 Activity Feed
- **Route**: `GET /api/activity`
- **Query Params**: `?since=<ISO datetime>` (optional)
- **Auth**: Valid session required (`CLIENT` or `FREELANCER` role).
- **Controller**: `activityController.getActivitys(since)`
- **Response Success**: 
  ```json
  {
    "data": [
      {
        "id": "cuid",
        "type": "PAYMENT",
        "message": "Payment verified",
        "highlightmessage": "₹10,000",
        "dateTimeofMessage": "2026-07-20T10:00:00Z",
        "projectId": "proj_cuid",
        "project": { "title": "E-commerce App" },
        "createdAt": "2026-07-20T10:00:00Z"
      }
    ]
  }
  ```
- **Details**: Excludes notification types blocked by the user. Hard limit of 25 results, ordered by `createdAt` descending.

### 1.3 Cron Cleanup
- **Route**: `POST /api/cron/cleanup`
- **Auth**: Bearer token required matching the `CRON_SECRET` environment variable.
- **Purpose**: Deletes activities older than 7 days and `PENDING` projects older than 30 days.
- **Response Success**: `{ "success": true, "deletedActivities": 142, "deletedProjects": 3 }`

### 1.4 Profile Creation
- **Route**: `POST /api/profile/create`
- **Auth**: Valid session required.
- **Body**: `{ "category": "WEB_DEV" }` (Category is optional/null for clients)
- **Purpose**: Initializes the `Userprofile` or `Freelancer` record in the database immediately post-registration.
- **Response Success**: `{ "data": ProfileObject }` (Status 201)

### 1.5 Check Email Availability
- **Route**: `POST /api/user/check-email`
- **Auth**: None (Public)
- **Body**: `{ "email": "user@example.com" }`
- **Purpose**: Used during registration to validate email availability in real-time.
- **Response Success**: `{ "exists": false }` OR `{ "exists": true, "verified": true }`

---

## 2. Internal Controllers (Business Logic)

Controllers are located in `app/lib/controllers/` and are typically invoked by Server Actions or Server Components. They follow a standard response pattern: `{ success: boolean, data?: any, error?: string, status: number }`.

### 2.1 Project Controller (`ProjectController.ts`)
Handles the complete lifecycle of a project.

- **`createNewProject(input)`**: (FREELANCER) Validates via Zod. Creates a `PENDING` project and generates an 8-character unique sharing code.
- **`acceptProject(projectCode)`**: (CLIENT) Claims a `PENDING` project using the 8-char code. Changes status to `ACTIVE` and notifies the freelancer.
- **`getAllProjects(profileid, role, cursor?)`**: Fetches paginated active projects with milestone progress and payment summaries.
- **`getPastProjects(role, profileid, cursor?)`**: Fetches `COMPLETED` or `CANCELLED` projects. Calculates ongoing payment statuses (`PAID`/`DUE`/`UNPAID`).
- **`deleteProject(freelancerId, projectId)`**: (FREELANCER) Permanently deletes a project, provided no milestones or payments exist.
- **`markProjectCompleted(projectId)`**: (FREELANCER) Marks a project as `COMPLETED`. Fails if any milestone is incomplete.
- **`raiseCancellRequest(projectId)`**: Initiates a mutual cancellation request. If the counterparty previously initiated one, this approves it, triggering a database transaction that marks the project `CANCELLED`.
- **`processCancellRequest(projectId, type)`**: Approves or rejects an open cancellation request.
- **`resumeProject(projectId)`**: (CLIENT) Moves a `STOPPED` project back to `ACTIVE`, promoting paused milestones back into the queue.

### 2.2 Milestone Controller (`milestoneController.ts`)
Manages project deliverables.

- **`createMilestone(input)`**: (FREELANCER) Validates that requested cost doesn't exceed the remaining project budget. Auto-assigns positions. Sets the first milestone to `IN_PROGRESS`, subsequent ones to `NOT_STARTED`.
- **`delayMilestone(input)`**: (FREELANCER) Extends a milestone's deadline. **Crucially, uses a transaction to cascade deadline shifts to all subsequent milestones to prevent chronological overlap.** Rate-limited by a 5-minute cooldown.
- **`markMilestoneCompleted(...)`**: (FREELANCER) Marks `COMPLETED`, promotes the next milestone to `IN_PROGRESS`, and triggers an upsert on the `Payment` table (increments total due, sets due date to +7 days).
- **`stopProject(projectId)`**: (CLIENT) Pauses the project. All `NOT_STARTED` and `IN_PROGRESS` milestones are marked `STOPPED`.

### 2.3 Payment Controller (`paymentController.ts`)
Manages the manual UPI payment verification workflow.

- **`initiatePayment(input)`**: (CLIENT) Submits a UPI transaction ID (txn_number) and amount. Creates a `Paymentverification` record with status `PENDING_VERIFICATION`.
- **`markVerifiedPayment(verificationId)`**: (FREELANCER) Approves the transaction. A database transaction updates the verification status, increments the `paid_amount` on the main `Payment` record, and marks the overall payment `PAID` if the balance is cleared.
- **`markRejectPayment(verificationId)`**: (FREELANCER) Rejects the transaction. Sends a `WARNING` activity notification to the client.

### 2.4 Budget Controller (`BudgetController.ts`)
Handles requests to increase the project's agreed cost.

- **`raiseBudgetRequest(input)`**: (FREELANCER) Proposes a budget increase with justification.
- **`processRequest(budgetId, status)`**: (CLIENT) Approves or rejects. If approved, a transaction automatically updates the underlying Project's `agreedCost`.

### 2.5 Profile & Dashboard Controllers
- **`profileController.ts`**: Handles fetching and updating user profiles, including strict regex validation for Freelancer UPI IDs.
- **Batch Fetchers (`ClientDashboardStats.ts`, `FreelancerDashboardStats.ts`)**: Utilizes `Promise.all()` to concurrently fetch aggregate statistics (total earnings, active projects, revenue charts, upcoming deadlines) for rendering dashboards.
