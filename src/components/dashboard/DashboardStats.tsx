
import { Server, MonitorPlay, Database, AlertTriangle } from "lucide-react";
import { StatusCard } from "@/components/dashboard/StatusCard";
import { calculateStatistics } from "@/data/mockData";

export function DashboardStats() {
  const stats = calculateStatistics();
  
  return (
    <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
      <StatusCard 
        title="Total Servers" 
        value={stats.serverStats.total} 
        icon={<Server className="h-4 w-4" />} 
      />
      <StatusCard 
        title="Total Applications" 
        value={Object.keys(stats.techStats).length} 
        icon={<MonitorPlay className="h-4 w-4" />} 
      />
      <StatusCard 
        title="Total Technologies" 
        value={stats.techStats.total} 
        icon={<Database className="h-4 w-4" />} 
      />
      <StatusCard 
        title="End of Life Technologies" 
        value={stats.techStats.byStatus.EOL} 
        className="border-red-200 bg-red-50"
        icon={<AlertTriangle className="h-4 w-4 text-red-500" />} 
      />
    </div>
  );
}
