import { MoreAction } from '@/views/config/interface';
import ResourceKinds, {
  apiVersion,
  GlobalNamespace,
  NAMESPACES
} from '@/views/config/resource-kinds';

export { GlobalNamespace, NAMESPACES, ResourceKinds, apiVersion };

export const FieldType = {
  string: 'string',
  password: 'password',
  boolean: 'boolean'
};

export const actionList: MoreAction[] = [
  {
    label: 'common.button.edit',
    value: 'edit',
    icon: 'icon-edit',
    status: 'normal'
  },
  {
    label: 'common.button.delete',
    value: 'delete',
    icon: 'icon-delete',
    status: 'danger'
  }
];

// Bitbucket, GitHub, GitLab, Gitea, Google, Internal, LDAP, Microsoft, OAuth, OIDC
export const ProviderTypes = {
  GitHub: 'GitHub',
  OIDC: 'OIDC',
  GitLab: 'GitLab',
  Google: 'Google',
  Bitbucket: 'Bitbucket',
  Gitea: 'Gitea',
  LDAP: 'LDAP',
  OAuth: 'OAuth',
  Microsoft: 'Microsoft'
};

const specConfig_1 = [
  {
    key: 'clientID',
    label: 'ClientID',
    required: true,
    type: FieldType.string,
    default: ''
  },
  {
    key: 'clientSecret',
    label: 'ClientSecret',
    required: true,
    type: 'password',
    default: ''
  }
];
const specConfig_2 = [
  {
    key: 'issuer',
    label: 'Issuer',
    required: true,
    type: FieldType.string,
    default: ''
  },
  {
    key: 'skipInsecureVerify',
    label: 'SkipInsecureVerify',
    required: false,
    default: false,
    type: 'boolean'
  },
  {
    key: 'clientID',
    label: 'ClientID',
    required: true,
    type: FieldType.string,
    default: ''
  },
  {
    key: 'clientSecret',
    label: 'ClientSecret',
    required: true,
    type: FieldType.password,
    default: ''
  }
];
export const ProviderSpecConfig = {
  GitHub: specConfig_1,
  GitLab: specConfig_1,
  Google: specConfig_1,
  OIDC: specConfig_2
};

export default {};
