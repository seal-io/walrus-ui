import { useProjectStore } from '@/store';
import localStore from '@/utils/localStore';
import { USER_DEFAULT_PROJECT } from '@/views/config';
import useCallCommon from '@/hooks/use-call-common';
import _ from 'lodash';

export default function useGetBreadState() {
  const projectStore = useProjectStore();
  const { router } = useCallCommon();

  const getProjectState = ({ id, name }) => {
    return {
      value: id,
      label: name || '',
      icon: 'icon-apps',
      type: 'Project',
      wrapperId: 'projectWrapper',
      route: 'ProjectDetail',
      visible: false,
      options: _.cloneDeep(projectStore.projectList),
      onSetting() {
        router.replace({
          name: 'ProjectsList'
        });
      }
    };
  };

  const getEnvironmentState = ({ id, name }) => {
    return {
      value: id,
      label: name || '',
      icon: 'icon-apps',
      type: 'Environment',
      wrapperId: 'envWrapper',
      route: 'ProjectEnvDetail',
      visible: false,
      options: _.cloneDeep(projectStore.environmentList),
      onSetting() {
        router.replace({
          name: 'ProjectDetail'
        });
      }
    };
  };
  return {
    getProjectState,
    getEnvironmentState
  };
}
