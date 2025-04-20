
import { flexeraConfig, initializeFlexeraConfig } from '@/config/flexera';
import { FlexeraInstance, FlexeraProduct, FlexeraResponse } from '@/mocks/api/flexera/types';
import * as mockApi from '@/mocks/api/flexera';

class FlexeraService {
  private config = flexeraConfig;
  private initialized = false;

  // Initialize the service with environment variables
  async initialize() {
    if (!this.initialized) {
      this.config = await initializeFlexeraConfig();
      this.initialized = true;
      console.log('FlexeraService initialized with config:', {
        apiUrl: this.config.apiUrl,
        useMock: this.config.useMock,
        hasApiKey: !!this.config.apiKey
      });
    }
    return this;
  }

  async getProducts(page = 1, per_page = 10): Promise<FlexeraResponse<FlexeraProduct[]>> {
    // Ensure service is initialized
    await this.initialize();
    
    if (this.config.useMock) {
      return mockApi.getProducts(page, per_page);
    }
    
    // Real API implementation with the API key from environment
    try {
      const response = await fetch(`${this.config.apiUrl}/products?page=${page}&per_page=${per_page}`, {
        headers: {
          'Authorization': `Bearer ${this.config.apiKey}`,
          'Content-Type': 'application/json'
        }
      });
      
      if (!response.ok) {
        throw new Error(`API error: ${response.status}`);
      }
      
      return await response.json();
    } catch (error) {
      console.error('Error fetching products from Flexera API:', error);
      throw error;
    }
  }

  async getProductById(id: string): Promise<FlexeraProduct | null> {
    // Ensure service is initialized
    await this.initialize();
    
    if (this.config.useMock) {
      return mockApi.getProductById(id);
    }
    
    // Real API implementation with the API key from environment
    try {
      const response = await fetch(`${this.config.apiUrl}/products/${id}`, {
        headers: {
          'Authorization': `Bearer ${this.config.apiKey}`,
          'Content-Type': 'application/json'
        }
      });
      
      if (!response.ok) {
        if (response.status === 404) {
          return null;
        }
        throw new Error(`API error: ${response.status}`);
      }
      
      return await response.json();
    } catch (error) {
      console.error(`Error fetching product ${id} from Flexera API:`, error);
      throw error;
    }
  }

  async getInstances(page = 1, per_page = 10): Promise<FlexeraResponse<FlexeraInstance[]>> {
    // Ensure service is initialized
    await this.initialize();
    
    if (this.config.useMock) {
      return mockApi.getInstances(page, per_page);
    }
    
    // Real API implementation with the API key from environment
    try {
      const response = await fetch(`${this.config.apiUrl}/instances?page=${page}&per_page=${per_page}`, {
        headers: {
          'Authorization': `Bearer ${this.config.apiKey}`,
          'Content-Type': 'application/json'
        }
      });
      
      if (!response.ok) {
        throw new Error(`API error: ${response.status}`);
      }
      
      return await response.json();
    } catch (error) {
      console.error('Error fetching instances from Flexera API:', error);
      throw error;
    }
  }

  async getInstanceById(id: string): Promise<FlexeraInstance | null> {
    // Ensure service is initialized
    await this.initialize();
    
    if (this.config.useMock) {
      return mockApi.getInstanceById(id);
    }
    
    // Real API implementation with the API key from environment
    try {
      const response = await fetch(`${this.config.apiUrl}/instances/${id}`, {
        headers: {
          'Authorization': `Bearer ${this.config.apiKey}`,
          'Content-Type': 'application/json'
        }
      });
      
      if (!response.ok) {
        if (response.status === 404) {
          return null;
        }
        throw new Error(`API error: ${response.status}`);
      }
      
      return await response.json();
    } catch (error) {
      console.error(`Error fetching instance ${id} from Flexera API:`, error);
      throw error;
    }
  }
}

export const flexeraService = new FlexeraService();
