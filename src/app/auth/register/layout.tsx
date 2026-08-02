import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Register | Instant Tool",
  description: "Create a free account on Instant Tool to access unlimited file conversions, PDF tools, and more.",
};

export default function RegisterLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <>{children}</>;
}
