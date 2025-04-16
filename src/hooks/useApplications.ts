
import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import type { Tables } from '@/integrations/supabase/types';

export type Application = Tables<'applications'>;
export type ApplicationWithRelations = Application & {
  servers: Tables<'servers'>[];
  technologies: Tables<'technologies'>[];
};

export const useApplications = () => {
  return useQuery({
    queryKey: ['applications'],
    queryFn: async () => {
      console.log('Fetching applications...');
      
      try {
        // First, try to fetch applications from Supabase
        const { data: applications, error } = await supabase
          .from('applications')
          .select(`
            *,
            servers:application_servers(
              server:servers(*)
            ),
            technologies:application_technologies(
              technology:technologies(*)
            )
          `);
          
        console.log('Applications query result:', applications);
        
        if (error) {
          console.error('Error fetching applications:', error);
          throw error;
        }
        
        if (!applications || applications.length === 0) {
          console.log('No applications found in the database, using mock data');
          
          // If no applications found, use mock data
          const { applications: mockApps } = await import('@/data/mockData');
          const { getServerById, getTechnologyById } = await import('@/data/mockData');
          
          const mockApplicationsWithRelations = mockApps.map(app => {
            return {
              ...app,
              servers: app.servers.map(serverId => getServerById(serverId)).filter(Boolean),
              technologies: app.technologies.map(techId => getTechnologyById(techId)).filter(Boolean)
            };
          });
          
          console.log('Mock applications data:', mockApplicationsWithRelations);
          return mockApplicationsWithRelations as ApplicationWithRelations[];
        }
        
        // Transform the applications data
        try {
          const transformedApps = applications.map(app => {
            return {
              ...app,
              servers: app.servers && Array.isArray(app.servers) 
                ? app.servers.map(s => s.server).filter(Boolean) 
                : [],
              technologies: app.technologies && Array.isArray(app.technologies) 
                ? app.technologies.map(t => t.technology).filter(Boolean) 
                : []
            };
          }) as ApplicationWithRelations[];
          
          console.log('Transformed applications:', transformedApps);
          return transformedApps;
        } catch (err) {
          console.error('Error transforming applications data:', err);
          throw new Error('Failed to process application data');
        }
      } catch (err) {
        console.error('Error in applications query:', err);
        throw err;
      }
    }
  });
};

export const useApplication = (id: string) => {
  return useQuery({
    queryKey: ['applications', id],
    queryFn: async () => {
      if (!id) {
        throw new Error('Application ID is required');
      }
      
      try {
        const { data, error } = await supabase
          .from('applications')
          .select(`
            *,
            servers:application_servers(
              server:servers(*)
            ),
            technologies:application_technologies(
              technology:technologies(*)
            )
          `)
          .eq('id', id)
          .single();

        if (error) {
          console.error(`Error fetching application ${id}:`, error);
          throw error;
        }
        
        // Transform the application data
        return {
          ...data,
          servers: data.servers ? data.servers.map(s => s.server) : [],
          technologies: data.technologies ? data.technologies.map(t => t.technology) : []
        } as ApplicationWithRelations;
      } catch (err) {
        console.error(`Error in application query for ID ${id}:`, err);
        throw err;
      }
    },
    enabled: !!id
  });
};
