import type { Metadata } from "next";
import { Alexandria } from "next/font/google";
import "../globals.css";
import {
  SidebarInset,
  SidebarProvider,
  SidebarTrigger,
} from "@/components/ui/sidebar";
import { AppSidebar } from "@/components/base/sidebar/app-sidebar";
import DynamicBreadcrumbs from "@/components/base/dynamic-breadcrumbs ";
import { Separator } from "@/components/ui/separator";
import { SessionProvider } from "next-auth/react";
import { Toaster } from "sonner";
const alexandria = Alexandria({
  weight: ["300", "400", "500", "700", "700"],
  subsets: ["arabic"],
});

export const metadata: Metadata = {
  title: "لوحة التحكم ",
  description: "لوحة تحكم مركز القمر",
};

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="ar" dir="rtl">
      <body className={alexandria.className}>
        <SessionProvider>
          <SidebarProvider>
            <AppSidebar />
            <SidebarInset>
              <header className="flex h-16 shrink-0 items-center gap-2 transition-[width,height] ease-linear group-has-[[data-collapsible=icon]]/sidebar-wrapper:h-12">
                <div className="flex items-center gap-2 px-4">
                  <SidebarTrigger />
                  <Separator orientation="vertical" className="-mr-2 h-4" />
                  <DynamicBreadcrumbs />
                </div>
              </header>
              {children}
            </SidebarInset>
          </SidebarProvider>
          <Toaster />
        </SessionProvider>
      </body>
    </html>
  );
}
