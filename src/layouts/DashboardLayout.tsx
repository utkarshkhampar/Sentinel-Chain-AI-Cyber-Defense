import { Outlet } from "react-router-dom";
import { Sidebar } from "@/components/layout/Sidebar";
import { Header } from "@/components/layout/Header";

export function DashboardLayout() {
  return (
    <div className="flex h-screen w-full overflow-hidden bg-base">
      <Sidebar />
      <div className="flex min-w-0 flex-1 flex-col">
        <Header />
        <main className="scroll-thin flex-1 overflow-y-auto bg-console-grid">
          <div className="mx-auto max-w-[1800px] p-4 md:p-6">
            <Outlet />
          </div>
        </main>
      </div>
    </div>
  );
}
