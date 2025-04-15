
export interface FlexeraConfig {
  apiUrl: string;
  apiKey?: string;
  useMock: boolean;
}

export const flexeraConfig: FlexeraConfig = {
  apiUrl: 'https://api.flexera.com/v1', // Replace with actual Flexera API URL
  useMock: true // Toggle between mock and real API
};
