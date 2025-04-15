
import { Technology, Server, Application, Remediation, SupportStatus, RemediationStatus, ServerStatus } from '@/types';

// Generate random date in the future (0-3 years)
const getRandomFutureDate = (maxYears = 3): string => {
  const date = new Date();
  date.setFullYear(date.getFullYear() + Math.floor(Math.random() * maxYears));
  date.setMonth(Math.floor(Math.random() * 12));
  date.setDate(Math.floor(Math.random() * 28) + 1);
  return date.toISOString().split('T')[0];
};

// Generate random date in the past (0-1 year)
const getRandomPastDate = (): string => {
  const date = new Date();
  date.setFullYear(date.getFullYear() - Math.floor(Math.random() * 1));
  date.setMonth(Math.floor(Math.random() * 12));
  date.setDate(Math.floor(Math.random() * 28) + 1);
  return date.toISOString().split('T')[0];
};

// Generate technologies data
export const technologies: Technology[] = [
  // Operating Systems
  {
    id: 't1',
    name: 'Windows Server',
    version: '2012 R2',
    category: 'Operating System',
    supportStatus: 'EOL',
    supportEndDate: '2023-10-10',
    standardSupportEndDate: '2018-10-09',
    extendedSupportEndDate: '2023-10-10',
    extendedSecurityUpdateEndDate: '2026-10-10',
  },
  {
    id: 't2',
    name: 'Windows Server',
    version: '2016',
    category: 'Operating System',
    supportStatus: 'ES',
    supportEndDate: '2027-01-11',
    standardSupportEndDate: '2022-01-11',
    extendedSupportEndDate: '2027-01-11',
  },
  {
    id: 't3',
    name: 'Windows Server',
    version: '2019',
    category: 'Operating System',
    supportStatus: 'SS',
    supportEndDate: '2029-01-09',
    standardSupportEndDate: '2024-01-09',
    extendedSupportEndDate: '2029-01-09',
  },
  {
    id: 't4',
    name: 'RedHat Enterprise Linux',
    version: '7',
    category: 'Operating System',
    supportStatus: 'ES',
    supportEndDate: '2024-06-30',
    standardSupportEndDate: '2019-12-31',
    extendedSupportEndDate: '2024-06-30',
  },
  {
    id: 't5',
    name: 'RedHat Enterprise Linux',
    version: '8',
    category: 'Operating System',
    supportStatus: 'SS',
    supportEndDate: '2029-05-31',
    standardSupportEndDate: '2024-05-31',
    extendedSupportEndDate: '2029-05-31',
  },
  
  // Databases
  {
    id: 't6',
    name: 'Microsoft SQL Server',
    version: '2016',
    category: 'Database',
    supportStatus: 'ES',
    supportEndDate: '2026-07-14',
    standardSupportEndDate: '2021-07-13',
    extendedSupportEndDate: '2026-07-14',
  },
  {
    id: 't7',
    name: 'Microsoft SQL Server',
    version: '2019',
    category: 'Database',
    supportStatus: 'SS',
    supportEndDate: '2030-01-08',
    standardSupportEndDate: '2025-01-07',
    extendedSupportEndDate: '2030-01-08',
  },
  {
    id: 't8',
    name: 'Oracle Database',
    version: '12c',
    category: 'Database',
    supportStatus: 'EOL',
    supportEndDate: '2022-07-31',
    standardSupportEndDate: '2018-07-31',
    extendedSupportEndDate: '2022-07-31',
  },
  {
    id: 't9',
    name: 'Oracle Database',
    version: '19c',
    category: 'Database',
    supportStatus: 'SS',
    supportEndDate: '2027-04-30',
    standardSupportEndDate: '2024-04-30',
    extendedSupportEndDate: '2027-04-30',
  },
  
  // Middleware
  {
    id: 't10',
    name: 'JBoss EAP',
    version: '7.2',
    category: 'Middleware',
    supportStatus: 'ES',
    supportEndDate: '2026-11-30',
    standardSupportEndDate: '2021-11-30',
    extendedSupportEndDate: '2026-11-30',
  },
  {
    id: 't11',
    name: 'Apache Tomcat',
    version: '8.5',
    category: 'Middleware',
    supportStatus: 'EOL',
    supportEndDate: '2024-03-31',
    standardSupportEndDate: '2024-03-31',
  },
  {
    id: 't12',
    name: 'WebSphere Application Server',
    version: '8.5',
    category: 'Middleware',
    supportStatus: 'EOL',
    supportEndDate: '2022-04-30',
    standardSupportEndDate: '2019-04-30',
    extendedSupportEndDate: '2022-04-30',
  },
  
  // Programming Languages/Frameworks
  {
    id: 't13',
    name: 'Java',
    version: '8',
    category: 'Programming Language',
    supportStatus: 'ESU',
    supportEndDate: '2030-12-31',
    standardSupportEndDate: '2022-03-31',
    extendedSupportEndDate: '2030-12-31',
  },
  {
    id: 't14',
    name: 'Java',
    version: '11',
    category: 'Programming Language',
    supportStatus: 'SS',
    supportEndDate: '2026-09-30',
    standardSupportEndDate: '2023-09-30',
    extendedSupportEndDate: '2026-09-30',
  },
  {
    id: 't15',
    name: '.NET Framework',
    version: '4.6',
    category: 'Framework',
    supportStatus: 'EOL',
    supportEndDate: '2022-04-26',
    standardSupportEndDate: '2022-04-26',
  },
  {
    id: 't16',
    name: '.NET Core',
    version: '3.1',
    category: 'Framework',
    supportStatus: 'EOL',
    supportEndDate: '2022-12-13',
    standardSupportEndDate: '2022-12-13',
  },
  {
    id: 't17',
    name: '.NET',
    version: '6.0',
    category: 'Framework',
    supportStatus: 'SS',
    supportEndDate: '2024-11-12',
    standardSupportEndDate: '2024-11-12',
  },
];

