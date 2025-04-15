
import { FlexeraProduct, FlexeraResponse } from './types';

const mockProducts: FlexeraProduct[] = [
  {
    id: 'prod_001',
    name: 'Windows Server',
    version: '2012 R2',
    vendor: 'Microsoft',
    eol_date: '2023-10-10',
    eos_date: '2018-10-09',
    extended_support_date: '2026-10-10',
    risk_level: 'High'
  },
  {
    id: 'prod_002',
    name: 'Oracle Database',
    version: '12c',
    vendor: 'Oracle',
    eol_date: '2022-07-31',
    eos_date: '2018-07-31',
    extended_support_date: null,
    risk_level: 'High'
  },
  {
    id: 'prod_003',
    name: 'Red Hat Enterprise Linux',
    version: '7',
    vendor: 'Red Hat',
    eol_date: '2024-06-30',
    eos_date: '2019-12-31',
    extended_support_date: '2026-06-30',
    risk_level: 'Medium'
  }
];

export const getProducts = (page = 1, per_page = 10): Promise<FlexeraResponse<FlexeraProduct[]>> => {
  return new Promise((resolve) => {
    setTimeout(() => {
      const start = (page - 1) * per_page;
      const end = start + per_page;
      const paginatedData = mockProducts.slice(start, end);
      
      resolve({
        data: paginatedData,
        meta: {
          total: mockProducts.length,
          page,
          per_page
        }
      });
    }, 500); // Simulate network delay
  });
};

export const getProductById = (id: string): Promise<FlexeraProduct | null> => {
  return new Promise((resolve) => {
    setTimeout(() => {
      const product = mockProducts.find(p => p.id === id) || null;
      resolve(product);
    }, 300);
  });
};
