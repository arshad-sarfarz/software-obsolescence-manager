
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from "recharts";
import { useDashboardData } from "@/hooks/useDashboardData";
import { Skeleton } from "@/components/ui/skeleton";

export function RemediationProgressChart() {
  const { remediationStatusCounts } = useDashboardData();
  
  const data = [
    { name: "Not Started", value: remediationStatusCounts["Not started"], color: "#ef4444" },
    { name: "In Progress", value: remediationStatusCounts["In progress"], color: "#f59e0b" },
    { name: "Completed", value: remediationStatusCounts["Completed"], color: "#22c55e" },
  ];

  const isLoading = !remediationStatusCounts;
  const isEmpty = data.every(item => item.value === 0);

  return (
    <Card className="col-span-3">
      <CardHeader>
        <CardTitle>Remediation Progress</CardTitle>
        <CardDescription>
          Status of all remediation activities
        </CardDescription>
      </CardHeader>
      <CardContent>
        {isLoading ? (
          <div className="flex justify-center items-center h-[300px]">
            <Skeleton className="h-[250px] w-full" />
          </div>
        ) : isEmpty ? (
          <div className="flex justify-center items-center h-[300px]">
            <p className="text-muted-foreground">No remediation data available</p>
          </div>
        ) : (
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={data}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="name" />
              <YAxis />
              <Tooltip
                formatter={(value) => [`${value} remediations`, 'Count']}
              />
              <Bar dataKey="value" name="Count">
                {data.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={entry.color} />
                ))}
              </Bar>
            </BarChart>
          </ResponsiveContainer>
        )}
      </CardContent>
    </Card>
  );
}