// Generate servers data
export const servers: Server[] = [
  {
    id: 's1',
    name: 'PRDSRV01',
    technologies: ['t1', 't8', 't13', 't15'],
    status: 'Active',
    owner: 'John Smith',
    team: 'Infrastructure Team',
    comments: 'Production web server for main application'
  },
  {
    id: 's2',
    name: 'PRDSRV02',
    technologies: ['t2', 't7', 't14', 't17'],
    status: 'Active',
    owner: 'John Smith',
    team: 'Infrastructure Team',
    comments: 'Production application server'
  },
  {
    id: 's3',
    name: 'DEVSRV01',
    technologies: ['t3', 't6', 't13', 't15'],
    status: 'Active',
    owner: 'Jane Doe',
    team: 'Development Team',
    comments: 'Development server'
  },
  {
    id: 's4',
    name: 'TESTSRV01',
    technologies: ['t2', 't7', 't14'],
    status: 'Active',
    owner: 'Mike Johnson',
    team: 'QA Team',
    comments: 'Test environment server'
  },
  {
    id: 's5',
    name: 'DBSRV01',
    technologies: ['t1', 't8'],
    status: 'Upgraded',
    owner: 'Lisa Wong',
    team: 'Database Team',
    comments: 'Main database server, recently upgraded'
  },
  {
    id: 's6',
    name: 'WEBSRV01',
    technologies: ['t4', 't11'],
    status: 'Active',
    owner: 'David Miller',
    team: 'Web Team',
    comments: 'Web server for customer portal'
  },
  {
    id: 's7',
    name: 'APPSRV01',
    technologies: ['t2', 't10', 't14'],
    status: 'Active',
    owner: 'Sarah Brown',
    team: 'Application Team',
    comments: 'Application server for internal apps'
  },
  {
    id: 's8',
    name: 'OLDSRV01',
    technologies: ['t1', 't8', 't12', 't15'],
    status: 'Decommissioned',
    owner: 'John Smith',
    team: 'Infrastructure Team',
    comments: 'Legacy server, decommissioned 2023'
  },
  {
    id: 's9',
    name: 'MIGRSRV01',
    technologies: ['t1', 't8'],
    status: 'Migrated to cloud',
    owner: 'Robert Taylor',
    team: 'Cloud Team',
    comments: 'Server migrated to AWS in 2023'
  },
  {
    id: 's10',
    name: 'LNXSRV01',
    technologies: ['t5', 't9', 't10', 't14'],
    status: 'Active',
    owner: 'Jennifer Lee',
    team: 'Linux Team',
    comments: 'Linux server for backend services'
  },
];

