
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { useDashboardData } from "@/hooks/useDashboardData";
import { Skeleton } from "@/components/ui/skeleton";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { Link } from "react-router-dom";

export function LifecycleSummary() {
  const { supportStatusCounts } = useDashboardData();
  
  // Fetch upcoming EOL dates
  const { data: upcomingEol = [], isLoading: isLoadingEol } = useQuery({
    queryKey: ['upcoming-eol'],
    queryFn: async () => {
      const now = new Date();
      const in90Days = new Date();
      in90Days.setDate(now.getDate() + 90);
      
      const { data, error } = await supabase
        .from('technologies')
        .select('*')
        .gte('support_end_date', now.toISOString().split('T')[0])
        .lte('support_end_date', in90Days.toISOString().split('T')[0])
        .order('support_end_date', { ascending: true });
      
      if (error) throw error;
      
      return data.map(tech => ({
        id: tech.id,
        name: tech.name,
        version: tech.version,
        supportEndDate: tech.support_end_date,
        category: tech.category
      }));
    }
  });

  const isLoading = !supportStatusCounts || isLoadingEol;

  // Format date for display
  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', { 
      year: 'numeric', 
      month: 'short', 
      day: 'numeric' 
    });
  };

  // Calculate days until date
  const getDaysUntil = (dateString: string) => {
    const date = new Date(dateString);
    const today = new Date();
    const diffTime = date.getTime() - today.getTime();
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    return diffDays;
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>Technology Lifecycle Summary</CardTitle>
        <CardDescription>
          Overview of technologies approaching end of support
        </CardDescription>
      </CardHeader>
      <CardContent>
        <div className="space-y-8">
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
            <Card>
              <CardHeader className="p-4">
                <CardTitle className="text-sm font-medium">EOL</CardTitle>
              </CardHeader>
              <CardContent className="p-4 pt-0">
                {isLoading ? (
                  <Skeleton className="h-6 w-10" />
                ) : (
                  <div className="text-xl font-bold">{supportStatusCounts.EOL}</div>
                )}
              </CardContent>
            </Card>
            <Card>
              <CardHeader className="p-4">
                <CardTitle className="text-sm font-medium">Standard Support</CardTitle>
              </CardHeader>
              <CardContent className="p-4 pt-0">
                {isLoading ? (
                  <Skeleton className="h-6 w-10" />
                ) : (
                  <div className="text-xl font-bold">{supportStatusCounts.SS}</div>
                )}
              </CardContent>
            </Card>
            <Card>
              <CardHeader className="p-4">
                <CardTitle className="text-sm font-medium">Extended Support</CardTitle>
              </CardHeader>
              <CardContent className="p-4 pt-0">
                {isLoading ? (
                  <Skeleton className="h-6 w-10" />
                ) : (
                  <div className="text-xl font-bold">{supportStatusCounts.ES}</div>
                )}
              </CardContent>
            </Card>
            <Card>
              <CardHeader className="p-4">
                <CardTitle className="text-sm font-medium">ESU</CardTitle>
              </CardHeader>
              <CardContent className="p-4 pt-0">
                {isLoading ? (
                  <Skeleton className="h-6 w-10" />
                ) : (
                  <div className="text-xl font-bold">{supportStatusCounts.ESU}</div>
                )}
              </CardContent>
            </Card>
          </div>
          
          <div>
            <h3 className="text-lg font-medium mb-4">Upcoming End of Support (Next 90 Days)</h3>
            {isLoading ? (
              <div className="space-y-2">
                <Skeleton className="h-12 w-full" />
                <Skeleton className="h-12 w-full" />
                <Skeleton className="h-12 w-full" />
              </div>
            ) : upcomingEol.length === 0 ? (
              <p className="text-muted-foreground">No technologies reaching end of support in the next 90 days.</p>
            ) : (
              <div className="space-y-4">
                {upcomingEol.map(tech => (
                  <div 
                    key={tech.id} 
                    className="flex items-center justify-between p-4 border rounded-md"
                  >
                    <div>
                      <div className="font-medium">{tech.name} {tech.version}</div>
                      <div className="text-sm text-muted-foreground">{tech.category}</div>
                    </div>
                    <div className="text-right">
                      <div className="font-medium">{formatDate(tech.supportEndDate)}</div>
                      <div className="text-sm text-amber-600">{getDaysUntil(tech.supportEndDate)} days left</div>
                    </div>
                  </div>
                ))}
              </div>
            )}
            
            <div className="mt-4 flex justify-end">
              <Button variant="outline" asChild>
                <Link to="/technologies">View All Technologies</Link>
              </Button>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
