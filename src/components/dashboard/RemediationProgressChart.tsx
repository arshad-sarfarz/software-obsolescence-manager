
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { calculateStatistics } from "@/data/mockData";
import { BarChart, Bar, XAxis, YAxis, Tooltip, Legend, ResponsiveContainer } from "recharts";

export function RemediationProgressChart() {
  const stats = calculateStatistics();
  
  const remediationData = [
    { name: 'Not Started', value: stats.remediationStats.byStatus.NotStarted },
    { name: 'In Progress', value: stats.remediationStats.byStatus.InProgress },
    { name: 'Completed', value: stats.remediationStats.byStatus.Completed },
  ];

  return (
    <Card className="col-span-3">
      <CardHeader>
        <CardTitle>Remediation Progress</CardTitle>
        <CardDescription>Status of remediation activities</CardDescription>
      </CardHeader>
      <CardContent>
        <ResponsiveContainer width="100%" height={300}>
          <BarChart
            data={remediationData}
            margin={{
              top: 5,
              right: 30,
              left: 20,
              bottom: 5,
            }}
          >
            <XAxis dataKey="name" />
            <YAxis />
            <Tooltip />
            <Legend />
            <Bar dataKey="value" fill="#6366f1" />
          </BarChart>
        </ResponsiveContainer>
      </CardContent>
    </Card>
  );
}
