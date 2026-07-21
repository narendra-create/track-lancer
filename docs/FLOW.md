# Application Workflows

This document outlines the core end-to-end flows within MileGlide using Mermaid sequence diagrams.

## 1. User Registration Flow

```mermaid
sequenceDiagram
    participant User
    participant Form as RegisterForm
    participant API as /api/user/check-email
    participant Auth as authClient
    participant Resend as Resend (Email)
    participant Profile as /api/profile/create

    User->>Form: Submit Details
    Form->>API: Validate Email Availability
    API-->>Form: Email Available
    Form->>Auth: signUp.email()
    Auth->>Resend: sendVerificationOtp()
    Resend-->>User: Delivers OTP Email
    User->>Form: Submits 6-digit OTP
    Form->>Auth: verifyEmail(otp)
    Auth-->>Form: Success (Auto sign-in)
    Form->>Profile: POST Create Profile (Client/Freelancer)
    Profile-->>Form: 201 Created
    Form-->>User: Redirect to /dashboard
```

## 2. Project Creation & Acceptance

```mermaid
sequenceDiagram
    participant Freelancer
    participant Sys as ProjectController
    participant Client
    
    Freelancer->>Sys: Submit NewProjectForm (Title, Cost, Deadline)
    Sys->>Sys: Generate 8-char projectCode
    Sys-->>Freelancer: Return Code (Status: PENDING)
    
    Note over Freelancer,Client: Freelancer shares Code via WhatsApp/Email
    
    Client->>Sys: Submit AcceptProject (Enter Code)
    Sys->>Sys: Validates Code & Assigns Client
    Sys->>Sys: Status -> ACTIVE
    Sys-->>Freelancer: Create Activity (Project Accepted)
    Sys-->>Client: Success
```

## 3. Milestone Lifecycle

```mermaid
sequenceDiagram
    participant Freelancer
    participant Sys as milestoneController
    participant Client
    
    Freelancer->>Sys: Create Milestone 1
    Sys->>Sys: Validates Cost & Sets IN_PROGRESS
    
    Freelancer->>Sys: Create Milestone 2
    Sys->>Sys: Sets NOT_STARTED
    
    Client->>Sys: Stop Project
    Sys->>Sys: Status -> STOPPED
    Sys-->>Freelancer: Notification (Project Paused)
    
    Client->>Sys: Resume Project
    Sys->>Sys: Status -> ACTIVE
    
    Freelancer->>Sys: Delay Milestone 1 (+2 days)
    Sys->>Sys: Update Milestone 1 Deadline
    Sys->>Sys: Cascade +2 days to Milestone 2 (Transaction)
    Sys-->>Client: Notification (Deadline Extended)
    
    Freelancer->>Sys: Mark Milestone 1 Completed
    Sys->>Sys: Set Milestone 1 COMPLETED
    Sys->>Sys: Set Milestone 2 IN_PROGRESS
    Sys->>Sys: Upsert Payment Record (Increments total_cost)
    Sys-->>Client: Notification (Deliverable Ready)
```

## 4. Payment Verification Flow

```mermaid
sequenceDiagram
    participant Client
    participant Sys as paymentController
    participant Freelancer
    
    Note over Client: Client scans Freelancer's UPI QR Code externally
    Client->>Client: Completes Bank Transfer
    
    Client->>Sys: initiatePayment (txn_number, amount)
    Sys->>Sys: Creates Paymentverification (PENDING)
    Sys-->>Freelancer: Notification (Payment Submitted)
    
    Freelancer->>Sys: Checks Bank App for txn_number
    alt Payment Received
        Freelancer->>Sys: markVerifiedPayment()
        Sys->>Sys: VERIFIED, Increments paid_amount
        Sys-->>Client: Notification (Payment Verified)
    else Invalid Transaction
        Freelancer->>Sys: markRejectPayment()
        Sys->>Sys: REJECTED
        Sys-->>Client: Notification (WARNING: Payment Rejected)
    end
```

## 5. Mutual Cancellation Flow

```mermaid
sequenceDiagram
    participant UserA as Initiating Party
    participant Sys as ProjectController
    participant UserB as Receiving Party
    
    UserA->>Sys: raiseCancellRequest(projectId)
    Sys->>Sys: Create CancellRequest (A_Approved=true, B_Approved=false)
    Sys-->>UserB: Notification (Cancellation Requested)
    
    alt Mutual Agreement
        UserB->>Sys: processCancellRequest(APPROVE)
        Sys->>Sys: Set B_Approved=true
        Sys->>Sys: Project Status -> CANCELLED
    else Disagreement
        UserB->>Sys: processCancellRequest(REJECT)
        Sys->>Sys: Set isRejected=true, Reset Flags
        Sys-->>UserA: Notification (Cancellation Denied)
    end
```
