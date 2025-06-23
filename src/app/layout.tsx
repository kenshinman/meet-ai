import type {Metadata} from "next";
import {Inter} from "next/font/google";
import {NuqsAdapter} from "nuqs/adapters/next/app";
import "./globals.css";
import {TRPCReactProvider} from "@/trpc/client";
import {Toaster} from "@/components/ui/sonner";

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
    <html lang="en">
      <body className={`${inter.className} antialiased`}>
        <NuqsAdapter>
          <TRPCReactProvider>
            <Toaster />
            {children}
          </TRPCReactProvider>
        </NuqsAdapter>
      </body>
    </html>
  );
}
