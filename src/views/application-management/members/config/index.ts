import dayjs from 'dayjs';
import { useUserStore } from '@/store';
import { CommonButtonValue } from '@/views/config';
import { Resources, Actions } from '@/permissions/config';
import { MoreAction } from '@/views/config/interface';

const userStore = useUserStore();

export const actionList: MoreAction[] = [
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
        resource: Resources.ProjectSubjects,
        projectID: row?.project?.id,
        actions: [Actions.DELETE]
      });
    }
  }
];

export default {};
