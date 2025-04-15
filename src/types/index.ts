
export type SupportStatus = 'EOL' | 'SS' | 'ES' | 'ESU';

export type RemediationStatus = 'Not started' | 'In progress' | 'Completed';

export type ServerStatus = 'Active' | 'Upgraded' | 'Migrated to cloud' | 'Decommissioned';

export interface Technology {
  id: string;
  name: string;
  version: string;
  category: string;
  supportStatus: SupportStatus;
  supportEndDate: string;
  standardSupportEndDate?: string;
  extendedSupportEndDate?: string;
  extendedSecurityUpdateEndDate?: string;
}

export interface Server {
  id: string;
  name: string;
  technologies: string[]; // Technology IDs
  status: ServerStatus;
  owner: string;
  team: string;
  comments: string;
}

export interface Application {
  id: string;
  name: string;
  description: string;
  servers: string[]; // Server IDs
  technologies: string[]; // Technology IDs
  owner: string;
  team: string;
  criticality: 'Low' | 'Medium' | 'High' | 'Critical';
}

export interface Remediation {
  id: string;
  serverId: string;
  technologyId: string;
  status: RemediationStatus;
  assignedTo: string;
  startDate?: string;
  targetCompletionDate: string;
  actualCompletionDate?: string;
  remediationType: 'Upgrade' | 'Migration' | 'Decommission' | 'Other';
  comments: string;
}
