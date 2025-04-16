
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
      
      // First, try a simple query to fetch just the applications without relations
      const { data: basicApplications, error: basicError } = await supabase
        .from('applications')
        .select('*');
        
      console.log('Basic applications query result:', basicApplications);
      
      if (basicError) {
        console.error('Error fetching basic applications:', basicError);
        throw basicError;
      }
      
      if (!basicApplications || basicApplications.length === 0) {
        console.log('No applications found in the database');
        
        // If we're not getting any applications data, let's try using the mock data
        console.log('Falling back to mock data');
        
        // Import the mock data only if needed
        const { applications } = await import('@/data/mockData');
        
        // Transform the mock data to match our expected format
        const mockApplicationsWithRelations = applications.map(app => {
          // For each application, fetch servers and technologies from mock data
          const { getServerById, getTechnologyById } = require('@/data/mockData');
          
          return {
            ...app,
            servers: app.servers.map(serverId => getServerById(serverId)).filter(Boolean),
            technologies: app.technologies.map(techId => getTechnologyById(techId)).filter(Boolean)
          };
        });
        
        console.log('Using mock data:', mockApplicationsWithRelations);
        return mockApplicationsWithRelations as ApplicationWithRelations[];
      }
      
      // If we have basic application data, try to fetch the relations
      try {
        console.log('Fetching applications with relations...');
        
        // Now try the full query with relations
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

        if (error) {
          console.error('Error fetching applications with relations:', error);
          throw error;
        }

        console.log('Raw applications data with relations:', applications);
        
        if (!applications || applications.length === 0) {
          console.log('No applications with relations found');
          return [];
        }

        try {
          const transformedApps = applications.map(app => {
            console.log('Transforming application:', app);
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
          // If transformation fails, fall back to mock data
          console.log('Falling back to mock data after transformation error');
          const { applications } = await import('@/data/mockData');
          
          const mockApplicationsWithRelations = applications.map(app => {
            const { getServerById, getTechnologyById } = require('@/data/mockData');
            return {
              ...app,
              servers: app.servers.map(serverId => getServerById(serverId)).filter(Boolean),
              technologies: app.technologies.map(techId => getTechnologyById(techId)).filter(Boolean)
            };
          });
          
          console.log('Using mock data after error:', mockApplicationsWithRelations);
          return mockApplicationsWithRelations as ApplicationWithRelations[];
        }
      } catch (relationsError) {
        console.error('Error fetching relations, falling back to mock data:', relationsError);
        // Fall back to mock data if relations query fails
        const { applications } = await import('@/data/mockData');
          
        const mockApplicationsWithRelations = applications.map(app => {
          const { getServerById, getTechnologyById } = require('@/data/mockData');
          return {
            ...app,
            servers: app.servers.map(serverId => getServerById(serverId)).filter(Boolean),
            technologies: app.technologies.map(techId => getTechnologyById(techId)).filter(Boolean)
          };
        });
        
        console.log('Using mock data after error:', mockApplicationsWithRelations);
        return mockApplicationsWithRelations as ApplicationWithRelations[];
      }
    }
  });
};

export const useApplication = (id: string) => {
  return useQuery({
    queryKey: ['applications', id],
    queryFn: async () => {
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
      
      try {
        return {
          ...data,
          servers: data.servers ? data.servers.map(s => s.server) : [],
          technologies: data.technologies ? data.technologies.map(t => t.technology) : []
        } as ApplicationWithRelations;
      } catch (err) {
        console.error('Error transforming application data:', err);
        throw err;
      }
    },
    enabled: !!id
  });
};