// Generate applications data
export const applications: Application[] = [
  {
    id: 'a1',
    name: 'Customer Portal',
    description: 'External facing customer portal application',
    servers: ['s1', 's6'],
    technologies: ['t1', 't8', 't11', 't13', 't15'],
    owner: 'Emily Chen',
    team: 'Customer Experience Team',
    criticality: 'Critical'
  },
  {
    id: 'a2',
    name: 'Finance System',
    description: 'Core financial management system',
    servers: ['s2', 's5'],
    technologies: ['t2', 't7', 't14', 't17'],
    owner: 'Michael Frey',
    team: 'Finance IT Team',
    criticality: 'Critical'
  },
  {
    id: 'a3',
    name: 'HR Management',
    description: 'Human resources management application',
    servers: ['s7'],
    technologies: ['t2', 't10', 't14'],
    owner: 'Jessica Wong',
    team: 'HR Systems Team',
    criticality: 'High'
  },
  {
    id: 'a4',
    name: 'Inventory System',
    description: 'Warehouse and inventory management',
    servers: ['s4', 's10'],
    technologies: ['t2', 't5', 't7', 't9', 't14'],
    owner: 'Thomas Rodriguez',
    team: 'Supply Chain Team',
    criticality: 'High'
  },
  {
    id: 'a5',
    name: 'Legacy CRM',
    description: 'Old customer relationship management system',
    servers: ['s8'],
    technologies: ['t1', 't8', 't12', 't15'],
    owner: 'Daniel Park',
    team: 'Sales Systems Team',
    criticality: 'Low'
  },
  {
    id: 'a6',
    name: 'Development Environment',
    description: 'Development and testing platforms',
    servers: ['s3'],
    technologies: ['t3', 't6', 't13', 't15'],
    owner: 'Jane Doe',
    team: 'Development Team',
    criticality: 'Medium'
  },
  {
    id: 'a7',
    name: 'Analytics Platform',
    description: 'Business intelligence and analytics',
    servers: ['s9', 's10'],
    technologies: ['t5', 't9', 't14'],
    owner: 'Robert Taylor',
    team: 'Data Science Team',
    criticality: 'High'
  },
];

// Generate remediations data
export const remediations: Remediation[] = [
  {
    id: 'r1',
    serverId: 's1',
    technologyId: 't1',
    status: 'In progress',
    assignedTo: 'Alex Johnson',
    startDate: '2024-02-15',
    targetCompletionDate: '2024-06-30',
    remediationType: 'Upgrade',
    comments: 'Upgrading from Windows Server 2012 R2 to 2019'
  },
  {
    id: 'r2',
    serverId: 's1',
    technologyId: 't8',
    status: 'Not started',
    assignedTo: 'Maria Garcia',
    targetCompletionDate: '2024-08-15',
    remediationType: 'Upgrade',
    comments: 'Planning to upgrade Oracle 12c to 19c'
  },
  {
    id: 'r3',
    serverId: 's5',
    technologyId: 't8',
    status: 'Completed',
    assignedTo: 'Lisa Wong',
    startDate: '2023-09-10',
    targetCompletionDate: '2023-12-15',
    actualCompletionDate: '2023-12-10',
    remediationType: 'Upgrade',
    comments: 'Successfully upgraded Oracle 12c to 19c'
  },
  {
    id: 'r4',
    serverId: 's6',
    technologyId: 't11',
    status: 'Not started',
    assignedTo: 'David Miller',
    targetCompletionDate: '2024-07-20',
    remediationType: 'Upgrade',
    comments: 'Need to upgrade Apache Tomcat to newer version'
  },
  {
    id: 'r5',
    serverId: 's1',
    technologyId: 't15',
    status: 'In progress',
    assignedTo: 'Chris Peters',
    startDate: '2024-01-05',
    targetCompletionDate: '2024-05-30',
    remediationType: 'Upgrade',
    comments: 'Migrating from .NET Framework 4.6 to .NET 6.0'
  },
  {
    id: 'r6',
    serverId: 's8',
    technologyId: 't1',
    status: 'Completed',
    assignedTo: 'John Smith',
    startDate: '2023-05-15',
    targetCompletionDate: '2023-08-30',
    actualCompletionDate: '2023-08-25',
    remediationType: 'Decommission',
    comments: 'Server decommissioned due to obsolete technologies'
  },
  {
    id: 'r7',
    serverId: 's9',
    technologyId: 't1',
    status: 'Completed',
    assignedTo: 'Robert Taylor',
    startDate: '2023-03-10',
    targetCompletionDate: '2023-09-30',
    actualCompletionDate: '2023-09-15',
    remediationType: 'Migration',
    comments: 'Migrated to AWS EC2 with upgraded OS'
  },
];

