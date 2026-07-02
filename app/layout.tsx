
import type { Metadata } from "next";
import "./globals.css";
import Sidebar from "@/components/Sidebar";
import AskAssistant from "@/components/AskAssistant";

export const metadata: Metadata = {
  title: "AI 全栈后端与 AI 应用学习站 V6",
  description: "Next.js + Agnes AI 选词解释学习网站"
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="zh-CN">
      <body>
        <div className="appShell">
          <Sidebar />
          <main className="main">
            {children}
          </main>
        </div>
        <AskAssistant />
      </body>
    </html>
  );
}
