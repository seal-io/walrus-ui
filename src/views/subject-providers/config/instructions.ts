import { ProviderTypes } from './index';

const githubSteps = ({ origin }) => {
  return [
    '进入用户设置页面：<a href="https://github.com/settings/profile" target="_blank">https://github.com/settings/profile</a',
    '点击右侧 【Developer settings】',
    '点击左侧 【OAuth Apps】',
    '点击右侧 【New OAuth App】',
    `填写 Application name 如：walrus， 和 Homepage URL: <span  style="color: var(--color-text-1)">${origin}</span>`,
    `填写 Authorization callback URL: <span style="color: var(--color-text-1)">${origin}/identify/callback/{provider}</span>， <span style="color: var(--color-text-1)">provider</span>为用户定义`,
    '点击 【Register application】',
    '点击 【Generate a new client secret】',
    '复制 Client ID 和 Client Secret 到左侧表单'
  ];
};

const gitlabSteps = ({ origin }) => {
  return [
    '点击头像，点击【preferences】，点击【Applications】',
    '点击 Add new application',
    `填写 Name 和 Redirect URI: <span style="color: var(--color-text-1)">${origin}/identify/callback/{provider}</span>， <span style="color: var(--color-text-1)">provider</span>为用户定义`,
    '勾选Confidential，Scope选择read_api， read_usesr， openid， profile， email',
    '点击 Save application',
    '复制 Application ID 和 Secret到左侧表单'
  ];
};

const googleSteps = ({ origin }) => {
  return [
    '进入Google Cloud Platform Console：<a href="https://console.cloud.google.com/apis/credentials" style="color: var(--color-text-1)" target=_blank>https://console.cloud.google.com/apis/credentials</a>',
    '点击 【创建凭据】，选择【OAuth 客户端 ID】',
    '应用类型：选择"Web 应用"，填写名称，如：walrus',
    `授权的 JavaScript 来源，点击【添加URI】, 填写 <span style="color: var(--color-text-1)">${origin}</span>`,
    `授权的重定向 UR，点击【点击URI】填写 <span style="color: var(--color-text-1)">${origin}/identify/callback/{provider}</span>， <span style="color: var(--color-text-1)">provider</span>为用户定义`,
    '点击 【创建】',
    '点击左侧【OAuth 权限请求页面】',
    '进入同意屏幕设置，添加测试用户，填写授权的用户邮箱，点击【保存】',
    '点击凭据，在OAuth 2.0 客户端 ID下，打开刚创建的凭据，复制 Client ID 和 Client Secret 到左侧表单'
  ];
};

const oidcSteps = ({ origin }) => {
  return [
    '进入Google Cloud Platform Console：<a href="https://console.cloud.google.com/apis/credentials" target="_blank">https://console.cloud.google.com/apis/credentials</a>',
    '点击 【创建凭据】，选择【OAuth 客户端 ID】',
    '应用类型：选择"Web 应用"，填写名称，如：walrus',
    `授权的 JavaScript 来源，点击【添加URI】, 填写 <span style="color: var(--color-text-1)">${origin}</span>`,
    `授权的重定向 UR，点击【点击URI】填写 <span style="color: var(--color-text-1)">${origin}/identify/callback/{provider}</span>， <span style="color: var(--color-text-1)">provider</span>为用户定义`,
    '点击 【创建】',
    '点击左侧【OAuth 权限请求页面】',
    '进入同意屏幕设置，添加测试用户，填写授权的用户邮箱，点击【保存】',
    '点击凭据，在OAuth 2.0 客户端 ID下，打开刚创建的凭据，复制 Client ID 和 Client Secret 到左侧表单',
    'Issuer: <span style="color: var(--color-text-1)">https://accounts.google.com</span>'
  ];
};

export default {
  [ProviderTypes.GitHub]: githubSteps,
  [ProviderTypes.GitLab]: gitlabSteps,
  [ProviderTypes.Google]: googleSteps,
  [ProviderTypes.OIDC]: oidcSteps
};
