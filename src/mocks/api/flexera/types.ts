
export interface FlexeraProduct {
  id: string;
  name: string;
  version: string;
  vendor: string;
  eol_date: string;
  eos_date: string;
  extended_support_date: string | null;
  risk_level: 'High' | 'Medium' | 'Low';
}

export interface FlexeraInstance {
  id: string;
  hostname: string;
  ip_address: string;
  operating_system: string;
  os_version: string;
  last_seen: string;
  installed_products: FlexeraProduct[];
}

export interface FlexeraResponse<T> {
  data: T;
  meta: {
    total: number;
    page: number;
    per_page: number;
  };
}
