import type { Metadata } from "next";
import { Poppins } from "next/font/google";
import "../globals.css";
import { ThemeProvider } from "@/lib/theme-provider";
import AdminPanelLayout from "@/components/dashboard/admin-panel-layout";

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
        <AdminPanelLayout>
          <body className={`${poppins.variable} antialiased`}>{children}</body>
        </AdminPanelLayout>
      </ThemeProvider>
    </html>
  );
}
