import type { Metadata, Viewport } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import { PackProvider } from "@/lib/pack-context";
import { AuthProvider } from "@/lib/auth/auth-context";
import { FeedbackButton } from "@/components/feedback/FeedbackButton";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "Dynamic Sustainability Credentials Platform",
  description:
    "Internal credentials platform spanning Transition Strategy, Sustainability Value Creation, Circular Value Creation, and Resilience & Adaptation. Search and filter cases, experts, partners, and publications.",
};

export const viewport: Viewport = {
  colorScheme: "light",
  themeColor: "#ffffff",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className="light bg-background">
      {/* suppressHydrationWarning: browser extensions (e.g. Grammarly) inject
          data-* attributes onto <body> after SSR, causing a harmless mismatch.
          This suppresses the React warning without affecting rendering. */}
      <body className={`${inter.className} antialiased`} suppressHydrationWarning>
        <AuthProvider>
          <PackProvider>
            {children}
            <FeedbackButton />
          </PackProvider>
        </AuthProvider>
      </body>
    </html>
  );
}
