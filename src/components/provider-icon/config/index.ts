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

export default {};
