
import { Sidebar } from "./Sidebar";
import { Outlet } from "react-router-dom";

export function MainLayout() {
  return (
    <div className="relative min-h-screen flex">
      <div 
        className="absolute inset-0 z-0 bg-cover bg-center opacity-10" 
        style={{ 
          backgroundImage: 'url(https://images.unsplash.com/photo-1498050108023-c5249f4df085)', 
          filter: 'grayscale(30%) brightness(50%)' 
        }}
      />
      
      <Sidebar className="relative z-10 w-64 flex-shrink-0" />
      <main className="relative z-10 flex-grow p-8 bg-background/50 backdrop-blur-sm">
        <div className="container mx-auto">
          <Outlet />
        </div>
      </main>
    </div>
  );
}
