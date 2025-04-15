
import { useQuery } from '@tanstack/react-query';
import { flexeraService } from '@/services/flexera';

export const useFlexeraProducts = (page = 1, per_page = 10) => {
  return useQuery({
    queryKey: ['flexera', 'products', page, per_page],
    queryFn: () => flexeraService.getProducts(page, per_page)
  });
};

export const useFlexeraProduct = (id: string) => {
  return useQuery({
    queryKey: ['flexera', 'product', id],
    queryFn: () => flexeraService.getProductById(id)
  });
};

export const useFlexeraInstances = (page = 1, per_page = 10) => {
  return useQuery({
    queryKey: ['flexera', 'instances', page, per_page],
    queryFn: () => flexeraService.getInstances(page, per_page)
  });
};

export const useFlexeraInstance = (id: string) => {
  return useQuery({
    queryKey: ['flexera', 'instance', id],
    queryFn: () => flexeraService.getInstanceById(id)
  });
};
