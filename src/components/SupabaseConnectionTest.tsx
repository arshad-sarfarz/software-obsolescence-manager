
import { useEffect, useState } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { getCurrentEnvironment } from '@/config/environment-config';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Loader2 } from 'lucide-react';
import { getEnvironmentConfig } from '@/config/environment-config';

export function SupabaseConnectionTest() {
  const [isLoading, setIsLoading] = useState(true);
  const [connectionSuccess, setConnectionSuccess] = useState<boolean | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [environment, setEnvironment] = useState<string>('');
  const [projectId, setProjectId] = useState<string>('');

  const testConnection = async () => {
    setIsLoading(true);
    setError(null);
    
    try {
      // Get current environment info
      const env = getCurrentEnvironment();
      setEnvironment(env);
      
      // Get project ID from configuration rather than trying to parse it from URL
      const config = getEnvironmentConfig();
      setProjectId(config.projectId);
      
      // Try to fetch the project ref from Supabase
      const { data, error: fetchError } = await supabase.rpc('get_project_ref');
      
      if (fetchError) {
        // If the function doesn't exist, let's try a simple query instead
        const { data: serverData, error: serverError } = await supabase
          .from('servers')
          .select('count(*)', { count: 'exact', head: true });
          
        if (serverError) {
          throw serverError;
        }
        
        // If we got here, the connection works
        setConnectionSuccess(true);
      } else {
        setConnectionSuccess(true);
        // Use the data from RPC if available
        if (data) {
          setProjectId(data);
        }
      }
    } catch (err: any) {
      console.error('Supabase connection test failed:', err);
      setConnectionSuccess(false);
      setError(err.message || 'Unknown error occurred');
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    testConnection();
  }, []);

  return (
    <Card>
      <CardHeader>
        <CardTitle>Supabase Connection Test</CardTitle>
        <CardDescription>
          Checking connection to Supabase and verifying environment
        </CardDescription>
      </CardHeader>
      <CardContent>
        {isLoading ? (
          <div className="flex items-center justify-center p-4">
            <Loader2 className="h-8 w-8 animate-spin text-primary" />
            <span className="ml-2">Testing connection...</span>
          </div>
        ) : connectionSuccess ? (
          <Alert className="bg-green-50 border-green-200">
            <AlertTitle className="text-green-800">Connection Successful</AlertTitle>
            <AlertDescription className="text-green-700">
              <p>Connected to Supabase in <strong>{environment}</strong> environment</p>
              <p>Project ID: <strong>{projectId}</strong></p>
            </AlertDescription>
          </Alert>
        ) : (
          <Alert className="bg-red-50 border-red-200">
            <AlertTitle className="text-red-800">Connection Failed</AlertTitle>
            <AlertDescription className="text-red-700">
              <p>Error: {error}</p>
              <p>Current environment: <strong>{environment}</strong></p>
              <Button 
                onClick={testConnection} 
                className="mt-2 bg-red-600 hover:bg-red-700"
              >
                Retry Connection
              </Button>
            </AlertDescription>
          </Alert>
        )}
      </CardContent>
    </Card>
  );
}
