
-- Recreate database schema for Software Obsolescence Manager
-- This script will drop and recreate all tables, enums, and relationships

-- First, drop all existing tables (in reverse order to respect foreign keys)
DROP TABLE IF EXISTS public.application_servers CASCADE;
DROP TABLE IF EXISTS public.application_technologies CASCADE;
DROP TABLE IF EXISTS public.server_technologies CASCADE;
DROP TABLE IF EXISTS public.remediations CASCADE;
DROP TABLE IF EXISTS public.applications CASCADE;
DROP TABLE IF EXISTS public.servers CASCADE;
DROP TABLE IF EXISTS public.technologies CASCADE;

-- Drop existing enums
DROP TYPE IF EXISTS public.criticality_level CASCADE;
DROP TYPE IF EXISTS public.remediation_status CASCADE;
DROP TYPE IF EXISTS public.server_status CASCADE;
DROP TYPE IF EXISTS public.support_status CASCADE;

-- Create enums
CREATE TYPE public.criticality_level AS ENUM ('Low', 'Medium', 'High', 'Critical');
CREATE TYPE public.remediation_status AS ENUM ('Not started', 'In progress', 'Completed');
CREATE TYPE public.server_status AS ENUM ('Active', 'Upgraded', 'Migrated to cloud', 'Decommissioned');
CREATE TYPE public.support_status AS ENUM ('EOL', 'SS', 'ES', 'ESU');

-- Create tables
CREATE TABLE public.applications (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    name TEXT NOT NULL,
    description TEXT,
    criticality criticality_level NOT NULL DEFAULT 'Low',
    owner TEXT NOT NULL,
    team TEXT NOT NULL,
    created_at TIMESTAMPTZ DEFAULT now(),
    updated_at TIMESTAMPTZ DEFAULT now()
);

CREATE TABLE public.servers (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    name TEXT NOT NULL,
    status server_status NOT NULL DEFAULT 'Active',
    owner TEXT NOT NULL,
    team TEXT NOT NULL,
    comments TEXT,
    created_at TIMESTAMPTZ DEFAULT now(),
    updated_at TIMESTAMPTZ DEFAULT now()
);

CREATE TABLE public.technologies (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    name TEXT NOT NULL,
    version TEXT NOT NULL,
    category TEXT NOT NULL,
    support_status support_status NOT NULL,
    support_end_date DATE NOT NULL,
    standard_support_end_date DATE,
    extended_support_end_date DATE,
    extended_security_update_end_date DATE,
    created_at TIMESTAMPTZ DEFAULT now(),
    updated_at TIMESTAMPTZ DEFAULT now()
);

CREATE TABLE public.remediations (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    server_id UUID REFERENCES public.servers(id),
    technology_id UUID REFERENCES public.technologies(id),
    status remediation_status NOT NULL DEFAULT 'Not started',
    assigned_to TEXT NOT NULL,
    start_date DATE,
    target_completion_date DATE NOT NULL,
    actual_completion_date DATE,
    remediation_type TEXT NOT NULL,
    comments TEXT,
    created_at TIMESTAMPTZ DEFAULT now(),
    updated_at TIMESTAMPTZ DEFAULT now()
);

CREATE TABLE public.application_servers (
    application_id UUID NOT NULL REFERENCES public.applications(id),
    server_id UUID NOT NULL REFERENCES public.servers(id),
    PRIMARY KEY (application_id, server_id)
);

CREATE TABLE public.application_technologies (
    application_id UUID NOT NULL REFERENCES public.applications(id),
    technology_id UUID NOT NULL REFERENCES public.technologies(id),
    PRIMARY KEY (application_id, technology_id)
);

CREATE TABLE public.server_technologies (
    server_id UUID NOT NULL REFERENCES public.servers(id),
    technology_id UUID NOT NULL REFERENCES public.technologies(id),
    PRIMARY KEY (server_id, technology_id)
);

-- Sample data insertion
-- You can add INSERT statements here to populate your tables with sample data
-- For example:

