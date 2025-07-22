import AdminPanelLayout from "@/components/dashboard/admin-panel-layout";
import { Toaster } from "@/components/ui/sonner";
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
  title: "Conflict Detection Buffer | Dashboard",
  description: "This is the dashboard page for the Conflict Detection Buffer",
};

export default function DashboardLayout({
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
        <Toaster position="top-center" richColors closeButton />
        <body className={`${poppins.variable} antialiased`}>
          <AdminPanelLayout>{children}</AdminPanelLayout>
        </body>
      </ThemeProvider>
    </html>
  );
}
