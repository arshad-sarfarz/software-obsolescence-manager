
import { getFlexeraConfig as getEnvFlexeraConfig } from './environment';

export interface FlexeraConfig {
  apiUrl: string;
  apiKey?: string;
  useMock: boolean;
}

// Default configuration
export const flexeraConfig: FlexeraConfig = {
  apiUrl: 'https://api.flexera.com/v1',
  useMock: true // Default to using mock data
};

// Function to initialize configuration from environment variables
export async function initializeFlexeraConfig(): Promise<FlexeraConfig> {
  try {
    return await getEnvFlexeraConfig();
  } catch (error) {
    console.error('Failed to initialize Flexera config from environment:', error);
    return flexeraConfig; // Fall back to default config
  }
}
