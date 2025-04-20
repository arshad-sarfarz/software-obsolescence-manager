
import { useEffect, useState } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { getCurrentEnvironment } from '@/config/environment-config';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Loader2, RefreshCw, AlertTriangle } from 'lucide-react';
import { getEnvironmentConfig } from '@/config/environment-config';

export function SupabaseConnectionTest() {
  const [isLoading, setIsLoading] = useState(true);
  const [connectionSuccess, setConnectionSuccess] = useState<boolean | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [environment, setEnvironment] = useState<string>('');
  const [projectId, setProjectId] = useState<string>('');
  const [forcedEnv, setForcedEnv] = useState<string | null>(null);
  const [hostname, setHostname] = useState<string>('');

  const testConnection = async () => {
    setIsLoading(true);
    setError(null);
    
    try {
      // Set hostname for debugging
      setHostname(window.location.hostname);
      
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
    
    // Update localStorage
    try {
      localStorage.setItem('FORCE_ENVIRONMENT', newEnv);
      console.log(`Set FORCE_ENVIRONMENT to: ${newEnv}`);
    } catch (error) {
      console.error('Error setting localStorage:', error);
    }
    
    // Reload the page to apply changes
    window.location.reload();
  };

  // Set environment to a specific value
  const setEnvironmentTo = (env: string) => {
    try {
      localStorage.setItem('FORCE_ENVIRONMENT', env);
      console.log(`Set FORCE_ENVIRONMENT to: ${env}`);
    } catch (error) {
      console.error('Error setting localStorage:', error);
    }
    
    // Reload the page to apply changes
    window.location.reload();
  };

  // Clear forced environment
  const clearForcedEnvironment = () => {
    try {
      localStorage.removeItem('FORCE_ENVIRONMENT');
      console.log('Cleared FORCE_ENVIRONMENT from localStorage');
    } catch (error) {
      console.error('Error removing from localStorage:', error);
    }
    
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
            <Alert className="bg-blue-50 border-blue-200">
              <AlertTitle className="text-blue-800">Environment Information</AlertTitle>
              <AlertDescription className="text-blue-700 space-y-1">
                <p>Current Hostname: <strong>{hostname}</strong></p>
                <p>Environment: <strong>{environment}</strong></p>
                <p>Forced Environment: <strong>{forcedEnv || 'None (auto-detected)'}</strong></p>
                <p>Project ID: <strong>{projectId}</strong></p>
                
                <div className="flex flex-wrap gap-2 mt-3">
                  <Button
                    onClick={() => setEnvironmentTo('development')}
                    className="bg-blue-600 hover:bg-blue-700"
                    size="sm"
                    variant={environment === 'development' ? 'default' : 'outline'}
                  >
                    Set to Development
                  </Button>
                  <Button
                    onClick={() => setEnvironmentTo('production')}
                    className="bg-blue-600 hover:bg-blue-700"
                    size="sm"
                    variant={environment === 'production' ? 'default' : 'outline'}
                  >
                    Set to Production
                  </Button>
                  {forcedEnv && (
                    <Button
                      onClick={clearForcedEnvironment}
                      className="bg-gray-600 hover:bg-gray-700"
                      size="sm"
                    >
                      Clear Forced Environment
                    </Button>
                  )}
                  <Button
                    onClick={testConnection}
                    className="bg-green-600 hover:bg-green-700"
                    size="sm"
                  >
                    <RefreshCw className="h-4 w-4 mr-1" />
                    Refresh Status
                  </Button>
                </div>
              </AlertDescription>
            </Alert>
            
            {connectionSuccess ? (
              <Alert className="bg-green-50 border-green-200">
                <AlertTitle className="text-green-800">Connection Successful</AlertTitle>
                <AlertDescription className="text-green-700">
                  <p>Successfully connected to Supabase</p>
                </AlertDescription>
              </Alert>
            ) : (
              <Alert className="bg-red-50 border-red-200">
                <AlertTitle className="text-red-800">
                  <div className="flex items-center">
                    <AlertTriangle className="h-5 w-5 mr-2" />
                    Connection Failed
                  </div>
                </AlertTitle>
                <AlertDescription className="text-red-700">
                  <p>Error: {error}</p>
                </AlertDescription>
              </Alert>
            )}
          </div>
        )}
      </CardContent>
    </Card>
  );
}
