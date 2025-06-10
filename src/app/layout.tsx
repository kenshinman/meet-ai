import type {Metadata} from "next";
import {Inter} from "next/font/google";
import "./globals.css";
import {TRPCReactProvider} from "@/trpc/client";

const inter = Inter({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "MeetAI | Meet with your favorite chatbots",
  description: "Your meeting with AI Chatbots",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <TRPCReactProvider>
      <html lang="en">
        <body className={`${inter.className} antialiased`}>{children}</body>
      </html>
    </TRPCReactProvider>
  );
}
