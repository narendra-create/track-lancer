// Payment status
export type PastProjectPaymentStatus = "PAID" | "DUE" | "UNPAID";

// Freelancer branch — single project item
export type FreelancerPastProject = {
    id: string;
    title: string;
    paymentStatus: PastProjectPaymentStatus;
    clientName: string;
    clientEmail: string;
    paidAmount: number;
    completionDate: string;
};

// Client branch — single project item
export type ClientPastProject = {
    id: string;
    title: string;
    paymentStatus: PastProjectPaymentStatus;
    freelancerName: string;
    freelancerEmail: string;
    paidAmount: number;
    completionDate: string;
};

// Success responses
type FreelancerPastProjectsSuccess = {
    success: true;
    projects: FreelancerPastProject[];
    nextCursor: string | null;
};

type ClientPastProjectsSuccess = {
    success: true;
    projects: ClientPastProject[];
    nextCursor: string | null;
};

// Error response
type PastProjectsError = {
    success: false;
    error: string;
    status: number;
};

// Full response types
export type FreelancerPastProjectsResponse = FreelancerPastProjectsSuccess | PastProjectsError;
export type ClientPastProjectsResponse = ClientPastProjectsSuccess | PastProjectsError;
