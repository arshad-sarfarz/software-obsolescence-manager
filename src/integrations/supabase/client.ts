
import { createClient } from '@supabase/supabase-js';
import type { Database } from './types';
import { getEnvironmentConfig } from '@/config/environment-config';

const config = getEnvironmentConfig();

export const supabase = createClient<Database>(
  config.supabaseUrl,
  config.supabaseAnonKey
);
