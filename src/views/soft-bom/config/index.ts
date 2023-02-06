export const columns = [
  { title: '组件', dataIndex: 'name' },
  { title: '版本', dataIndex: 'version' },
  { title: 'PURL', dataIndex: 'purl' },
  { title: '依赖管理工具', dataIndex: 'pkgTool' },
  { title: '许可证', dataIndex: 'license' },
  { title: '项目', dataIndex: 'project' },
];
export const projectCols = [
  { title: '组件', dataIndex: 'name' },
  { title: '版本', dataIndex: 'version' },
  { title: 'PURL', dataIndex: 'purl' },
  { title: '依赖管理工具', dataIndex: 'pkgTool' },
  { title: '许可证', dataIndex: 'license' },
  { title: '关系', dataIndex: 'relation' },
];

export const repoBasicConfig = [
  { key: 'namespace', label: 'sbom.project.name' },
  { key: 'link', label: 'sbom.project.link' },
  { key: 'createTime', label: 'sbom.project.createtime' },
  { key: 'lastScan', label: 'sbom.project.lasttime' },
];

export const withVulnerConfig = [
  { label: 'projects.select.issues.with', value: 'true' },
  { label: 'projects.select.issues.without', value: 'false' },
];

export const pkgToolConfig = [
  { value: 'npm', label: 'npm' },
  { value: 'maven', label: 'maven' },
  { value: 'yarn', label: 'yarn' },
  { value: 'gradle', label: 'gradle' },
];

export const rawDataList = [
  {
    name: 'node1',
    id: '1',
    version: 'v1.2',
    purl: '',
    pkgTool: 'npm',
    license: 'MT',
    indent: 0,
    hasChildren: true,
    project: 'web',
    loaded: true,
    children: [
      {
        name: 'node11',
        id: '11',
        version: 'v1.2',
        purl: '',
        pkgTool: 'npm',
        license: 'MT',
        loaded: true,
        indent: 1,
        hasChildren: false,
        project: 'web',
      },
      {
        name: 'node12',
        id: '12',
        version: 'v1.2',
        purl: '',
        pkgTool: 'npm',
        license: 'MT',
        loaded: true,
        indent: 1,
        hasChildren: false,
        project: 'web',
      },
    ],
  },
  {
    name: 'node2',
    id: '2',
    version: 'v1.2',
    purl: '',
    pkgTool: 'npm',
    license: 'MT',
    indent: 0,
    hasChildren: false,
    loaded: false,
    project: 'web',
  },
  {
    name: 'node3',
    id: '3',
    version: 'v1.2',
    purl: '',
    pkgTool: 'npm',
    license: 'MT',
    hasChildren: true,
    project: 'web',
    indent: 0,
    loaded: true,
    children: [
      {
        name: 'node31',
        id: '31',
        version: 'v1.2',
        purl: '',
        pkgTool: 'npm',
        license: 'MT',
        loaded: true,
        indent: 1,
        hasChildren: false,
        project: 'web',
      },
      {
        name: 'node32',
        id: '32',
        version: 'v1.2',
        purl: '',
        pkgTool: 'npm',
        license: 'MT',
        loaded: true,
        indent: 1,
        hasChildren: true,
        project: 'web',
        children: [
          {
            name: 'node321',
            id: '321',
            version: 'v1.2',
            purl: '',
            pkgTool: 'npm',
            license: 'MT',
            loaded: false,
            indent: 2,
            hasChildren: true,
            project: 'web',
          },
        ],
      },
    ],
  },
];
export const scoreCardConfigList = [
  {
    label: 'Maintained',
    localeLabel: 'sbom.component.detail.maintained',
    key: 'Maintained',
    value: '',
  },
  {
    label: 'CII-Best-Practices',
    localeLabel: 'sbom.component.detail.ciiBest',
    key: 'CII-Best-Practices',
    value: '',
  },
  {
    label: 'Vulnerabilities',
    localeLabel: 'sbom.component.detail.vulnerabilities',
    key: 'Vulnerabilities',
    value: '',
  },
  {
    label: 'Signed-Releases',
    localeLabel: 'sbom.component.detail.signedReleases',
    key: 'Signed-Releases',
    value: '',
  },
  {
    label: 'Branch-Protection',
    localeLabel: 'sbom.component.detail.branchProtection',
    key: 'Branch-Protection',
    value: '',
  },
  {
    label: 'Security-Policy',
    localeLabel: 'sbom.component.detail.securityPolicy',
    key: 'Security-Policy',
    value: '',
  },
  {
    label: 'License',
    localeLabel: 'sbom.component.detail.license',
    key: 'License',
    value: '',
  },
  {
    label: 'Token-Permissions',
    localeLabel: 'sbom.component.detail.tokenPermissions',
    key: 'Token-Permissions',
    value: '',
  },
  {
    label: 'Dangerous-Workflow',
    localeLabel: 'sbom.component.detail.dangerousWorkflow',
    key: 'Dangerous-Workflow',
    value: '',
  },
  {
    label: 'Dependency-Update-Tool',
    localeLabel: 'sbom.component.detail.dependencyUpdateTool',
    key: 'Dependency-Update-Tool',
    value: '',
  },
  {
    label: 'Binary-Artifacts',
    localeLabel: 'sbom.component.detail.binaryArtifacts',
    key: 'Binary-Artifacts',
    value: '',
  },
  {
    label: 'Fuzzing',
    localeLabel: 'sbom.component.detail.fuzzing',
    key: 'Fuzzing',
    value: '',
  },
  {
    label: 'Webhooks',
    localeLabel: 'sbom.component.detail.webhooks',
    key: 'Webhooks',
    value: '',
  },
  {
    label: 'SAST',
    localeLabel: 'sbom.component.detail.sast',
    key: 'SAST',
    value: '',
  },
  {
    label: 'Pinned-Dependencies',
    localeLabel: 'sbom.component.detail.pinned',
    key: 'Pinned-Dependencies',
    value: '',
  },
  {
    label: 'Packaging',
    localeLabel: 'sbom.component.detail.packaging',
    key: 'Packaging',
    value: '',
  },
  {
    label: 'Contributors',
    localeLabel: 'sbom.component.detail.contributors',
    key: 'Contributors',
    value: '',
  },
  {
    label: 'Code-Review',
    localeLabel: 'sbom.component.detail.codereview',
    key: 'Code-Review',
    value: '',
  },
  {
    label: 'CI-Tests',
    localeLabel: 'sbom.component.detail.citests',
    key: 'CI-Tests',
    value: '',
  },
];
export const componentInfoList = [
  {
    label: '',
    key: 'name',
    value: '',
    span: 2,
  },
  { label: 'sbom.component.basic.version', value: '', key: 'version' },
  {
    label: 'sbom.component.basic.latestversion',
    value: '',
    key: 'latestVersion',
  },
  { label: 'sbom.component.basic.trail', value: '', key: 'dependencyTrails' },
];
export const iconMap = {
  swid: 'icon-icon_apqpxiangmuguanlixitong',
  file: 'icon-file-text',
  library: 'icon-component',
};
export default {};
