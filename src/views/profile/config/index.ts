export const expireList = [
  { label: 'account.settings.expire.week', type: 'day', value: 7 },
  { label: 'account.settings.expire.month', type: 'month', value: 1 },
  { label: 'account.settings.expire.six', type: 'month', value: 6 },
  { label: 'account.settings.expire.year', type: 'year', value: 1 },
  { label: 'account.settings.expire.never', type: 'never', value: '' }
];
export enum AccountKind {
  USER = 'user',
  GROUP = 'group'
}
export const accountTypeList = [
  { label: 'profile.account.type.user', value: AccountKind.USER },
  { label: 'profile.account.type.group', value: AccountKind.GROUP }
];

export default {};
