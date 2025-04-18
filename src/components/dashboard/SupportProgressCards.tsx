
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { useDashboardData } from "@/hooks/useDashboardData";
import { Skeleton } from "@/components/ui/skeleton";
import { cn } from "@/lib/utils";

export function SupportProgressCards() {
  const { supportStatusCounts } = useDashboardData();
  
  const isLoading = !supportStatusCounts;
  
  // Calculate total and percentages
  const total = 
    supportStatusCounts.EOL +
    supportStatusCounts.SS +
    supportStatusCounts.ES +
    supportStatusCounts.ESU;
    
  const percentEOL = total > 0 ? Math.round((supportStatusCounts.EOL / total) * 100) : 0;
  const percentSS = total > 0 ? Math.round((supportStatusCounts.SS / total) * 100) : 0;
  const percentES = total > 0 ? Math.round((supportStatusCounts.ES / total) * 100) : 0;
  const percentESU = total > 0 ? Math.round((supportStatusCounts.ESU / total) * 100) : 0;

  return (
    <>
      <Card>
        <CardHeader className="pb-2">
          <CardTitle>EOL Technologies</CardTitle>
          <CardDescription>
            End of Life - Immediate attention required
          </CardDescription>
        </CardHeader>
        <CardContent>
          {isLoading ? (
            <Skeleton className="h-4 w-full mb-2" />
          ) : (
            <>
              <div className="flex items-center justify-between mb-2">
                <span className="text-2xl font-bold">{supportStatusCounts.EOL}</span>
                <span className="text-muted-foreground">{percentEOL}%</span>
              </div>
              <Progress value={percentEOL} className={cn("bg-gray-200 h-2", "data-[value]:bg-red-500")} />
            </>
          )}
        </CardContent>
      </Card>
      
      <Card>
        <CardHeader className="pb-2">
          <CardTitle>Standard Support</CardTitle>
          <CardDescription>
            Technologies in standard support phase
          </CardDescription>
        </CardHeader>
        <CardContent>
          {isLoading ? (
            <Skeleton className="h-4 w-full mb-2" />
          ) : (
            <>
              <div className="flex items-center justify-between mb-2">
                <span className="text-2xl font-bold">{supportStatusCounts.SS}</span>
                <span className="text-muted-foreground">{percentSS}%</span>
              </div>
              <Progress value={percentSS} className={cn("bg-gray-200 h-2", "data-[value]:bg-green-500")} />
            </>
          )}
        </CardContent>
      </Card>
      
      <Card>
        <CardHeader className="pb-2">
          <CardTitle>Extended Support</CardTitle>
          <CardDescription>
            Technologies in extended support phase
          </CardDescription>
        </CardHeader>
        <CardContent>
          {isLoading ? (
            <Skeleton className="h-4 w-full mb-2" />
          ) : (
            <>
              <div className="flex items-center justify-between mb-2">
                <span className="text-2xl font-bold">{supportStatusCounts.ES + supportStatusCounts.ESU}</span>
                <span className="text-muted-foreground">{percentES + percentESU}%</span>
              </div>
              <Progress value={percentES + percentESU} className={cn("bg-gray-200 h-2", "data-[value]:bg-amber-500")} />
            </>
          )}
        </CardContent>
      </Card>
    </>
  );
}
