import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Login | Instant Tool",
  description: "Login to your Instant Tool account to access premium features and manage your files.",
};

export default function LoginLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <>{children}</>;
}