// Helper functions
export const getTechnologyById = (id: string): Technology | undefined => {
  return technologies.find(tech => tech.id === id);
};

export const getServerById = (id: string): Server | undefined => {
  return servers.find(server => server.id === id);
};

export const getApplicationById = (id: string): Application | undefined => {
  return applications.find(app => app.id === id);
};

export const getRemediationById = (id: string): Remediation | undefined => {
  return remediations.find(rem => rem.id === id);
};

export const getServerTechnologies = (serverId: string): Technology[] => {
  const server = getServerById(serverId);
  if (!server) return [];
  return server.technologies.map(techId => getTechnologyById(techId)!).filter(Boolean);
};

export const getApplicationTechnologies = (appId: string): Technology[] => {
  const app = getApplicationById(appId);
  if (!app) return [];
  return app.technologies.map(techId => getTechnologyById(techId)!).filter(Boolean);
};

export const getApplicationServers = (appId: string): Server[] => {
  const app = getApplicationById(appId);
  if (!app) return [];
  return app.servers.map(serverId => getServerById(serverId)!).filter(Boolean);
};

export const getRemediationsForServer = (serverId: string): Remediation[] => {
  return remediations.filter(rem => rem.serverId === serverId);
};

export const getRemediationsForTechnology = (techId: string): Remediation[] => {
  return remediations.filter(rem => rem.technologyId === techId);
};

// Calculate statistics
export const calculateStatistics = () => {
  const techStats = {
    total: technologies.length,
    byStatus: {
      EOL: technologies.filter(tech => tech.supportStatus === 'EOL').length,
      SS: technologies.filter(tech => tech.supportStatus === 'SS').length,
      ES: technologies.filter(tech => tech.supportStatus === 'ES').length,
      ESU: technologies.filter(tech => tech.supportStatus === 'ESU').length
    }
  };
  
  const serverStats = {
    total: servers.length,
    byStatus: {
      Active: servers.filter(server => server.status === 'Active').length,
      Upgraded: servers.filter(server => server.status === 'Upgraded').length,
      MigratedToCloud: servers.filter(server => server.status === 'Migrated to cloud').length,
      Decommissioned: servers.filter(server => server.status === 'Decommissioned').length
    },
    withEolTech: servers.filter(server => {
      const techs = getServerTechnologies(server.id);
      return techs.some(tech => tech.supportStatus === 'EOL');
    }).length
  };
  
  const remediationStats = {
    total: remediations.length,
    byStatus: {
      NotStarted: remediations.filter(rem => rem.status === 'Not started').length,
      InProgress: remediations.filter(rem => rem.status === 'In progress').length,
      Completed: remediations.filter(rem => rem.status === 'Completed').length
    }
  };
  
  return { techStats, serverStats, remediationStats };
};
