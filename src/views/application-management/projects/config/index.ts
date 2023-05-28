export enum ProjectRoles {
  Owner = 'project/owner',
  Member = 'project/member',
  Viewer = 'project/viewer'
}

export const projectRoles = [
  { label: 'applications.projects.role.owner', value: ProjectRoles.Owner },
  { label: 'applications.projects.role.member', value: ProjectRoles.Member },
  { label: 'applications.projects.role.viewer', value: ProjectRoles.Viewer }
];

export default {};
