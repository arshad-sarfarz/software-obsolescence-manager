
import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { SupportStatus, ServerStatus, RemediationStatus } from '@/types';

interface DashboardStats {
  serverCount: number;
  applicationCount: number;
  technologyCount: number;
  remediationCount: number;
  serversWithIssues: number;
}

interface StatusCounts {
  EOL: number;
  SS: number;
  ES: number;
  ESU: number;
}

interface RemediationStatusCounts {
  'Not started': number;
  'In progress': number;
  'Completed': number;
}

interface ServerStatusCounts {
  'Active': number;
  'Upgraded': number;
  'Migrated to cloud': number;
  'Decommissioned': number;
}

export function useDashboardData() {
  // Fetch basic counts for dashboard stats
  const { data: stats = { serverCount: 0, applicationCount: 0, technologyCount: 0, remediationCount: 0, serversWithIssues: 0 } } = useQuery({
    queryKey: ['dashboard-stats'],
    queryFn: async () => {
      console.log("Fetching dashboard stats...");
      
      // Fetch servers count
      const { count: serverCount } = await supabase
        .from('servers')
        .select('*', { count: 'exact', head: true });
        
      // Fetch applications count
      const { count: applicationCount } = await supabase
        .from('applications')
        .select('*', { count: 'exact', head: true });
        
      // Fetch technologies count
      const { count: technologyCount } = await supabase
        .from('technologies')
        .select('*', { count: 'exact', head: true });
        
      // Fetch remediations count
      const { count: remediationCount } = await supabase
        .from('remediations')
        .select('*', { count: 'exact', head: true });

      // Count servers with EOL technologies
      const { data: serverTechs } = await supabase
        .from('server_technologies')
        .select(`
          server_id,
          technology:technologies (
            id,
            support_status
          )
        `);

      // Identify servers with EOL technologies
      const serversWithEolTech = new Set();
      serverTechs?.forEach(st => {
        if (st.technology?.support_status === 'EOL') {
          serversWithEolTech.add(st.server_id);
        }
      });

      return {
        serverCount: serverCount || 0,
        applicationCount: applicationCount || 0,
        technologyCount: technologyCount || 0,
        remediationCount: remediationCount || 0,
        serversWithIssues: serversWithEolTech.size
      };
    }
  });

  // Fetch technology support status counts for charts
  const { data: supportStatusCounts = { EOL: 0, SS: 0, ES: 0, ESU: 0 } } = useQuery({
    queryKey: ['support-status-counts'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('technologies')
        .select('support_status');
      
      if (error) throw error;
      
      const counts: StatusCounts = { EOL: 0, SS: 0, ES: 0, ESU: 0 };
      
      data.forEach(tech => {
        counts[tech.support_status as SupportStatus] = (counts[tech.support_status as SupportStatus] || 0) + 1;
      });
      
      return counts;
    }
  });

  // Fetch remediation status counts for charts
  const { data: remediationStatusCounts = { 'Not started': 0, 'In progress': 0, 'Completed': 0 } } = useQuery({
    queryKey: ['remediation-status-counts'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('remediations')
        .select('status');
      
      if (error) throw error;
      
      const counts: RemediationStatusCounts = { 'Not started': 0, 'In progress': 0, 'Completed': 0 };
      
      data.forEach(remediation => {
        counts[remediation.status as RemediationStatus] = 
          (counts[remediation.status as RemediationStatus] || 0) + 1;
      });
      
      return counts;
    }
  });

  // Fetch server status counts for charts
  const { data: serverStatusCounts = { 'Active': 0, 'Upgraded': 0, 'Migrated to cloud': 0, 'Decommissioned': 0 } } = useQuery({
    queryKey: ['server-status-counts'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('servers')
        .select('status');
      
      if (error) throw error;
      
      const counts: ServerStatusCounts = { 
        'Active': 0, 
        'Upgraded': 0, 
        'Migrated to cloud': 0, 
        'Decommissioned': 0 
      };
      
      data.forEach(server => {
        counts[server.status as ServerStatus] = 
          (counts[server.status as ServerStatus] || 0) + 1;
      });
      
      return counts;
    }
  });
  
  return {
    stats,
    supportStatusCounts,
    remediationStatusCounts,
    serverStatusCounts
  };
}
