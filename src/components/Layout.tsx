import { PropsWithChildren } from "react";
import Sidebar from "@/components/Sidebar";
import Header from "@/components/Header";

export default function Layout({ children }: PropsWithChildren) {
  return (
    <div className="flex min-h-screen bg-light text-secondary">
      <Sidebar />
      <div className="flex-1 flex flex-col overflow-hidden">
        <Header />
        <main className="flex-1 overflow-y-auto p-8">{children}</main>
      </div>
    </div>
  );
}
