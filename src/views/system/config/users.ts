export enum AccountKind {
  USER = 'user',
  GROUP = 'group'
}

export const roleTypeList = [
  {
    label: 'system.user.admin',
    value: 'system/platform-engineer',
    icon: 'icon-administrator'
  },
  {
    label: 'system.user.engineer',
    value: 'system/admin',
    icon: 'icon-star-Admin-01'
  },
  { label: 'system.user.visitor', value: null, icon: 'icon-user' }
];
export const accountTypeList = [
  { label: 'profile.account.type.user', value: AccountKind.USER },
  { label: 'profile.account.type.group', value: AccountKind.GROUP }
];

export default {};
