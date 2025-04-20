
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

// Function to directly access localStorage with error handling
const getLocalStorageItem = (key: string): string | null => {
  try {
    return localStorage.getItem(key);
  } catch (error) {
    console.error('Error accessing localStorage:', error);
    return null;
  }
};

// Define the current environment
export const getCurrentEnvironment = (): Environment => {
  try {
    // Check for forced environment in localStorage (case insensitive)
    const forcedEnv = getLocalStorageItem('FORCE_ENVIRONMENT');
    
    // Log the current value of FORCE_ENVIRONMENT
    console.log('Current FORCE_ENVIRONMENT value:', forcedEnv);
    
    if (forcedEnv) {
      // Convert to lowercase for case-insensitive comparison
      const normalizedEnv = forcedEnv.toLowerCase();
      
      if (normalizedEnv === 'development' || normalizedEnv === 'production') {
        const validEnv = normalizedEnv as Environment;
        console.log(`Using forced environment from localStorage: ${validEnv}`);
        return validEnv;
      } else {
        console.warn(`Invalid forced environment value: ${forcedEnv}. Using auto-detection instead.`);
      }
    }

    // If no valid forced environment, check if we're in production based on the hostname
    const hostname = window.location.hostname;
    const isProduction = hostname.includes('lovable.app') || 
                         hostname.includes('izypximwilmpxdyotfra.supabase.co') ||
                         hostname === 'production-app-domain.com';
    
    console.log(`Current environment auto-detected as: ${isProduction ? 'production' : 'development'}`);
    console.log(`Hostname: ${hostname}`);
    return isProduction ? 'production' : 'development';
  } catch (error) {
    console.error('Error determining environment:', error);
    // Default to development in case of any errors
    return 'development';
  }
};

// Get the configuration for the current environment
export const getEnvironmentConfig = (): EnvironmentConfig => {
  const environment = getCurrentEnvironment();
  console.log(`Using Supabase configuration for: ${environment}`);
  console.log(`Project ID: ${configs[environment].projectId}`);
  console.log(`Supabase URL: ${configs[environment].supabaseUrl}`);
  return configs[environment];
};
