import { ref } from 'vue';
import axios from 'axios';
import qs from 'query-string';
import { useRouter } from 'vue-router';
import _ from 'lodash';
import { useProjectStore, useUserStore } from '@/store';
import { Resources, Actions } from '@/permissions/config';
import { PROJECT } from '@/router/config';
import { PageAction } from '@/views/config';

export default function useDefaultEnterPage() {
  const projectStore = useProjectStore();
  const userStore = useUserStore();
  const router = useRouter();
  const ENVIRONMENT_API = '/environments';

  const queryProjects = (params) => {
    return axios.get('/projects', {
      params,
      paramsSerializer: (obj) => {
        return qs.stringify(obj);
      }
    });
  };

  const queryEnvironmentList = (params) => {
    return axios.get(`/projects/${params.projectID}${ENVIRONMENT_API}`, {
      params: {
        ..._.omit(params, ['projectID'])
      },
      paramsSerializer: (obj) => {
        return qs.stringify(obj);
      }
    });
  };
  const setDefaultProject = (list) => {
    const defaultProject = projectStore.defaultActiveProject;
    const defaultValue = defaultProject?.id || _.get(list, '0.value');
    const defaultName = _.find(list, (item) => item.value === defaultValue)
      ?.label as string;

    if (!defaultProject?.id && list.length) {
      projectStore.setInfo({
        defaultActiveProject: {
          id: defaultValue,
          name: defaultName
        }
      });
    } else if (!list.length) {
      projectStore.setInfo({
        defaultActiveProject: {}
      });
    } else {
      const data = _.find(list, (item) => item.value === defaultProject?.id);
      projectStore.setInfo({
        defaultActiveProject: {
          id: data?.value || defaultValue,
          name: data?.label || defaultName
        }
      });
    }
  };

  const setDefaultEnvironment = (list) => {
    const defaultEnvironment = projectStore.defaultActiveEnvironment;
    const defaultValue = defaultEnvironment?.id || _.get(list, '0.value');
    const defaultName = _.find(list, (item) => item.value === defaultValue)
      ?.label as string;

    if (!defaultEnvironment?.id && list.length) {
      projectStore.setInfo({
        defaultActiveEnvironment: {
          id: defaultValue,
          name: defaultName
        }
      });
    } else if (!list.length) {
      projectStore.setInfo({
        defaultActiveEnvironment: {}
      });
    } else {
      const data = _.find(
        list,
        (item) => item.value === defaultEnvironment?.id
      );
      projectStore.setInfo({
        defaultActiveEnvironment: {
          id: data?.value || defaultValue,
          name: data?.label || defaultName
        }
      });
    }
  };

  const getProjectList = async () => {
    try {
      const params = {
        page: -1
      };
      const { data } = await queryProjects(params);
      const list = _.map(data.items, (item) => {
        return {
          label: item.name,
          value: item.id
        };
      });

      setDefaultProject(list);

      projectStore.setInfo({
        projectList: _.cloneDeep(list)
      });
    } catch (error) {
      projectStore.setInfo({
        projectList: []
      });
    }
  };

  const getEnvironmentList = async () => {
    const defaultProject = projectStore.defaultActiveProject;
    if (!defaultProject?.id) return;
    try {
      const params = {
        page: -1,
        projectID: defaultProject?.id
      };
      const { data } = await queryEnvironmentList(params);
      const list = _.map(data.items, (item) => {
        return {
          ..._.cloneDeep(item),
          label: item.name,
          value: item.id
        };
      });
      projectStore.setInfo({
        environmentList: _.cloneDeep(list)
      });
      setDefaultEnvironment(list);
    } catch (error) {
      // ignore
    }
  };

  const goToProject = (item) => {
    const defaultProject = projectStore.defaultActiveProject;
    // need create new project
    if (!projectStore.projectList.length) {
      router.push({
        name: item.name
      });
      return;
    }

    const pro = _.find(
      projectStore.projectList,
      (s) => s.value === defaultProject?.id
    );

    const projectID = pro
      ? defaultProject?.id
      : _.get(projectStore.projectList, '0.value');

    // no permission access to default project
    if (
      !userStore.hasProjectResourceActions({
        resource: Resources.Projects,
        actions: [Actions.GET],
        projectID
      })
    ) {
      router.push({
        name: item.name
      });
      return;
    }

    // has access permission to default project
    router.push({
      name: PROJECT.Detail,
      params: {
        projectId: projectID
      }
    });
  };

  const gotoEnvironmentDetail = () => {
    const defaultProject = projectStore.defaultActiveProject;
    const defaultEnvironment = projectStore.defaultActiveEnvironment;
    if (!defaultEnvironment?.id) {
      goToProject({ name: PROJECT.List });
      return;
    }
    router.push({
      name: PROJECT.EnvDetail,
      params: {
        projectId: defaultProject?.id,
        environmentId: defaultEnvironment?.id,
        action: PageAction.VIEW
      },
      query: {
        id: defaultEnvironment?.id
      }
    });
  };

  const initDefaultProject = async () => {
    await getProjectList();
    await getEnvironmentList();
  };
  return {
    initDefaultProject,
    gotoEnvironmentDetail
  };
}
