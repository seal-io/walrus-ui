import github from '../images/github.png';
import bitbucket from '../images/Bitbucket.png';
import coding from '../images/Coding.png';
import conan from '../images/Conan.png';
import deb from '../images/Deb.png';
import dingding from '../images/dingding.png';
import docker from '../images/docker.png';
import email from '../images/email.png';
import feishu from '../images/feishu.png';
import gitee from '../images/Gitee.png';
import gitlab from '../images/gitlab.png';
import npm from '../images/NPM.png';
import nuget from '../images/NuGet.png';
import pypi from '../images/PyPI.png';
import rpm from '../images/Rpm.png';
import webhook from '../images/Webhook.png';
import wechat from '../images/wechat.png';
import maven from '../images/Maven.png';
import jira from '../images/Jira.png';
import zentao from '../images/zentao.png';
import servicenow from '../images/servicenow.png';
import standard from '../images/standar.png';
import harbor from '../images/harbor.png';
import nexus from '../images/nexus.png';
import artifactory from '../images/artifactory.png';
import kubernetes from '../images/kuber.png';
import sbom from '../images/sbom.png';
import file from '../images/file.png';
import repo from '../images/repo.png';
import version from '../images/version.png';
import component from '../images/component.png';
import deps from '../images/deps.png';
import policy from '../images/policy.png';
import license from '../images/license.png';

const prefix = '../images';
export interface imgItem {
  label: string;
  type: string;
  provider: string;
  value: string | number;
  img: string;
  id?: string;
  enable?: boolean;
  tokenUrl?: string;
  oauthUrl?: string;
  settingUrl?: string;
  imgUrl?: string;
  name?: string;
  available?: boolean;
  field?: string;
}
export const sourceRepoList: imgItem[] = [
  {
    label: 'GitHub',
    type: 'GitHub',
    provider: 'github',
    value: 1,
    img: github,
    available: true,
    oauthUrl: 'https://github.com/login/oauth/authorize',
    settingUrl: 'https://github.com/settings/developers',
  },
  {
    label: 'GitLab',
    type: 'GitLab',
    provider: 'gitlab',
    available: true,
    value: 2,
    oauthUrl: 'https://gitlab.com/oauth/authorize',
    settingUrl: 'https://gitlab.com/-/profile/applications',
    img: gitlab,
  },
  {
    label: 'Bitbucket',
    type: 'bitbucket',
    provider: 'bitbucket',
    value: 3,
    img: bitbucket,
  },
  { label: 'Gitee', provider: 'gitee', type: 'gitee', value: 4, img: gitee },
  {
    label: 'Coding',
    provider: 'coding',
    type: 'coding',
    value: 5,
    img: coding,
  },
];

const proxyList: imgItem[] = [
  {
    label: 'Docker',
    provider: 'docker',
    type: 'docker',
    value: 1,
    img: docker,
    available: true,
  },
  {
    label: 'Maven',
    provider: 'maven',
    type: 'maven',
    value: 2,
    img: maven,
    available: true,
  },
  { label: 'NPM', provider: 'npm', type: 'npm', value: 3, img: npm },
  { label: 'PyPI', provider: 'pypi', type: 'pypi', value: 4, img: pypi },
  { label: 'NuGet', provider: 'nuget', type: 'nuget', value: 5, img: nuget },
];

const proxyListR: imgItem[] = [
  { label: 'Conan', provider: 'conan', type: 'conan', value: 6, img: conan },
  { label: 'Rpm', provider: 'rpm', type: 'rpm', value: 7, img: rpm },
  { label: 'Deb', provider: 'deb', type: 'deb', value: 8, img: deb },
];

export const pushServiceList: imgItem[] = [
  {
    label: 'intergration.pushservice.email',
    type: 'email',
    provider: 'email',
    field: 'smtp',
    value: 4,
    img: email,
    available: true,
    name: 'emailConfig',
  },
  {
    label: 'intergration.pushservice.webhook',
    type: 'webhook',
    provider: 'webhook',
    field: 'webhook',
    value: 5,
    img: webhook,
    available: true,
    name: 'webhookConfig',
  },
  {
    label: 'intergration.pushservice.dingding',
    type: 'dingding',
    provider: 'dingding',
    field: 'dinding',
    value: 1,
    img: dingding,
    name: '',
  },
  {
    label: 'intergration.pushservice.feishu',
    type: 'feishu',
    provider: 'feishu',
    field: 'feishu',
    value: 2,
    img: feishu,
    name: '',
  },
  {
    label: 'intergration.pushservice.wechat',
    type: 'wechat',
    provider: 'wechat',
    field: 'wechat',
    value: 3,
    img: wechat,
    name: '',
  },
];

