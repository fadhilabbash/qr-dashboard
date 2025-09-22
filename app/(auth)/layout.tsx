import type { Metadata } from "next";
import { Alexandria } from "next/font/google";
import "../globals.css";

const alexandria = Alexandria({
  weight: ["300", "400", "500", "700", "700"],
  subsets: ["arabic"],
});

export const metadata: Metadata = {
  title: "لوحة التحكم ",
  description: "لوحة تحكم مركز القمر",
};

export default async function AuthLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" dir="rtl">
      <body className={alexandria.className}>{children}</body>
    </html>
  );
}
