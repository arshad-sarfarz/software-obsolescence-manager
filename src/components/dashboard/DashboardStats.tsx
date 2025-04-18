
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { Server, Package, Database, Wrench, AlertTriangle } from "lucide-react";
import { useDashboardData } from "@/hooks/useDashboardData";

export function DashboardStats() {
  const { stats, supportStatusCounts } = useDashboardData();
  const isLoading = !stats;

  const totalEOLTechnologies = supportStatusCounts.EOL || 0;

  return (
    <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-5">
      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">
            Total Servers
          </CardTitle>
          <Server className="h-4 w-4 text-muted-foreground" />
        </CardHeader>
        <CardContent>
          {isLoading ? (
            <Skeleton className="h-8 w-20" />
          ) : (
            <div className="text-2xl font-bold">{stats.serverCount}</div>
          )}
          <p className="text-xs text-muted-foreground">
            {isLoading ? (
              <Skeleton className="h-4 w-full" />
            ) : (
              `${stats.serversWithIssues} servers with EOL technologies`
            )}
          </p>
        </CardContent>
      </Card>
      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">
            Total Applications
          </CardTitle>
          <Package className="h-4 w-4 text-muted-foreground" />
        </CardHeader>
        <CardContent>
          {isLoading ? (
            <Skeleton className="h-8 w-20" />
          ) : (
            <div className="text-2xl font-bold">{stats.applicationCount}</div>
          )}
          <p className="text-xs text-muted-foreground">
            Across all environments
          </p>
        </CardContent>
      </Card>
      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">
            Technologies
          </CardTitle>
          <Database className="h-4 w-4 text-muted-foreground" />
        </CardHeader>
        <CardContent>
          {isLoading ? (
            <Skeleton className="h-8 w-20" />
          ) : (
            <div className="text-2xl font-bold">{stats.technologyCount}</div>
          )}
          <p className="text-xs text-muted-foreground">
            {isLoading ? (
              <Skeleton className="h-4 w-full" />
            ) : (
              `${totalEOLTechnologies} EOL technologies`
            )}
          </p>
        </CardContent>
      </Card>
      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">
            Remediations
          </CardTitle>
          <Wrench className="h-4 w-4 text-muted-foreground" />
        </CardHeader>
        <CardContent>
          {isLoading ? (
            <Skeleton className="h-8 w-20" />
          ) : (
            <div className="text-2xl font-bold">{stats.remediationCount}</div>
          )}
          <p className="text-xs text-muted-foreground">
            Planned or in progress
          </p>
        </CardContent>
      </Card>
      <Card className={stats.serversWithIssues > 0 ? "bg-red-50" : ""}>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">
            Critical Alerts
          </CardTitle>
          <AlertTriangle className={`h-4 w-4 ${stats.serversWithIssues > 0 ? "text-red-500" : "text-muted-foreground"}`} />
        </CardHeader>
        <CardContent>
          {isLoading ? (
            <Skeleton className="h-8 w-20" />
          ) : (
            <div className={`text-2xl font-bold ${stats.serversWithIssues > 0 ? "text-red-600" : ""}`}>
              {stats.serversWithIssues}
            </div>
          )}
          <p className="text-xs text-muted-foreground">
            Servers with EOL technologies
          </p>
        </CardContent>
      </Card>
    </div>
  );
}