-- Insert sample technologies
INSERT INTO public.technologies (name, version, category, support_status, support_end_date, standard_support_end_date, extended_support_end_date)
VALUES 
  ('Windows Server', '2012 R2', 'Operating System', 'EOL', '2023-10-10', '2018-10-09', '2023-10-10'),
  ('Windows Server', '2016', 'Operating System', 'SS', '2027-01-11', '2022-01-11', '2027-01-11'),
  ('Windows Server', '2019', 'Operating System', 'SS', '2029-01-09', '2024-01-09', '2029-01-09'),
  ('SQL Server', '2014', 'Database', 'EOL', '2024-07-09', '2019-07-09', '2024-07-09'),
  ('SQL Server', '2016', 'Database', 'SS', '2026-07-14', '2021-07-13', '2026-07-14'),
  ('SQL Server', '2019', 'Database', 'SS', '2030-01-08', '2025-01-07', '2030-01-08'),
  ('Oracle Database', '12c', 'Database', 'EOL', '2022-07-31', '2018-07-31', '2022-07-31'),
  ('Oracle Database', '19c', 'Database', 'SS', '2027-04-30', '2024-04-30', '2027-04-30'),
  ('Red Hat Enterprise Linux', '7', 'Operating System', 'ES', '2024-06-30', '2019-08-06', '2024-06-30'),
  ('Red Hat Enterprise Linux', '8', 'Operating System', 'SS', '2029-05-31', '2024-05-31', '2029-05-31');

-- Insert sample servers
INSERT INTO public.servers (name, status, owner, team, comments)
VALUES 
  ('app-server-001', 'Active', 'John Smith', 'Infrastructure', 'Primary application server'),
  ('app-server-002', 'Active', 'John Smith', 'Infrastructure', 'Secondary application server'),
  ('db-server-001', 'Active', 'Jane Doe', 'Database', 'Primary database server'),
  ('db-server-002', 'Active', 'Jane Doe', 'Database', 'Backup database server'),
  ('legacy-app-001', 'Active', 'Robert Johnson', 'Infrastructure', 'Legacy application server - scheduled for decommission'),
  ('test-server-001', 'Active', 'Sarah Williams', 'QA', 'Test environment server');

-- Insert sample applications
INSERT INTO public.applications (name, description, criticality, owner, team)
VALUES 
  ('Inventory Management', 'Main inventory tracking system', 'Critical', 'Michael Brown', 'Business Applications'),
  ('Customer Portal', 'External customer-facing portal', 'High', 'Jennifer Davis', 'Web Applications'),
  ('HR System', 'Human resources management application', 'Medium', 'David Wilson', 'HR Systems'),
  ('Internal Reporting', 'Business intelligence reporting tools', 'Medium', 'Lisa Johnson', 'Business Intelligence'),
  ('Legacy CRM', 'Old customer relationship management system', 'Low', 'Kevin Thompson', 'Business Applications');

-- Link applications to servers
INSERT INTO public.application_servers (application_id, server_id)
VALUES 
  ((SELECT id FROM public.applications WHERE name = 'Inventory Management'), (SELECT id FROM public.servers WHERE name = 'app-server-001')),
  ((SELECT id FROM public.applications WHERE name = 'Inventory Management'), (SELECT id FROM public.servers WHERE name = 'db-server-001')),
  ((SELECT id FROM public.applications WHERE name = 'Customer Portal'), (SELECT id FROM public.servers WHERE name = 'app-server-002')),
  ((SELECT id FROM public.applications WHERE name = 'Customer Portal'), (SELECT id FROM public.servers WHERE name = 'db-server-001')),
  ((SELECT id FROM public.applications WHERE name = 'HR System'), (SELECT id FROM public.servers WHERE name = 'app-server-001')),
  ((SELECT id FROM public.applications WHERE name = 'HR System'), (SELECT id FROM public.servers WHERE name = 'db-server-002')),
  ((SELECT id FROM public.applications WHERE name = 'Internal Reporting'), (SELECT id FROM public.servers WHERE name = 'app-server-002')),
  ((SELECT id FROM public.applications WHERE name = 'Internal Reporting'), (SELECT id FROM public.servers WHERE name = 'db-server-002')),
  ((SELECT id FROM public.applications WHERE name = 'Legacy CRM'), (SELECT id FROM public.servers WHERE name = 'legacy-app-001'));

