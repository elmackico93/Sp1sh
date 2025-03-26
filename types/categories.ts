export type CategoryLevel = 'first' | 'second' | 'third';

export interface CategoryItem {
  id: string;
  name: string;
  path: string;
  description?: string;
  icon?: string;
  count?: number;
  level: CategoryLevel;
  parentId?: string;
  children?: CategoryItem[];
}

export type OperatingSystem = 'linux' | 'windows' | 'macos' | 'cross-platform' | 'all';

export type EmergencyLevel = 'critical' | 'high' | 'medium' | 'low';

export interface FilterOptions {
  os?: OperatingSystem;
  emergencyLevel?: EmergencyLevel;
  searchTerm?: string;
  tags?: string[];
}
