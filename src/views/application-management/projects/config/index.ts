import dayjs from 'dayjs';
import { useUserStore } from '@/store';
import { ProjectTabs, CommonButtonValue } from '@/views/config';
import { Resources, Actions } from '@/permissions/config';
import { MoreAction } from '@/views/config/interface';

const userStore = useUserStore();
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

export const basicInfoConfig = [
  { label: 'common.table.name', value: '', key: 'name' },
  {
    label: 'common.table.createTime',
    value: '',
    key: 'createTime',
    formatter(val) {
      return dayjs(val).format('YYYY-MM-DD HH:mm:ss');
    }
  },
  {
    label: 'common.table.description',
    value: '',
    key: 'description',
    span: 2
  }
];

export const projectDetailTabs = [
  {
    label: 'menu.operatorHub.evniroment',
    value: ProjectTabs.ENVIRONMENT,
    resource: Resources.Environments,
    component: 'EnviromentList'
  },
  {
    label: 'menu.operatorHub.variables',
    value: ProjectTabs.VARIABLES,
    resource: Resources.Variables,
    component: 'SecretList'
  },
  {
    label: 'menu.operatorHub.connector',
    value: ProjectTabs.CONNECTOR,
    resource: Resources.Connectors,
    component: 'ConnectorList',
    props: { scope: 'project' }
  },
  {
    label: 'menu.applicationManagement.members',
    value: ProjectTabs.MEMBER,
    resource: Resources.ProjectSubjects,
    component: 'members'
  },
  {
    label: 'menu.applicationManagement.templates',
    value: ProjectTabs.TEMPLATES,
    resource: Resources.Templates,
    component: 'templates'
  },
  {
    label: 'menu.applicationManagement.catalogs',
    value: ProjectTabs.CATALOGS,
    resource: Resources.Catalogs,
    component: 'catalogs'
  },
  {
    label: 'menu.applicationManagement.workflow',
    value: ProjectTabs.WORKFLOW,
    resource: Resources.ProjectSubjects,
    component: 'workflow'
  }
];

export const actionList: MoreAction[] = [
  {
    label: 'common.button.edit',
    value: CommonButtonValue.Edit,
    icon: 'icon-edit',
    handler: '',
    status: 'normal',
    disabled: false,
    filterFun({ row }) {
      return userStore.hasProjectResourceActions({
        projectID: row.id,
        resource: Resources.Projects,
        actions: [Actions.PUT]
      });
    }
  },
  {
    label: 'common.button.delete',
    value: CommonButtonValue.Delete,
    icon: 'icon-delete',
    handler: '',
    status: 'danger',
    style: {
      fontSize: '12px'
    },
    filterFun({ row }) {
      return userStore.hasProjectResourceActions({
        projectID: row.id,
        environmentID: row.id,
        resource: Resources.Projects,
        actions: [Actions.DELETE]
      });
    }
  }
];
export default {};
