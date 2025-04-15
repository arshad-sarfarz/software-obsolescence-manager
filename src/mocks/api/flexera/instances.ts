
import { FlexeraInstance, FlexeraResponse } from './types';
import { getProductById } from './products';

const mockInstances: Omit<FlexeraInstance, 'installed_products'>[] = [
  {
    id: 'inst_001',
    hostname: 'PRDSRV01',
    ip_address: '192.168.1.101',
    operating_system: 'Windows Server',
    os_version: '2012 R2',
    last_seen: '2024-04-15T10:30:00Z'
  },
  {
    id: 'inst_002',
    hostname: 'DBSRV01',
    ip_address: '192.168.1.102',
    operating_system: 'Red Hat Enterprise Linux',
    os_version: '7',
    last_seen: '2024-04-15T10:25:00Z'
  }
];

const mockInstanceProducts = {
  'inst_001': ['prod_001', 'prod_002'],
  'inst_002': ['prod_002', 'prod_003']
};

export const getInstances = async (page = 1, per_page = 10): Promise<FlexeraResponse<FlexeraInstance[]>> => {
  return new Promise(async (resolve) => {
    setTimeout(async () => {
      const start = (page - 1) * per_page;
      const end = start + per_page;
      const paginatedInstances = mockInstances.slice(start, end);
      
      // Fetch products for each instance
      const instancesWithProducts = await Promise.all(
        paginatedInstances.map(async (instance) => {
          const productIds = mockInstanceProducts[instance.id as keyof typeof mockInstanceProducts] || [];
          const products = await Promise.all(
            productIds.map(id => getProductById(id))
          );
          return {
            ...instance,
            installed_products: products.filter((p): p is NonNullable<typeof p> => p !== null)
          };
        })
      );
      
      resolve({
        data: instancesWithProducts,
        meta: {
          total: mockInstances.length,
          page,
          per_page
        }
      });
    }, 500);
  });
};

export const getInstanceById = async (id: string): Promise<FlexeraInstance | null> => {
  return new Promise(async (resolve) => {
    setTimeout(async () => {
      const instance = mockInstances.find(i => i.id === id);
      if (!instance) {
        resolve(null);
        return;
      }
      
      const productIds = mockInstanceProducts[instance.id as keyof typeof mockInstanceProducts] || [];
      const products = await Promise.all(
        productIds.map(id => getProductById(id))
      );
      
      resolve({
        ...instance,
        installed_products: products.filter((p): p is NonNullable<typeof p> => p !== null)
      });
    }, 300);
  });
};