-- Link servers to technologies
INSERT INTO public.server_technologies (server_id, technology_id)
VALUES 
  ((SELECT id FROM public.servers WHERE name = 'app-server-001'), (SELECT id FROM public.technologies WHERE name = 'Windows Server' AND version = '2016')),
  ((SELECT id FROM public.servers WHERE name = 'app-server-002'), (SELECT id FROM public.technologies WHERE name = 'Windows Server' AND version = '2019')),
  ((SELECT id FROM public.servers WHERE name = 'db-server-001'), (SELECT id FROM public.technologies WHERE name = 'Windows Server' AND version = '2016')),
  ((SELECT id FROM public.servers WHERE name = 'db-server-001'), (SELECT id FROM public.technologies WHERE name = 'SQL Server' AND version = '2016')),
  ((SELECT id FROM public.servers WHERE name = 'db-server-002'), (SELECT id FROM public.technologies WHERE name = 'Windows Server' AND version = '2019')),
  ((SELECT id FROM public.servers WHERE name = 'db-server-002'), (SELECT id FROM public.technologies WHERE name = 'SQL Server' AND version = '2019')),
  ((SELECT id FROM public.servers WHERE name = 'legacy-app-001'), (SELECT id FROM public.technologies WHERE name = 'Windows Server' AND version = '2012 R2')),
  ((SELECT id FROM public.servers WHERE name = 'legacy-app-001'), (SELECT id FROM public.technologies WHERE name = 'SQL Server' AND version = '2014')),
  ((SELECT id FROM public.servers WHERE name = 'test-server-001'), (SELECT id FROM public.technologies WHERE name = 'Red Hat Enterprise Linux' AND version = '8'));

-- Link applications to technologies
INSERT INTO public.application_technologies (application_id, technology_id)
VALUES 
  ((SELECT id FROM public.applications WHERE name = 'Inventory Management'), (SELECT id FROM public.technologies WHERE name = 'SQL Server' AND version = '2016')),
  ((SELECT id FROM public.applications WHERE name = 'Customer Portal'), (SELECT id FROM public.technologies WHERE name = 'SQL Server' AND version = '2016')),
  ((SELECT id FROM public.applications WHERE name = 'HR System'), (SELECT id FROM public.technologies WHERE name = 'SQL Server' AND version = '2019')),
  ((SELECT id FROM public.applications WHERE name = 'Internal Reporting'), (SELECT id FROM public.technologies WHERE name = 'SQL Server' AND version = '2019')),
  ((SELECT id FROM public.applications WHERE name = 'Legacy CRM'), (SELECT id FROM public.technologies WHERE name = 'SQL Server' AND version = '2014'));

-- Create some sample remediations
INSERT INTO public.remediations (server_id, technology_id, status, assigned_to, start_date, target_completion_date, actual_completion_date, remediation_type, comments)
VALUES 
  ((SELECT id FROM public.servers WHERE name = 'legacy-app-001'), 
   (SELECT id FROM public.technologies WHERE name = 'Windows Server' AND version = '2012 R2'),
   'In progress', 'John Smith', '2023-03-15', '2023-12-31', NULL, 'Upgrade', 'Upgrading to Windows Server 2019'),

  ((SELECT id FROM public.servers WHERE name = 'legacy-app-001'), 
   (SELECT id FROM public.technologies WHERE name = 'SQL Server' AND version = '2014'),
   'Not started', 'Jane Doe', NULL, '2023-12-31', NULL, 'Upgrade', 'Upgrading to SQL Server 2019'),

  ((SELECT id FROM public.servers WHERE name = 'db-server-001'), 
   (SELECT id FROM public.technologies WHERE name = 'SQL Server' AND version = '2016'),
   'Not started', 'Jane Doe', NULL, '2024-06-30', NULL, 'Upgrade', 'Upgrading to SQL Server 2019'),

  ((SELECT id FROM public.servers WHERE name = 'app-server-001'), 
   (SELECT id FROM public.technologies WHERE name = 'Windows Server' AND version = '2016'),
   'Completed', 'Robert Johnson', '2023-01-10', '2023-03-31', '2023-03-25', 'Upgrade', 'Upgraded to Windows Server 2019');
