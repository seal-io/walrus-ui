export enum AccountKind {
  USER = 'user',
  GROUP = 'group'
}
export enum RoleType {
  Admin = 'system/admin',
  Engineer = 'system/manager',
  User = '0'
}

export const RolesTypeMap = {
  [RoleType.Admin]: 'system.user.admin',
  [RoleType.Engineer]: 'system.user.engineer',
  [RoleType.User]: 'system.user.visitor'
};

export const roleTypeList = [
  {
    label: 'system.user.admin',
    value: RoleType.Admin,
    icon: 'icon-administrator'
  },
  {
    label: 'system.user.engineer',
    value: RoleType.Engineer,
    icon: 'icon-star-Admin-01'
  },
  { label: 'system.user.visitor', value: RoleType.User, icon: 'icon-user' }
];
export const accountTypeList = [
  { label: 'profile.account.type.user', value: AccountKind.USER },
  { label: 'profile.account.type.group', value: AccountKind.GROUP }
];

export default {};
