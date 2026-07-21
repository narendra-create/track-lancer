import type { Metadata } from 'next';

export const metadata: Metadata = {
  robots: {
    index: false,
    follow: false,
  },
};

export default function AuthLayout({ children }: { children: React.ReactNode }) {
  // It just passes the page content through, but attaches the hidden noindex metadata
  return <>{children}</>;
}