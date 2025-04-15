
import { StatusCard } from "@/components/dashboard/StatusCard";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { calculateStatistics, technologies, servers, remediations, getServerTechnologies } from "@/data/mockData";
import { 
  BarChart3, 
  AlertTriangle, 
  Server, 
  Database, 
  Clock, 
  ShieldAlert, 
  CheckCheck, 
  AlertCircle, 
  Activity,
  MonitorPlay
} from "lucide-react";
import {
  PieChart,
  Pie,
  Cell,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  Legend,
  ResponsiveContainer
} from "recharts";

export default function Dashboard() {
  const stats = calculateStatistics();
  
  // Count servers with EOL technologies
  const serversWithEolTech = servers.filter(server => {
    if (server.status !== 'Active') return false;
    const techs = getServerTechnologies(server.id);
    return techs.some(tech => tech.supportStatus === 'EOL');
  });
  
  // Support status distribution data for pie chart
  const supportStatusData = [
    { name: 'End of Life', value: stats.techStats.byStatus.EOL, color: '#ef4444' },
    { name: 'Standard Support', value: stats.techStats.byStatus.SS, color: '#10b981' },
    { name: 'Extended Support', value: stats.techStats.byStatus.ES, color: '#f59e0b' },
    { name: 'Extended Security Updates', value: stats.techStats.byStatus.ESU, color: '#6366f1' },
  ];
  
  // Remediation status data for bar chart
  const remediationData = [
    { name: 'Not Started', value: stats.remediationStats.byStatus.NotStarted },
    { name: 'In Progress', value: stats.remediationStats.byStatus.InProgress },
    { name: 'Completed', value: stats.remediationStats.byStatus.Completed },
  ];

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-3xl font-bold tracking-tight">Dashboard</h2>
      </div>
      
      {serversWithEolTech.length > 0 && (
        <Alert variant="destructive">
          <AlertCircle className="h-4 w-4" />
          <AlertTitle>Critical Alert</AlertTitle>
          <AlertDescription>
            {serversWithEolTech.length} active servers are running technologies that have reached End of Life.
          </AlertDescription>
        </Alert>
      )}
      
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
      
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-7">
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
      </div>
      
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
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
      </div>
      
      <div className="grid gap-4 md:grid-cols-1">
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
      </div>
    </div>
  );
}
