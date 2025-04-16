
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
        
        // Transform the applications data
        const transformedApps = (applications || []).map(app => ({
          ...app,
          servers: app.servers ? app.servers.map(s => s.server) : [],
          technologies: app.technologies ? app.technologies.map(t => t.technology) : []
        })) as ApplicationWithRelations[];
        
        console.log('Transformed applications:', transformedApps);
        return transformedApps;
      } catch (err) {
        console.error('Error in applications query:', err);
        throw err;
      }
    }
  });
};

export const useOrphanedApplications = () => {
  return useQuery({
    queryKey: ['orphaned-applications'],
    queryFn: async () => {
      console.log('Fetching orphaned applications directly from the database...');
      
      try {
        const { data: orphanedApps, error } = await supabase
          .from('applications')
          .select('*')
          .not('id', 'in', (
            supabase
              .from('application_servers')
              .select('application_id')
          ))
          .not('id', 'in', (
            supabase
              .from('application_technologies')
              .select('application_id')
          ));
        
        console.log('Orphaned applications query result:', orphanedApps);
        
        if (error) {
          console.error('Error fetching orphaned applications:', error);
          throw error;
        }
        
        // Transform the data to match ApplicationWithRelations by adding empty arrays
        const transformedData = (orphanedApps || []).map(app => ({
          ...app,
          servers: [] as Tables<'servers'>[],
          technologies: [] as Tables<'technologies'>[]
        })) as ApplicationWithRelations[];
        
        return transformedData;
      } catch (err) {
        console.error('Error in orphaned applications query:', err);
        throw err;
      }
    }
  });
};

