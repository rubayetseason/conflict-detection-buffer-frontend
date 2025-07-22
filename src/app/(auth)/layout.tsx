import AuthClientLayout from "@/components/dashboard/auth-layout";
import { ThemeProvider } from "@/lib/theme-provider";
import type { Metadata } from "next";
import { Poppins } from "next/font/google";
import "../globals.css";

const poppins = Poppins({
  variable: "--font-poppins",
  subsets: ["latin"],
  weight: ["100", "200", "300", "400", "500", "600", "700", "800", "900"],
});

export const metadata: Metadata = {
  title: "Conflict Detection Buffer | Auth",
  description: "This is the auth page for the Conflict Detection Buffer",
};

export default function AuthLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <ThemeProvider
        attribute="class"
        defaultTheme="system"
        enableSystem
        disableTransitionOnChange
      >
        <body className={`${poppins.variable} antialiased`}>
          <AuthClientLayout>{children}</AuthClientLayout>
        </body>
      </ThemeProvider>
    </html>
  );
}
