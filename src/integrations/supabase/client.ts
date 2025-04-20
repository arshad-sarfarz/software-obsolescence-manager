
import { createClient } from '@supabase/supabase-js';
import type { Database } from './types';
import { getEnvironmentConfig } from '@/config/environment-config';

const config = getEnvironmentConfig();

// Creating the Supabase client with explicit auth settings to ensure consistent behavior
export const supabase = createClient<Database>(
  config.supabaseUrl,
  config.supabaseAnonKey,
  {
    auth: {
      autoRefreshToken: true,
      persistSession: true,
      storage: localStorage
    }
  }
);

// Log the initialization for debugging
console.log(`Supabase client initialized with URL: ${config.supabaseUrl}`);
console.log(`Project ID: ${config.projectId}`);
