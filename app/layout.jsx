import { Analytics } from "@vercel/analytics/next";
import { Jost } from "next/font/google";
import "./globals.css";
import { ClerkProvider } from "@clerk/nextjs";
import { Toaster } from "@/components/ui/sonner";
import "../styles/colors.css"
const jost = Jost({
  subsets: ["latin"],
  variable: "--font-sans",
  display: "swap",
});

export const metadata = {
  title: "Rozana Bazar - Admin Dashboard",
  description: "Professional Admin Dashboard for Rozana Bazar",
};

export default function RootLayout({ children }) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className={`${jost.variable} font-sans antialiased bg-gray-50`}>
        <ClerkProvider
          publishableKey={process.env.NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY}
        >
          {children}
          <Analytics />
          <Toaster />
        </ClerkProvider>
      </body>
    </html>
  );
}
