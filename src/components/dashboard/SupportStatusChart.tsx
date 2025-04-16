
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { calculateStatistics } from "@/data/mockData";
import { PieChart, Pie, Cell, Tooltip, Legend, ResponsiveContainer } from "recharts";

export function SupportStatusChart() {
  const stats = calculateStatistics();
  
  const supportStatusData = [
    { name: 'End of Life', value: stats.techStats.byStatus.EOL, color: '#ef4444' },
    { name: 'Standard Support', value: stats.techStats.byStatus.SS, color: '#10b981' },
    { name: 'Extended Support', value: stats.techStats.byStatus.ES, color: '#f59e0b' },
    { name: 'Extended Security Updates', value: stats.techStats.byStatus.ESU, color: '#6366f1' },
  ];

  return (
    <Card className="col-span-4">
      <CardHeader>
        <CardTitle>Support Status Distribution</CardTitle>
        <CardDescription>Distribution of technologies by support status</CardDescription>
      </CardHeader>
      <CardContent className="pl-2">
        <ResponsiveContainer width="100%" height={300}>
          <PieChart>
            <Pie
              data={supportStatusData}
              cx="50%"
              cy="50%"
              labelLine={false}
              outerRadius={100}
              fill="#8884d8"
              dataKey="value"
              label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
            >
              {supportStatusData.map((entry, index) => (
                <Cell key={`cell-${index}`} fill={entry.color} />
              ))}
            </Pie>
            <Tooltip />
            <Legend />
          </PieChart>
        </ResponsiveContainer>
      </CardContent>
    </Card>
  );
}
