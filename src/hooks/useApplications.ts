
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

      if (error) throw error;

      return applications.map(app => ({
        ...app,
        servers: app.servers.map(s => s.server),
        technologies: app.technologies.map(t => t.technology)
      })) as ApplicationWithRelations[];
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

      if (error) throw error;
      
      return {
        ...data,
        servers: data.servers.map(s => s.server),
        technologies: data.technologies.map(t => t.technology)
      } as ApplicationWithRelations;
    },
    enabled: !!id
  });
};
