import { Analytics } from "@vercel/analytics/next";
import { Jost } from "next/font/google";
import "./globals.css";

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
    <html lang="en">
      <body className={`${jost.variable} font-sans antialiased bg-gray-50`}>
          {children}
          <Analytics />
      </body>
    </html>
  );
}
