
/**
 * Environment Configuration Utility
 * 
 * This module provides a consistent way to access environment variables
 * across the application. It retrieves values from Supabase edge functions
 * or fallbacks to default values when in development.
 */

import { supabase } from "@/integrations/supabase/client";

// Cached environment values
let cachedEnvValues: Record<string, string | null> = {};

// Type definition for environment variables
export type EnvVariable = 
  | "FLEXERA_API_KEY"
  | "FLEXERA_API_URL"
  | "OTHER_API_SECRET";

/**
 * Retrieves an environment variable value
 * 
 * @param key The environment variable name
 * @param defaultValue Optional default value if not found
 * @returns The value of the environment variable or default value
 */
export async function getEnvValue(
  key: EnvVariable, 
  defaultValue: string | null = null
): Promise<string | null> {
  // Check cache first
  if (cachedEnvValues[key] !== undefined) {
    return cachedEnvValues[key];
  }
  
  try {
    // Call the get-env-value edge function to retrieve the value securely
    const { data, error } = await supabase.functions.invoke('get-env-value', {
      body: { key }
    });
    
    if (error) {
      console.error(`Error fetching environment variable ${key}:`, error);
      cachedEnvValues[key] = defaultValue;
      return defaultValue;
    }
    
    const value = data?.value || defaultValue;
    cachedEnvValues[key] = value;
    return value;
  } catch (error) {
    console.error(`Error retrieving environment variable ${key}:`, error);
    cachedEnvValues[key] = defaultValue;
    return defaultValue;
  }
}

/**
 * Configures Flexera API settings from environment
 * 
 * @returns Promise with Flexera configuration
 */
export async function getFlexeraConfig() {
  const apiKey = await getEnvValue("FLEXERA_API_KEY");
  const apiUrl = await getEnvValue("FLEXERA_API_URL", "https://api.flexera.com/v1");
  
  return {
    apiKey: apiKey || undefined,
    apiUrl: apiUrl || "https://api.flexera.com/v1",
    useMock: !apiKey // Use mock data if no API key is provided
  };
}

