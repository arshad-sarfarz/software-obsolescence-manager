
import { Sidebar } from "./Sidebar";
import { Outlet } from "react-router-dom";

export function MainLayout() {
  return (
    <div className="flex">
      <Sidebar className="w-64 flex-shrink-0" />
      <main className="flex-grow p-8 bg-background">
        <div className="container mx-auto">
          <Outlet />
        </div>
      </main>
    </div>
  );
}
