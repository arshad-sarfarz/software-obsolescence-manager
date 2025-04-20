
import { useQuery } from '@tanstack/react-query';
import { flexeraService } from '@/services/flexera';
import { useState, useEffect } from 'react';

// Hook to ensure Flexera service is initialized before making queries
const useFlexeraInit = () => {
  const [isInitialized, setIsInitialized] = useState(false);
  
  useEffect(() => {
    let isMounted = true;
    
    const initialize = async () => {
      try {
        await flexeraService.initialize();
        if (isMounted) setIsInitialized(true);
      } catch (error) {
        console.error('Failed to initialize Flexera service:', error);
        if (isMounted) setIsInitialized(true); // Still set to true to unblock UI
      }
    };
    
    initialize();
    
    return () => {
      isMounted = false;
    };
  }, []);
  
  return isInitialized;
};

export const useFlexeraProducts = (page = 1, per_page = 10) => {
  const isInitialized = useFlexeraInit();
  
  return useQuery({
    queryKey: ['flexera', 'products', page, per_page],
    queryFn: () => flexeraService.getProducts(page, per_page),
    enabled: isInitialized // Only run query when service is initialized
  });
};

export const useFlexeraProduct = (id: string) => {
  const isInitialized = useFlexeraInit();
  
  return useQuery({
    queryKey: ['flexera', 'product', id],
    queryFn: () => flexeraService.getProductById(id),
    enabled: isInitialized && !!id // Only run query when service is initialized and id is provided
  });
};

export const useFlexeraInstances = (page = 1, per_page = 10) => {
  const isInitialized = useFlexeraInit();
  
  return useQuery({
    queryKey: ['flexera', 'instances', page, per_page],
    queryFn: () => flexeraService.getInstances(page, per_page),
    enabled: isInitialized // Only run query when service is initialized
  });
};

export const useFlexeraInstance = (id: string) => {
  const isInitialized = useFlexeraInit();
  
  return useQuery({
    queryKey: ['flexera', 'instance', id],
    queryFn: () => flexeraService.getInstanceById(id),
    enabled: isInitialized && !!id // Only run query when service is initialized and id is provided
  });
};
