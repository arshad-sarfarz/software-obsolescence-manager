
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { AlertTriangle, CheckCheck, Clock, ShieldAlert } from "lucide-react";
import { calculateStatistics } from "@/data/mockData";

export function LifecycleSummary() {
  const stats = calculateStatistics();

  return (
    <Card>
      <CardHeader>
        <CardTitle>Technology Lifecycle Summary</CardTitle>
        <CardDescription>Overview of technology support status</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="flex items-center justify-between border-b py-3">
          <div className="flex items-center gap-3">
            <AlertTriangle className="text-red-500 h-5 w-5" />
            <span className="font-medium">End of Life</span>
          </div>
          <div>{stats.techStats.byStatus.EOL} technologies</div>
        </div>
        <div className="flex items-center justify-between border-b py-3">
          <div className="flex items-center gap-3">
            <CheckCheck className="text-green-500 h-5 w-5" />
            <span className="font-medium">Standard Support</span>
          </div>
          <div>{stats.techStats.byStatus.SS} technologies</div>
        </div>
        <div className="flex items-center justify-between border-b py-3">
          <div className="flex items-center gap-3">
            <Clock className="text-yellow-500 h-5 w-5" />
            <span className="font-medium">Extended Support</span>
          </div>
          <div>{stats.techStats.byStatus.ES} technologies</div>
        </div>
        <div className="flex items-center justify-between py-3">
          <div className="flex items-center gap-3">
            <ShieldAlert className="text-blue-500 h-5 w-5" />
            <span className="font-medium">Extended Security Updates</span>
          </div>
          <div>{stats.techStats.byStatus.ESU} technologies</div>
        </div>
      </CardContent>
    </Card>
  );
}
