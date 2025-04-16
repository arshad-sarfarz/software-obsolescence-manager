
import { CriticalAlert } from "@/components/dashboard/CriticalAlert";
import { DashboardStats } from "@/components/dashboard/DashboardStats";
import { SupportStatusChart } from "@/components/dashboard/SupportStatusChart";
import { RemediationProgressChart } from "@/components/dashboard/RemediationProgressChart";
import { SupportProgressCards } from "@/components/dashboard/SupportProgressCards";
import { LifecycleSummary } from "@/components/dashboard/LifecycleSummary";

export default function Dashboard() {
  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-3xl font-bold tracking-tight">Dashboard</h2>
      </div>
      
      <CriticalAlert />
      <DashboardStats />
      
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-7">
        <SupportStatusChart />
        <RemediationProgressChart />
      </div>
      
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        <SupportProgressCards />
      </div>
      
      <div className="grid gap-4 md:grid-cols-1">
        <LifecycleSummary />
      </div>
    </div>
  );
}
