
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { calculateStatistics } from "@/data/mockData";

export function SupportProgressCards() {
  const stats = calculateStatistics();

  return (
    <>
      <Card>
        <CardHeader className="pb-2">
          <CardTitle className="text-sm font-medium">
            Standard Support
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">{stats.techStats.byStatus.SS}</div>
          <p className="text-xs text-muted-foreground">
            Technologies under standard support
          </p>
          <div className="mt-4 h-2 w-full">
            <Progress value={stats.techStats.byStatus.SS / stats.techStats.total * 100} className="bg-gray-200 h-2">
              <div className="h-full bg-green-500 rounded-full"></div>
            </Progress>
          </div>
        </CardContent>
      </Card>
      
      <Card>
        <CardHeader className="pb-2">
          <CardTitle className="text-sm font-medium">
            Extended Support
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">{stats.techStats.byStatus.ES}</div>
          <p className="text-xs text-muted-foreground">
            Technologies under extended support
          </p>
          <div className="mt-4 h-2 w-full">
            <Progress value={stats.techStats.byStatus.ES / stats.techStats.total * 100} className="bg-gray-200 h-2">
              <div className="h-full bg-yellow-500 rounded-full"></div>
            </Progress>
          </div>
        </CardContent>
      </Card>
      
      <Card>
        <CardHeader className="pb-2">
          <CardTitle className="text-sm font-medium">
            Extended Security Updates
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">{stats.techStats.byStatus.ESU}</div>
          <p className="text-xs text-muted-foreground">
            Technologies with extended security updates
          </p>
          <div className="mt-4 h-2 w-full">
            <Progress value={stats.techStats.byStatus.ESU / stats.techStats.total * 100} className="bg-gray-200 h-2">
              <div className="h-full bg-blue-500 rounded-full"></div>
            </Progress>
          </div>
        </CardContent>
      </Card>
    </>
  );
}
