
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
      
      // Fetch applications with their related servers and technologies
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
        console.error('Error fetching applications:', error);
        throw error;
      }

      console.log('Raw applications data:', applications);
      
      if (!applications || applications.length === 0) {
        console.log('No applications found in the database');
        return [];
      }

      try {
        const transformedApps = applications.map(app => ({
          ...app,
          servers: app.servers ? app.servers.map(s => s.server) : [],
          technologies: app.technologies ? app.technologies.map(t => t.technology) : []
        })) as ApplicationWithRelations[];
        
        console.log('Transformed applications:', transformedApps);
        return transformedApps;
      } catch (err) {
        console.error('Error transforming applications data:', err);
        // Return empty array if transformation fails to prevent UI errors
        return [];
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
