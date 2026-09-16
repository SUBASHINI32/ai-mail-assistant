import type { Metadata } from "next";
import "./globals.css";
import { MailProvider } from "@/lib/context";
import { MailLayout } from "@/components/MailLayout";

export const metadata: Metadata = {
  title: "AI Mail - Autonomous Mail Client",
  description: "AI Mail Assistant that controls the Mail UI via structured actions",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="h-full">
      <body className="h-full antialiased overflow-hidden">
        <MailProvider>
          <MailLayout>{children}</MailLayout>
        </MailProvider>
      </body>
    </html>
  );
}
