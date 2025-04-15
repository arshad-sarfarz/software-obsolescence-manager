
import { cn } from "@/lib/utils";
import { Home, Server, Database, MonitorPlay, AlertTriangle, BarChart3, Settings } from "lucide-react";
import { NavLink } from "react-router-dom";

interface SidebarProps extends React.HTMLAttributes<HTMLDivElement> {}

export function Sidebar({ className }: SidebarProps) {
  const navItems = [
    { title: "Dashboard", href: "/", icon: Home },
    { title: "Servers", href: "/servers", icon: Server },
    { title: "Applications", href: "/applications", icon: MonitorPlay },
    { title: "Technologies", href: "/technologies", icon: Database },
    { title: "Remediations", href: "/remediations", icon: AlertTriangle },
    { title: "Reports", href: "/reports", icon: BarChart3 },
    { title: "Settings", href: "/settings", icon: Settings },
  ];

  return (
    <div className={cn("pb-12 border-r min-h-screen", className)}>
      <div className="space-y-4 py-4">
        <div className="px-3 py-2">
          <h2 className="mb-2 px-4 text-lg font-semibold tracking-tight">
            Tech Lifespan Manager
          </h2>
          <div className="space-y-1">
            {navItems.map((item) => (
              <NavLink
                key={item.href}
                to={item.href}
                className={({ isActive }) =>
                  cn(
                    "flex items-center gap-3 rounded-lg px-3 py-2 text-sm font-medium transition-all hover:bg-accent",
                    isActive ? "bg-accent text-accent-foreground" : "text-muted-foreground"
                  )
                }
              >
                <item.icon className="h-4 w-4" />
                <span>{item.title}</span>
              </NavLink>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
