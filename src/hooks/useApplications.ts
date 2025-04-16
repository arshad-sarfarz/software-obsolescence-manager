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
          
          // Create mock server and technology objects that match the database schema
          const mockApplicationsWithRelations = mockApps.map(app => {
            const mockServers = app.servers
              .map(serverId => {
                const server = getServerById(serverId);
                if (!server) return null;
                
                // Transform mock server to match database schema
                return {
                  id: server.id,
                  name: server.name,
                  owner: server.owner,
                  team: server.team,
                  status: server.status.toLowerCase().replace(/ /g, '_') as Tables<'servers'>['status'],
                  comments: server.comments,
                  created_at: new Date().toISOString(),
                  updated_at: new Date().toISOString(),
                };
              })
              .filter(Boolean) as Tables<'servers'>[];
              
            const mockTechnologies = app.technologies
              .map(techId => {
                const tech = getTechnologyById(techId);
                if (!tech) return null;
                
                // Transform mock technology to match database schema
                return {
                  id: tech.id,
                  name: tech.name,
                  version: tech.version,
                  category: tech.category,
                  support_status: tech.supportStatus as Tables<'technologies'>['support_status'],
                  support_end_date: tech.supportEndDate,
                  standard_support_end_date: tech.standardSupportEndDate || null,
                  extended_support_end_date: tech.extendedSupportEndDate || null,
                  extended_security_update_end_date: tech.extendedSecurityUpdateEndDate || null,
                  created_at: new Date().toISOString(),
                  updated_at: new Date().toISOString(),
                };
              })
              .filter(Boolean) as Tables<'technologies'>[];
            
            return {
              id: app.id,
              name: app.name,
              description: app.description,
              owner: app.owner,
              team: app.team,
              criticality: app.criticality.toLowerCase() as Application['criticality'],
              created_at: new Date().toISOString(),
              updated_at: new Date().toISOString(),
              servers: mockServers,
              technologies: mockTechnologies
            } as ApplicationWithRelations;
          });
          
          console.log('Mock applications data:', mockApplicationsWithRelations);
          return mockApplicationsWithRelations;
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

export const useOrphanedApplications = () => {
  return useQuery({
    queryKey: ['orphaned-applications'],
    queryFn: async () => {
      console.log('Fetching orphaned applications directly from the database...');
      
      try {
        // Get applications that don't have any servers or technologies
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
        
        return orphanedApps || [];
      } catch (err) {
        console.error('Error in orphaned applications query:', err);
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
