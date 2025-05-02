
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
    // Fixing the production URL and anon key - this should match what's in your Supabase dashboard
    supabaseUrl: 'https://izypximwilmpxdyotfra.supabase.co',
    supabaseAnonKey: 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Iml6eXB4aW13aWxtcHhkeW90ZnJhIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDUxNzI3MjUsImV4cCI6MjA2MDc0ODcyNX0.hr85kRR1vSUwAYVq_mYH8RU73rRK3oaUdWuKdNR3Q1A',
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

    // If no valid forced environment, always default to development regardless of hostname
    // This is the change - removed the hostname detection logic and always return 'development'
    console.log('No forced environment set, defaulting to development');
    return 'development';
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

