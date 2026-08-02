import { Metadata } from "next";

export const metadata: Metadata = {
  title: "(public) Contact | Instant Tool",
  description: "(public) Contact page for Instant Tool.",
};

export default function Layout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