export const projectManagementList: imgItem[] = [
  {
    label: 'Jira',
    type: 'jira',
    provider: 'jira',
    available: true,
    value: 2,
    oauthUrl: '',
    settingUrl: 'https://developer.atlassian.com/console/myapps/',
    img: jira,
  },
  {
    label: 'intergration.pushservice.zentao',
    type: 'zentao',
    provider: 'zentao',
    available: false,
    value: 2,
    oauthUrl: '',
    settingUrl: '',
    img: zentao,
  },
  {
    label: 'ServiceNow',
    type: 'servicenow',
    provider: 'servicenow',
    available: false,
    value: 2,
    oauthUrl: '',
    settingUrl: '',
    img: servicenow,
  },
];

export const containerRepo: imgItem[] = [
  {
    label: 'intergration.containerrepo.standar',
    type: 'oci',
    provider: 'oci',
    available: true,
    value: 2,
    oauthUrl: '',
    settingUrl: '',
    img: standard,
  },
  {
    label: 'Docker Hub',
    type: 'dockerhub',
    provider: 'dockerhub',
    available: false,
    value: 2,
    oauthUrl: '',
    settingUrl: '',
    img: docker,
  },
  {
    label: 'Harbor',
    type: 'harbor',
    provider: 'harbor',
    available: false,
    value: 2,
    oauthUrl: '',
    settingUrl: '',
    img: harbor,
  },
  {
    label: 'Nexus',
    type: 'nexus',
    provider: 'nexus',
    available: false,
    value: 2,
    oauthUrl: '',
    settingUrl: '',
    img: nexus,
  },
  {
    label: 'Artifactory',
    type: 'artifactory',
    provider: 'artifactory',
    available: false,
    value: 2,
    oauthUrl: '',
    settingUrl: '',
    img: artifactory,
  },
];

export const containerOrch: imgItem[] = [
  {
    label: 'Kubernetes',
    type: 'kubernetes',
    provider: 'kubernetes',
    available: true,
    value: 2,
    oauthUrl: '',
    settingUrl: '',
    img: kubernetes,
  },
];
interface RadioItem {
  label: string;
  value: boolean;
  key: string;
}

interface repoInconItem {
  [key: string]: any;
}

export const repoIcon: repoInconItem = {
  github,
  bitbucket,
  coding,
  conan,
  deb,
  dingding,
  docker,
  email,
  feishu,
  gitee,
  gitlab,
  npm,
  nuget,
  pypi,
  rpm,
  webhook,
  wechat,
  maven,
  jira,
  harbor,
  nexus,
  artifactory,
  kubernetes,
  oci: standard,
  dockerhub: docker,
  uploaded: sbom,
  file,
  repo,
  version,
  component,
  deps,
  policy,
  license,
};
export const integrationRepoMap = {
  github: 'GitHub',
  gitlab: 'GitLab',
  oci: 'OCI',
};
export const accessRepoOpts: RadioItem[] = [
  { label: 'intergration.access.allRepo', value: true, key: '' },
  { label: 'intergration.access.pubRepo', value: false, key: '' },
];

export const scanOpts: RadioItem[] = [
  // {
  //   label: 'intergration.scan.opts2',
  //   value: true,
  //   key: 'enablePullRequestCommenting',
  // },
  {
    label: 'intergration.scan.opts4',
    value: true,
    key: 'enableWebhookDrivenEvaluation',
  },
  {
    label: 'intergration.scan.opts3',
    value: true,
    key: 'enableScheduleEvaluation',
  },
];
export const serviceMap = {
  smtp: 'intergration.pushservice.add.email',
  webhook: 'intergration.pushservice.add.Webhook',
};

export const authorizeTypeList = [
  {
    label: 'OAuth2.0',
    value: 'private_oauth2',
    desc: 'intergration.jira.private.oauth2.version',
  },
  {
    label: 'Access Token',
    value: 'private_access_token',
    desc: 'intergration.jira.private.token.version',
  },
];

// ===============container orches===============
export const namespaceExcludesOpts = [
  { label: 'intergration.containerrepo.options.system', value: 'system' },
  { label: 'intergration.containerrepo.options.custom', value: 'custom' },
  { label: 'intergration.containerrepo.options.none', value: 'none' },
];
// cloud_oauth2, cloud_access_token, private_oauth2, private_access_token
export default {
  sourceRepoList,
  proxyList,
  proxyListR,
  pushServiceList,
};
