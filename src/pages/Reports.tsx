
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { calculateStatistics, technologies, servers, remediations } from "@/data/mockData";
import { BarChart3, Download, FileText } from "lucide-react";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell
} from "recharts";

export default function Reports() {
  const stats = calculateStatistics();
  
  // Support status distribution data for pie chart
  const supportStatusData = [
    { name: 'End of Life', value: stats.techStats.byStatus.EOL, color: '#ef4444' },
    { name: 'Standard Support', value: stats.techStats.byStatus.SS, color: '#10b981' },
    { name: 'Extended Support', value: stats.techStats.byStatus.ES, color: '#f59e0b' },
    { name: 'Extended Security Updates', value: stats.techStats.byStatus.ESU, color: '#6366f1' },
  ];
  
  // Server status data for bar chart
  const serverStatusData = [
    { name: 'Active', value: stats.serverStats.byStatus.Active },
    { name: 'Upgraded', value: stats.serverStats.byStatus.Upgraded },
    { name: 'Migrated to Cloud', value: stats.serverStats.byStatus.MigratedToCloud },
    { name: 'Decommissioned', value: stats.serverStats.byStatus.Decommissioned },
  ];
  
  // Remediation status data for bar chart
  const remediationData = [
    { name: 'Not Started', value: stats.remediationStats.byStatus.NotStarted },
    { name: 'In Progress', value: stats.remediationStats.byStatus.InProgress },
    { name: 'Completed', value: stats.remediationStats.byStatus.Completed },
  ];
  
  // Technology category data
  const categoryData = technologies.reduce((acc, tech) => {
    const category = tech.category;
    const existingCategory = acc.find(item => item.name === category);
    
    if (existingCategory) {
      existingCategory.value++;
    } else {
      acc.push({ name: category, value: 1 });
    }
    
    return acc;
  }, [] as { name: string; value: number }[]);
  
  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-3xl font-bold tracking-tight">Reports</h2>
        <Button>
          <Download className="mr-2 h-4 w-4" />
          Export
        </Button>
      </div>
      
      <Tabs defaultValue="summary">
        <TabsList className="mb-4">
          <TabsTrigger value="summary">Summary</TabsTrigger>
          <TabsTrigger value="technologies">Technologies</TabsTrigger>
          <TabsTrigger value="servers">Servers</TabsTrigger>
          <TabsTrigger value="remediations">Remediations</TabsTrigger>
        </TabsList>
        
        <TabsContent value="summary" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Overview</CardTitle>
              <CardDescription>
                A high-level overview of your technology landscape
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                <div>
                  <h3 className="text-lg font-medium mb-4">Technology Support Status</h3>
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
                </div>
                
                <div>
                  <h3 className="text-lg font-medium mb-4">Remediation Progress</h3>
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
                      <CartesianGrid strokeDasharray="3 3" />
                      <XAxis dataKey="name" />
                      <YAxis />
                      <Tooltip />
                      <Legend />
                      <Bar dataKey="value" name="Count" fill="#6366f1" />
                    </BarChart>
                  </ResponsiveContainer>
                </div>
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mt-8">
                <div>
                  <h3 className="text-lg font-medium mb-4">Server Status</h3>
                  <ResponsiveContainer width="100%" height={300}>
                    <BarChart
                      data={serverStatusData}
                      margin={{
                        top: 5,
                        right: 30,
                        left: 20,
                        bottom: 5,
                      }}
                    >
                      <CartesianGrid strokeDasharray="3 3" />
                      <XAxis dataKey="name" />
                      <YAxis />
                      <Tooltip />
                      <Legend />
                      <Bar dataKey="value" name="Count" fill="#10b981" />
                    </BarChart>
                  </ResponsiveContainer>
                </div>
                
                <div>
                  <h3 className="text-lg font-medium mb-4">Technology Categories</h3>
                  <ResponsiveContainer width="100%" height={300}>
                    <BarChart
                      data={categoryData}
                      margin={{
                        top: 5,
                        right: 30,
                        left: 20,
                        bottom: 5,
                      }}
                    >
                      <CartesianGrid strokeDasharray="3 3" />
                      <XAxis dataKey="name" />
                      <YAxis />
                      <Tooltip />
                      <Legend />
                      <Bar dataKey="value" name="Count" fill="#f59e0b" />
                    </BarChart>
                  </ResponsiveContainer>
                </div>
              </div>
            </CardContent>
          </Card>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-sm font-medium">
                  Available Reports
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-2">
                  <Button variant="ghost" className="w-full justify-start">
                    <FileText className="mr-2 h-4 w-4" />
                    EOL Risk Report
                  </Button>
                  <Button variant="ghost" className="w-full justify-start">
                    <FileText className="mr-2 h-4 w-4" />
                    Remediation Status Report
                  </Button>
                  <Button variant="ghost" className="w-full justify-start">
                    <FileText className="mr-2 h-4 w-4" />
                    Server Inventory Report
                  </Button>
                  <Button variant="ghost" className="w-full justify-start">
                    <FileText className="mr-2 h-4 w-4" />
                    Technology Support Timeline
                  </Button>
                </div>
              </CardContent>
            </Card>
            
            <Card className="md:col-span-2">
              <CardHeader className="pb-2">
                <CardTitle className="text-sm font-medium">
                  Key Metrics
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-1">
                    <p className="text-xs text-muted-foreground">Total Servers</p>
                    <p className="text-2xl font-bold">{stats.serverStats.total}</p>
                  </div>
                  <div className="space-y-1">
                    <p className="text-xs text-muted-foreground">Total Technologies</p>
                    <p className="text-2xl font-bold">{stats.techStats.total}</p>
                  </div>
                  <div className="space-y-1">
                    <p className="text-xs text-muted-foreground">EOL Technologies</p>
                    <p className="text-2xl font-bold">{stats.techStats.byStatus.EOL}</p>
                  </div>
                  <div className="space-y-1">
                    <p className="text-xs text-muted-foreground">Active Remediations</p>
                    <p className="text-2xl font-bold">
                      {stats.remediationStats.byStatus.NotStarted + stats.remediationStats.byStatus.InProgress}
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>
        
        <TabsContent value="technologies" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Technology Reports</CardTitle>
              <CardDescription>
                Detailed reports about technology support status
              </CardDescription>
            </CardHeader>
            <CardContent>
              <p className="text-muted-foreground">Select a report type to generate a detailed technology report.</p>
            </CardContent>
          </Card>
        </TabsContent>
        
        <TabsContent value="servers" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Server Reports</CardTitle>
              <CardDescription>
                Detailed reports about server inventory and status
              </CardDescription>
            </CardHeader>
            <CardContent>
              <p className="text-muted-foreground">Select a report type to generate a detailed server report.</p>
            </CardContent>
          </Card>
        </TabsContent>
        
        <TabsContent value="remediations" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Remediation Reports</CardTitle>
              <CardDescription>
                Detailed reports about remediation progress
              </CardDescription>
            </CardHeader>
            <CardContent>
              <p className="text-muted-foreground">Select a report type to generate a detailed remediation report.</p>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}
