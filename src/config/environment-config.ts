
// Environment configuration for the application
export type Environment = 'development' | 'production';

interface EnvironmentConfig {
  supabaseUrl: string;
  supabaseAnonKey: string;
  projectId: string;
}

const configs: Record<Environment, EnvironmentConfig> = {
  development: {
    supabaseUrl: 'https://cfncqjzmjhixnmmhmxeq.supabase.co',
    supabaseAnonKey: 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImNmbmNxanptamhpeG5tbWhteGVxIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDQ3NTQxNjcsImV4cCI6MjA2MDMzMDE2N30.0hf6138Ensy0Oko__NYV-LpxbAIAA2-LwapV7oQ-MZM',
    projectId: 'cfncqjzmjhixnmmhmxeq'
  },
  production: {
    supabaseUrl: 'https://izypximwilmpxdyotfra.supabase.co',
    supabaseAnonKey: 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Iml6eXB4aW13aWxtcHhkeW90ZnJhIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDQ3NTQxNjcsImV4cCI6MjA2MDMzMDE2N30.0hf6138Ensy0Oko__NYV-LpxbAIAA2-LwapV7oQ-MZM',
    projectId: 'izypximwilmpxdyotfra'
  }
};

// Define the current environment
export const getCurrentEnvironment = (): Environment => {
  // Check if we're in production based on the hostname
  const isProduction = window.location.hostname.includes('lovable.app') || 
                       window.location.hostname.includes('izypximwilmpxdyotfra.supabase.co') ||
                       window.location.hostname === 'production-app-domain.com'; // Replace with your actual production domain if applicable
  
  console.log(`Current environment detected as: ${isProduction ? 'production' : 'development'}`);
  return isProduction ? 'production' : 'development';
};

// Get the configuration for the current environment
export const getEnvironmentConfig = (): EnvironmentConfig => {
  const environment = getCurrentEnvironment();
  console.log(`Using Supabase configuration for: ${environment}`);
  console.log(`Project ID: ${configs[environment].projectId}`);
  console.log(`Supabase URL: ${configs[environment].supabaseUrl}`);
  return configs[environment];
};
