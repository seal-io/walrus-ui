import { MoreAction } from '@/views/config/interface';
import ResourceKinds, {
  apiVersion,
  GlobalNamespace,
  NAMESPACES
} from '@/views/config/resource-kinds';

export { GlobalNamespace, NAMESPACES, ResourceKinds, apiVersion };

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
  GitLab: 'GitLab',
  Google: 'Google',
  Bitbucket: 'Bitbucket',
  Gitea: 'Gitea',
  LDAP: 'LDAP',
  OAuth: 'OAuth',
  OIDC: 'OIDC',
  Microsoft: 'Microsoft'
};

export default {};
