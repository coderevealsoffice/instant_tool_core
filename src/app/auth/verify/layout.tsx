import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Auth Verify | Instant Tool",
  description: "Auth Verify page for Instant Tool.",
};

export default function Layout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
