
import { FlexeraInstance, FlexeraResponse } from './types';

const mockInstances: FlexeraInstance[] = [
  {
    id: 'inst_001',
    hostname: 'PRDSRV01',
    ip_address: '192.168.1.101',
    operating_system: 'Windows Server',
    os_version: '2012 R2',
    last_seen: '2024-04-15T10:30:00Z',
    installed_products: ['prod_001', 'prod_002']
  },
  {
    id: 'inst_002',
    hostname: 'DBSRV01',
    ip_address: '192.168.1.102',
    operating_system: 'Red Hat Enterprise Linux',
    os_version: '7',
    last_seen: '2024-04-15T10:25:00Z',
    installed_products: ['prod_002', 'prod_003']
  }
];

export const getInstances = (page = 1, per_page = 10): Promise<FlexeraResponse<FlexeraInstance[]>> => {
  return new Promise((resolve) => {
    setTimeout(() => {
      const start = (page - 1) * per_page;
      const end = start + per_page;
      const paginatedData = mockInstances.slice(start, end);
      
      resolve({
        data: paginatedData,
        meta: {
          total: mockInstances.length,
          page,
          per_page
        }
      });
    }, 500);
  });
};

export const getInstanceById = (id: string): Promise<FlexeraInstance | null> => {
  return new Promise((resolve) => {
    setTimeout(() => {
      const instance = mockInstances.find(i => i.id === id) || null;
      resolve(instance);
    }, 300);
  });
};
