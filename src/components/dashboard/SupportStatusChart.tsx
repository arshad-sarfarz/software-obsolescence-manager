
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { PieChart, Pie, Cell, ResponsiveContainer, Legend, Tooltip } from "recharts";
import { useDashboardData } from "@/hooks/useDashboardData";
import { Skeleton } from "@/components/ui/skeleton";

export function SupportStatusChart() {
  const { supportStatusCounts } = useDashboardData();
  
  const data = [
    { name: "EOL", value: supportStatusCounts.EOL, color: "#ef4444" },
    { name: "SS", value: supportStatusCounts.SS, color: "#22c55e" },
    { name: "ES", value: supportStatusCounts.ES, color: "#f59e0b" },
    { name: "ESU", value: supportStatusCounts.ESU, color: "#3b82f6" },
  ].filter(item => item.value > 0);

  const isLoading = !supportStatusCounts;
  const total = data.reduce((sum, item) => sum + item.value, 0);
  const isEmpty = total === 0;

  return (
    <Card className="col-span-4">
      <CardHeader>
        <CardTitle>Technology Support Status</CardTitle>
        <CardDescription>
          Distribution of technologies by support status
        </CardDescription>
      </CardHeader>
      <CardContent>
        {isLoading ? (
          <div className="flex justify-center items-center h-[300px]">
            <Skeleton className="h-[250px] w-full" />
          </div>
        ) : isEmpty ? (
          <div className="flex justify-center items-center h-[300px]">
            <p className="text-muted-foreground">No technology data available</p>
          </div>
        ) : (
          <ResponsiveContainer width="100%" height={300}>
            <PieChart>
              <Pie
                data={data}
                cx="50%"
                cy="50%"
                labelLine={false}
                outerRadius={80}
                fill="#8884d8"
                dataKey="value"
                label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
              >
                {data.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={entry.color} />
                ))}
              </Pie>
              <Tooltip 
                formatter={(value) => [`${value} technologies`, 'Count']}
              />
              <Legend />
            </PieChart>
          </ResponsiveContainer>
        )}
      </CardContent>
    </Card>
  );
}
