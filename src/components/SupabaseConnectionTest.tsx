
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
  const [forcedEnv, setForcedEnv] = useState<string | null>(null);

  const testConnection = async () => {
    setIsLoading(true);
    setError(null);
    
    try {
      // Check if environment is forced
      const storedForcedEnv = localStorage.getItem('FORCE_ENVIRONMENT');
      setForcedEnv(storedForcedEnv);
      
      // Get current environment info
      const env = getCurrentEnvironment();
      setEnvironment(env);
      
      // Get project ID from configuration
      const config = getEnvironmentConfig();
      setProjectId(config.projectId);
      
      // Try to fetch using a simple query
      const { data: serverData, error: serverError } = await supabase
        .from('servers')
        .select('count(*)', { count: 'exact', head: true });
        
      if (serverError) {
        throw serverError;
      }
      
      // If we got here, the connection works
      setConnectionSuccess(true);
    } catch (err: any) {
      console.error('Supabase connection test failed:', err);
      setConnectionSuccess(false);
      setError(err.message || 'Unknown error occurred');
    } finally {
      setIsLoading(false);
    }
  };

  // Switch environment when button is clicked
  const toggleEnvironment = () => {
    const currentEnv = getCurrentEnvironment();
    const newEnv = currentEnv === 'development' ? 'production' : 'development';
    localStorage.setItem('FORCE_ENVIRONMENT', newEnv);
    
    // Reload the page to apply changes
    window.location.reload();
  };

  // Clear forced environment
  const clearForcedEnvironment = () => {
    localStorage.removeItem('FORCE_ENVIRONMENT');
    // Reload the page to apply changes
    window.location.reload();
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
        ) : (
          <div className="space-y-4">
            {forcedEnv && (
              <Alert className="bg-blue-50 border-blue-200">
                <AlertTitle className="text-blue-800">Environment Override</AlertTitle>
                <AlertDescription className="text-blue-700">
                  <p>Environment forced via localStorage: <strong>{forcedEnv}</strong></p>
                  <Button 
                    onClick={clearForcedEnvironment} 
                    className="mt-2 bg-blue-600 hover:bg-blue-700"
                    size="sm"
                  >
                    Clear Forced Environment
                  </Button>
                </AlertDescription>
              </Alert>
            )}
            
            {connectionSuccess ? (
              <Alert className="bg-green-50 border-green-200">
                <AlertTitle className="text-green-800">Connection Successful</AlertTitle>
                <AlertDescription className="text-green-700">
                  <p>Connected to Supabase in <strong>{environment}</strong> environment</p>
                  <p>Project ID: <strong>{projectId}</strong></p>
                  <Button 
                    onClick={toggleEnvironment} 
                    className="mt-2 bg-green-600 hover:bg-green-700"
                    size="sm"
                  >
                    Switch to {environment === 'development' ? 'Production' : 'Development'}
                  </Button>
                </AlertDescription>
              </Alert>
            ) : (
              <Alert className="bg-red-50 border-red-200">
                <AlertTitle className="text-red-800">Connection Failed</AlertTitle>
                <AlertDescription className="text-red-700">
                  <p>Error: {error}</p>
                  <p>Current environment: <strong>{environment}</strong></p>
                  <div className="flex gap-2 mt-2">
                    <Button 
                      onClick={testConnection} 
                      className="bg-red-600 hover:bg-red-700"
                      size="sm"
                    >
                      Retry Connection
                    </Button>
                    <Button 
                      onClick={toggleEnvironment} 
                      className="bg-red-600 hover:bg-red-700"
                      size="sm"
                    >
                      Switch to {environment === 'development' ? 'Production' : 'Development'}
                    </Button>
                  </div>
                </AlertDescription>
              </Alert>
            )}
          </div>
        )}
      </CardContent>
    </Card>
  );
}
