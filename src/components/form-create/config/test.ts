export default [
  {
    Name: 'name',
    Type: 'string',
    Default: null,
    Required: true,
    Sensitive: false,
    Group: 'user',
    Description: '(Required) App instance name'
  },
  {
    Name: 'namespace',
    Type: 'string',
    Default: 'default',
    Required: false,
    Sensitive: false,
    Options: ['1', '2', '3'],
    Description: '(Optional) namespace'
  },
  {
    Name: 'database',
    Type: 'string',
    Default: 'mysql',
    Required: false,
    Sensitive: false,
    Description: '(Optional) Database name'
  },
  {
    Name: 'username',
    Type: 'string',
    Default: 'mysql',
    Required: false,
    Sensitive: false,
    Group: 'user',
    Description: '(Optional) Username'
  },
  {
    Name: 'Env',
    Type: 'map(string)',
    Default: { user: 'tom', work: 'web' },
    Required: false,
    Sensitive: false,
    Group: 'user',
    Description: '(Optional) Username'
  },
  {
    Name: 'password',
    Type: 'string',
    Default: 'mysql',
    Required: false,
    Sensitive: true,
    Group: 'user',
    Description: '(Optional) Password'
  },
  {
    Name: 'init_db_script',
    Type: 'number',
    Default: null,
    min: 0,
    max: 100,
    Required: false,
    Sensitive: true,
    Description: '(Optional) Init db scripts '
  }
];
