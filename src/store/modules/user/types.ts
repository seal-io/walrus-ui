import { AnyObject } from '@/types/global';
import { RouteRecordRaw } from 'vue-router';

export type permissionItem = 'GET' | 'POST' | 'PUT' | 'DELETE' | '*';
export type RoleType = '' | '*' | 'admin' | 'user';

export const permissionKey = {
  projectRoles: 'projectRoles',
  roles: 'roles'
};
// cache the role policy
export const ROLES = '_roles';

export interface RolesItem {
  id: string;
  policies: Array<{
    actions: string[];
    resources: string[];
    paths: string[];
  }>;
}

export interface ProjectRolesItem {
  project: object;
  roles: RolesItem[];
}
export interface ProjectPolicy {
  projectName: string;
  projectID: string;
  policies: Record<string, permissionItem[]>;
  [ROLES]: Record<string, object>;
}

export interface RolePolicy {
  role: string;
  policies: Record<string, permissionItem[]>;
}

export interface UserState {
  applicableEnvironmentTypes: string[];
  name?: string;
  avatar?: string;
  job?: string;
  organization?: string;
  location?: string;
  email?: string;
  introduction?: string;
  personalWebsite?: string;
  jobName?: string;
  organizationName?: string;
  locationName?: string;
  phone?: string;
  registrationDate?: string;
  accountId?: string;
  certification?: number;
  permissions: AnyObject; // {role: RolePolicy;project: ProjectPolicy;}
  hasNavList?: boolean;
  role: RoleType;
  roles: RolesItem[];
  projectRoles: ProjectRolesItem[];
  permissionRoutes: RouteRecordRaw[];
  userSetting: {
    [key: string]: {
      id: string;
      name: string;
      value?: string;
    };
  };
  currentProject: string;
  policies: Array<{
    actions: string[];
    objectIDs: string[];
    resources: string[];
    scope: string;
  }>;
  permissionsKey: {
    projectRoles: 'projectRoles';
    roles: 'roles';
  };
}
