import { AnyObject } from '@/types/global';

export type permissionItem = 'get' | 'post' | 'put' | 'delete';
export type RoleType = '' | '*' | 'admin' | 'user';
export interface UserRouterPermission {
  path: string;
  name?: string;
  permission: permissionItem[]; // GET、POST、PUT、DELETE4  equal to array<permissionItem> 泛型写法
}

export interface UserState {
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
  permissionsList?: UserRouterPermission[];
  permissions?: AnyObject;
  hasNavList?: boolean;
  role: RoleType;
  userSetting: {
    [key: string]: string;
  };
}
