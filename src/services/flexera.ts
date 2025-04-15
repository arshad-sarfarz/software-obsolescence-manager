
import { flexeraConfig } from '@/config/flexera';
import { FlexeraInstance, FlexeraProduct, FlexeraResponse } from '@/mocks/api/flexera/types';
import * as mockApi from '@/mocks/api/flexera';

class FlexeraService {
  private config = flexeraConfig;

  async getProducts(page = 1, per_page = 10): Promise<FlexeraResponse<FlexeraProduct[]>> {
    if (this.config.useMock) {
      return mockApi.getProducts(page, per_page);
    }
    
    // Implement real API call here when ready
    throw new Error('Real API not implemented yet');
  }

  async getProductById(id: string): Promise<FlexeraProduct | null> {
    if (this.config.useMock) {
      return mockApi.getProductById(id);
    }
    
    // Implement real API call here when ready
    throw new Error('Real API not implemented yet');
  }

  async getInstances(page = 1, per_page = 10): Promise<FlexeraResponse<FlexeraInstance[]>> {
    if (this.config.useMock) {
      return mockApi.getInstances(page, per_page);
    }
    
    // Implement real API call here when ready
    throw new Error('Real API not implemented yet');
  }

  async getInstanceById(id: string): Promise<FlexeraInstance | null> {
    if (this.config.useMock) {
      return mockApi.getInstanceById(id);
    }
    
    // Implement real API call here when ready
    throw new Error('Real API not implemented yet');
  }
}

export const flexeraService = new FlexeraService();
