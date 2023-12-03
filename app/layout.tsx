import type { Metadata } from "next";
import { Open_Sans } from "next/font/google";
import { cn } from "@/lib/utils";

import "./globals.css";
import { ModalProvider } from "@/components/providers/modal-provider";
const font = Open_Sans({ subsets: ["latin"] });

const MainLayout = async ({ children }: { children: React.ReactNode }) => {
  return (
    <html lang="tr" suppressHydrationWarning={true}>
      <body
        className={cn(
          font.className,
          `
       bg-white dark:bg-[#313338]
       `
        )}
      >
        {children}
        <ModalProvider />
      </body>
    </html>
  );
};

export default MainLayout;
