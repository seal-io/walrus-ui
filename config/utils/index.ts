const child_process = require('child_process');

/**
 * Whether to generate package preview
 * 是否生成打包报告
 */
export default {};

export function isReportMode(): boolean {
  return process.env.REPORT === 'true';
}

export function getBranchInfo() {
  const latestCommit = child_process
    .execSync('git rev-parse HEAD')
    .toString()
    .trim();
  const versionTag = child_process
    .execSync(`git tag --contains ${latestCommit}`)
    .toString()
    .trim();
  // const tags = child_process
  //   .execSync('git describe --abbrev=0 --tags')
  //   .toString()
  //   .trim();
  // const versions = tags ? tags.split('\n') : [];
  return { version: versionTag, commitId: latestCommit };
}
