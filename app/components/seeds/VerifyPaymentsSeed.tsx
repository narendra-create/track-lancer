import type { VerifyPaymentType } from "@/types/verifypayments";

export const DUMMY_VERIFICATIONS: VerifyPaymentType[] = [
  {
    id: "verif_001",
    txn_number: "TXN-98765432101",
    paymentid: "pay_001",
    paid_amount: 15000,
    imageurl: "https://images.unsplash.com/photo-1554224155-6726b3ff858f?w=800&q=80",
    freelancerId: "free_123",
    clientId: "client_456",
    Payment: {
      due_date: new Date(new Date().setDate(new Date().getDate() - 2)),
      project: {
        title: "E-Commerce Platform Redesign"
      }
    },
    client: {
      user: {
        name: "Acme Corp"
      }
    },
    freelancer: {
      user: {
        name: "Jane Smith"
      }
    }
  },
  {
    id: "verif_002",
    txn_number: "TXN-11223344556",
    paymentid: "pay_002",
    paid_amount: 8500,
    imageurl: null, // No screenshot provided
    freelancerId: "free_123",
    clientId: "client_789",
    Payment: {
      due_date: new Date(new Date().setDate(new Date().getDate() + 5)),
      project: {
        title: "Brand Identity & Logo"
      }
    },
    client: {
      user: {
        name: "Startup Inc."
      }
    },
    freelancer: {
      user: {
        name: "Jane Smith"
      }
    }
  },
  {
    id: "verif_003",
    txn_number: "TXN-55667788990",
    paymentid: "pay_003",
    paid_amount: 45000,
    imageurl: "https://images.unsplash.com/photo-1616077168712-fc6c788db4af?w=800&q=80",
    freelancerId: "free_123",
    clientId: "client_101",
    Payment: {
      due_date: new Date(new Date().setDate(new Date().getDate() - 10)),
      project: {
        title: "Mobile App MVP"
      }
    },
    client: {
      user: {
        name: "Tech Solutions LLC"
      }
    },
    freelancer: {
      user: {
        name: "Jane Smith"
      }
    }
  }
];
