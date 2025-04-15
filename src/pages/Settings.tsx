
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Checkbox } from "@/components/ui/checkbox";
import { Switch } from "@/components/ui/switch";
import { Settings as SettingsIcon, Save, UserCog, BellRing, Shield, Database } from "lucide-react";

export default function Settings() {
  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-3xl font-bold tracking-tight">Settings</h2>
      </div>
      
      <Tabs defaultValue="general">
        <TabsList className="mb-4">
          <TabsTrigger value="general">General</TabsTrigger>
          <TabsTrigger value="notifications">Notifications</TabsTrigger>
          <TabsTrigger value="users">Users</TabsTrigger>
          <TabsTrigger value="data">Data Management</TabsTrigger>
        </TabsList>
        
        <TabsContent value="general" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>General Settings</CardTitle>
              <CardDescription>
                Configure general application settings
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="org-name">Organization Name</Label>
                <Input id="org-name" placeholder="Enter organization name" defaultValue="Acme Corporation" />
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="contact-email">Contact Email</Label>
                <Input id="contact-email" placeholder="Enter contact email" defaultValue="admin@example.com" />
              </div>
              
              <div className="flex items-center justify-between pt-4">
                <div className="space-y-0.5">
                  <Label htmlFor="dark-mode">Dark Mode</Label>
                  <div className="text-xs text-muted-foreground">Enable dark mode for the application interface</div>
                </div>
                <Switch id="dark-mode" />
              </div>
              
              <div className="flex items-center justify-between pt-4">
                <div className="space-y-0.5">
                  <Label htmlFor="auto-refresh">Auto Refresh</Label>
                  <div className="text-xs text-muted-foreground">Automatically refresh dashboard data</div>
                </div>
                <Switch id="auto-refresh" defaultChecked />
              </div>
              
              <Button className="mt-4">
                <Save className="mr-2 h-4 w-4" />
                Save Settings
              </Button>
            </CardContent>
          </Card>
        </TabsContent>
        
        <TabsContent value="notifications" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Notification Settings</CardTitle>
              <CardDescription>
                Configure how and when you receive notifications
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label>Email Notifications</Label>
                <div className="space-y-2">
                  <div className="flex items-center space-x-2">
                    <Checkbox id="email-eol" defaultChecked />
                    <Label htmlFor="email-eol">Technology reaching EOL</Label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <Checkbox id="email-remediation" defaultChecked />
                    <Label htmlFor="email-remediation">Remediation deadline approaching</Label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <Checkbox id="email-status" defaultChecked />
                    <Label htmlFor="email-status">Remediation status changes</Label>
                  </div>
                </div>
              </div>
              
              <div className="space-y-2 pt-4">
                <Label>In-App Notifications</Label>
                <div className="space-y-2">
                  <div className="flex items-center space-x-2">
                    <Checkbox id="app-eol" defaultChecked />
                    <Label htmlFor="app-eol">Technology reaching EOL</Label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <Checkbox id="app-remediation" defaultChecked />
                    <Label htmlFor="app-remediation">Remediation deadline approaching</Label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <Checkbox id="app-status" defaultChecked />
                    <Label htmlFor="app-status">Remediation status changes</Label>
                  </div>
                </div>
              </div>
              
              <Button className="mt-4">
                <Save className="mr-2 h-4 w-4" />
                Save Notification Settings
              </Button>
            </CardContent>
          </Card>
        </TabsContent>
        
        <TabsContent value="users" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>User Management</CardTitle>
              <CardDescription>
                Manage user access and permissions
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-2">
                <Label>User Roles</Label>
                <div className="rounded-md border">
                  <div className="flex items-center justify-between p-4 border-b">
                    <div className="flex items-center space-x-4">
                      <UserCog className="h-5 w-5 text-muted-foreground" />
                      <div>
                        <p className="font-medium">Administrator</p>
                        <p className="text-xs text-muted-foreground">Full system access</p>
                      </div>
                    </div>
                    <Button variant="outline" size="sm">Manage</Button>
                  </div>
                  <div className="flex items-center justify-between p-4 border-b">
                    <div className="flex items-center space-x-4">
                      <UserCog className="h-5 w-5 text-muted-foreground" />
                      <div>
                        <p className="font-medium">Manager</p>
                        <p className="text-xs text-muted-foreground">Can manage remediations and view reports</p>
                      </div>
                    </div>
                    <Button variant="outline" size="sm">Manage</Button>
                  </div>
                  <div className="flex items-center justify-between p-4">
                    <div className="flex items-center space-x-4">
                      <UserCog className="h-5 w-5 text-muted-foreground" />
                      <div>
                        <p className="font-medium">Viewer</p>
                        <p className="text-xs text-muted-foreground">View-only access</p>
                      </div>
                    </div>
                    <Button variant="outline" size="sm">Manage</Button>
                  </div>
                </div>
              </div>
              
              <Button className="mt-4">
                <UserCog className="mr-2 h-4 w-4" />
                Add New User
              </Button>
            </CardContent>
          </Card>
        </TabsContent>
        
        <TabsContent value="data" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Data Management</CardTitle>
              <CardDescription>
                Manage application data and integration settings
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label>Data Integration</Label>
                <div className="rounded-md border">
                  <div className="flex items-center justify-between p-4 border-b">
                    <div className="flex items-center space-x-4">
                      <Database className="h-5 w-5 text-muted-foreground" />
                      <div>
                        <p className="font-medium">Import Data</p>
                        <p className="text-xs text-muted-foreground">Import data from CSV or Excel</p>
                      </div>
                    </div>
                    <Button variant="outline" size="sm">Import</Button>
                  </div>
                  <div className="flex items-center justify-between p-4">
                    <div className="flex items-center space-x-4">
                      <Database className="h-5 w-5 text-muted-foreground" />
                      <div>
                        <p className="font-medium">Export Data</p>
                        <p className="text-xs text-muted-foreground">Export data to CSV or Excel</p>
                      </div>
                    </div>
                    <Button variant="outline" size="sm">Export</Button>
                  </div>
                </div>
              </div>
              
              <div className="space-y-2 pt-4">
                <Label>Backup & Restore</Label>
                <div className="rounded-md border">
                  <div className="flex items-center justify-between p-4 border-b">
                    <div className="flex items-center space-x-4">
                      <Shield className="h-5 w-5 text-muted-foreground" />
                      <div>
                        <p className="font-medium">Backup Data</p>
                        <p className="text-xs text-muted-foreground">Create a complete backup of all data</p>
                      </div>
                    </div>
                    <Button variant="outline" size="sm">Backup</Button>
                  </div>
                  <div className="flex items-center justify-between p-4">
                    <div className="flex items-center space-x-4">
                      <Shield className="h-5 w-5 text-muted-foreground" />
                      <div>
                        <p className="font-medium">Restore Data</p>
                        <p className="text-xs text-muted-foreground">Restore from a previous backup</p>
                      </div>
                    </div>
                    <Button variant="outline" size="sm">Restore</Button>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}
