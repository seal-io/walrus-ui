import dayjs from 'dayjs';
import _ from 'lodash';
import { Resources, Actions } from '@/permissions/config';
import { MoreAction } from '@/views/config/interface';
import { CommonButtonValue } from '@/views/config';
import { useUserStore } from '@/store';

const userStore = useUserStore();

export const basicInfoConfig = [
  { label: 'applications.applications.form.name', value: '', key: 'name' },
  {
    label: 'common.table.createTime',
    value: '',
    key: 'createTime',
    formatter(val) {
      return dayjs(val).format('YYYY-MM-DD HH:mm:ss');
    }
  },
  {
    label: 'applications.projects.table.name',
    value: '',
    key: 'project.name'
  },
  {
    label: 'common.table.description',
    value: '',
    key: 'description',
    span: 2
  }
];

export const EnvironmentActions: MoreAction[] = [
  {
    label: 'common.button.edit',
    value: CommonButtonValue.Edit,
    icon: 'icon-edit',
    handler: '',
    status: 'normal',
    disabled: false,
    filterFun({ row, projectID }) {
      return userStore.hasProjectResourceActions({
        projectID,
        environmentID: row.id,
        resource: Resources.Environments,
        actions: [Actions.PUT]
      });
    }
  },
  {
    label: 'common.button.stop',
    value: CommonButtonValue.Stop,
    icon: 'icon-record-stop',
    handler: '',
    status: 'normal',
    disabled({ row }) {
      return !row.connectors?.length;
    },
    filterFun({ row, projectID }) {
      return userStore.hasProjectResourceActions({
        projectID,
        environmentID: row.id,
        resource: Resources.Environments,
        actions: [Actions.PUT]
      });
    }
  },
  {
    label: 'common.button.start',
    value: CommonButtonValue.Start,
    icon: 'icon-play-circle',
    handler: '',
    status: 'normal',
    disabled({ row }) {
      return !row.connectors?.length;
    },
    filterFun({ row, projectID }) {
      return userStore.hasProjectResourceActions({
        projectID,
        environmentID: row.id,
        resource: Resources.Environments,
        actions: [Actions.PUT]
      });
    }
  },
  {
    label: 'common.button.detail',
    value: CommonButtonValue.View,
    icon: 'icon-details',
    iconfont: true,
    handler: '',
    status: 'normal',
    style: {
      fontSize: '12px'
    },
    disabled: false,
    filterFun({ row, projectID }) {
      return true;
    }
  },
  {
    label: 'common.button.clone',
    value: CommonButtonValue.Clone,
    icon: 'icon-Clone-Cloud',
    iconfont: true,
    handler: '',
    status: 'normal',
    style: {
      fontSize: '12px'
    },
    disabled({ row }) {
      return !row.connectors?.length;
    },
    filterFun({ row, projectID }) {
      return userStore.hasProjectResourceActions({
        projectID,
        environmentID: row.id,
        resource: Resources.Environments,
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
    filterFun({ row, projectID }) {
      return userStore.hasProjectResourceActions({
        projectID,
        environmentID: row.id,
        resource: Resources.Environments,
        actions: [Actions.DELETE]
      });
    }
  }
];
export default {};
