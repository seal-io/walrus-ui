import { ref } from 'vue';
import axios from 'axios';
import qs from 'query-string';
import { useRouter } from 'vue-router';
import _ from 'lodash';
import { useProjectStore, useUserStore } from '@/store';
import { Resources, Actions } from '@/permissions/config';
import { PROJECT, DASHBOARD } from '@/router/config';
import { PageAction } from '@/views/config';
import { GlobalNamespace, NAMESPACES } from '@/views/config/resource-kinds';
import project from '@/directive/project';

export default function useEnterApplication() {
  const projectStore = useProjectStore();
  const userStore = useUserStore();
  const router = useRouter();
  const ENVIRONMENT_API = 'environments';
  const PROJECT_API = 'projects';

  const queryProjects = (params) => {
    const url = `${NAMESPACES}/${GlobalNamespace}/${PROJECT_API}`;
    return axios.get(url, {
      params,
      paramsSerializer: (obj) => {
        return qs.stringify(obj);
      }
    });
  };

  const queryEnvironmentList = (params) => {
    return axios.get(
      `/${NAMESPACES}/${params.projectName}/${ENVIRONMENT_API}`,
      {
        params: {
          ..._.omit(params, ['projectName'])
        },
        paramsSerializer: (obj) => {
          return qs.stringify(obj);
        }
      }
    );
  };

  const setDefaultProject = (list) => {
    if (!list.length) {
      projectStore.setInfo({
        defaultActiveProject: null
      });
      return;
    }
    const defaultProject = projectStore.defaultActiveProject;
    const exsitProject = _.find(list, (item) => {
      return item.value === defaultProject?.name;
    });
    const defaultValue = exsitProject
      ? defaultProject?.name
      : _.get(list, '0.value');

    const defaultName = _.find(list, (item) => item.value === defaultValue)
      ?.metadata?.namespace as string;

    projectStore.setInfo({
      defaultActiveProject: {
        name: defaultValue,
        namespace: defaultName
      }
    });
  };

  const setDefaultEnvironment = (list) => {
    if (!list.length) {
      projectStore.setInfo({
        defaultActiveEnvironment: null
      });
      return;
    }
    const defaultEnvironment = projectStore.defaultActiveEnvironment;
    const exsitEnvironment = _.find(list, (item) => {
      return item.value === defaultEnvironment?.name;
    });
    const defaultValue = exsitEnvironment
      ? defaultEnvironment?.name
      : _.get(list, '0.value');

    const defaultName = _.find(list, (item) => item.value === defaultValue)
      ?.metadata?.namespace as string;

    projectStore.setInfo({
      defaultActiveEnvironment: {
        name: defaultValue,
        namespace: defaultName
      }
    });
  };

  const getProjectList = async () => {
    try {
      const params = {};
      const { data } = await queryProjects(params);
      const list = _.map(data.items, (item) => {
        return {
          ..._.cloneDeep(item),
          label: item.metadata?.name,
          value: item.metadata?.name
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
    if (!defaultProject?.name) return;
    try {
      const params = {
        projectName: defaultProject?.name
      };
      const { data } = await queryEnvironmentList(params);
      const list = _.map(data.items, (item) => {
        return {
          ..._.cloneDeep(item),
          label: item.metadata?.name,
          value: item.metadata?.name
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
      (s) => s.value === defaultProject?.name
    );

    const projectName = pro
      ? defaultProject?.name
      : _.get(projectStore.projectList, '0.value');

    // no permission access to default project
    if (
      !userStore.hasProjectResourceActions({
        resource: Resources.Projects,
        actions: [Actions.GET],
        projectID: projectName
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
        projectName
      }
    });
  };

  const gotoDefaultEnvironment = () => {
    const defaultProject = projectStore.defaultActiveProject;
    const defaultEnvironment = projectStore.defaultActiveEnvironment;
    const enterProjectDefaultInfo = projectStore.enterProjectDefault;
    if (!defaultEnvironment?.name) {
      goToProject({ name: PROJECT.List });
      return;
    }
    router.push({
      name: PROJECT.EnvDetail,
      params: {
        projectName: defaultProject?.name,
        environmentName: defaultEnvironment?.name,
        action: PageAction.VIEW
      },
      query: {
        name: defaultEnvironment?.name
      }
    });
  };

  const gotoPreviousPage = () => {
    const defaultProject = projectStore.defaultActiveProject;
    const defaultEnvironment = projectStore.defaultActiveEnvironment;
    const enterProjectDefaultInfo = projectStore.enterProjectDefault;

    // to project list
    if (enterProjectDefaultInfo?.list || !projectStore.projectList.length) {
      router.push({
        name: PROJECT.List
      });
      return;
    }

    const existProject = _.find(
      projectStore.projectList,
      (item) => item.value === enterProjectDefaultInfo?.projectName
    );

    // to project detail
    if (enterProjectDefaultInfo?.detail) {
      if (existProject) {
        router.push({
          name: PROJECT.Detail,
          params: {
            projectName: enterProjectDefaultInfo?.projectName
          }
        });
      } else {
        router.push({
          name: PROJECT.Detail,
          params: {
            projectName: _.get(projectStore.projectList, '0.value')
          }
        });
      }
      return;
    }
    gotoDefaultEnvironment();
  };

  const gotoEnvironmentDetail = () => {
    if (!projectStore.projectList.length) {
      router.push({
        name: PROJECT.List
      });
      return;
    }
    if (projectStore.isSetDefaultActiveEnvironment) {
      gotoDefaultEnvironment();
      return;
    }
    gotoPreviousPage();
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
