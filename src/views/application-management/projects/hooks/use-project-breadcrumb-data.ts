import _ from 'lodash';
import { ref } from 'vue';
import useCallCommon from '@/hooks/use-call-common';
import { useProjectStore } from '@/store';
import { queryProjects } from '@/views/application-management/projects/api';
import { queryEnvironments } from '@/views/operation-hub/environments/api';
import { queryApplications } from '@/views/application-management/applications/api';
import { BreadcrumbOptions } from '@/views/config/interface';
import localStore from '@/utils/localStore';
import { USER_DEFAULT_PROJECT } from '@/views/config';
import { getListLabel } from '@/utils/func';

export default function useProjectData() {
  const breadCrumbList = ref<BreadcrumbOptions[]>([]);
  const { route, router } = useCallCommon();
  const projectStore = useProjectStore();
  const pageLevelMap = {
    Project: 'Project',
    Environment: 'Environment',
    Service: 'Service'
  };
  const getProjectList = async () => {
    let projectList: any[] = [];
    try {
      const params = {
        page: -1,
        t: 1
      };
      const { data } = await queryProjects(params);
      projectList = data.items || [];
    } catch (error) {
      projectList = [];
      console.log(error);
    }
    return projectList;
  };
  const getEnvironmentList = async () => {
    let environmentList: any[] = [];
    try {
      const params = {
        page: -1,
        projectID: route.params.projectId || ''
      };
      const { data } = await queryEnvironments(params);
      environmentList = data.items || [];
    } catch (error) {
      environmentList = [];
      console.log(error);
    }
    return environmentList;
  };

  const getServiceList = async () => {
    let serviceList: any[] = [];
    try {
      const params = {
        page: -1,
        projectID: route.params.projectId as string,
        environmentID: route.params.environmentId as string
      };
      const { data } = await queryApplications(params);
      serviceList = data.items || [];
    } catch (error) {
      serviceList = [];
      console.log(error);
    }
    return serviceList;
  };
  const setProjectList = async (projectList) => {
    const list = _.map(projectList, (item) => {
      return {
        ..._.cloneDeep(item),
        label: item.name || item.label,
        value: item.id || item.value
      };
    });
    const defaultValue = route.params.projectId || _.get(list, '0.value');
    const defaultName = _.get(list, '0.label');
    const { id, name } = await localStore.getValue(USER_DEFAULT_PROJECT);

    return {
      value: id || defaultValue,
      label: name || defaultName,
      icon: 'icon-apps',
      type: 'menu.applicationManagement.project',
      level: pageLevelMap.Project,
      wrapperId: 'projectWrapper',
      route: 'ProjectDetail',
      visible: false,
      options: _.cloneDeep(list),
      onSetting() {
        router.replace({
          name: 'ProjectsList'
        });
      }
    };
  };
  const setEnvironmentList = (environmentList) => {
    const list = _.map(environmentList, (item) => {
      return {
        ..._.cloneDeep(item),
        label: item.name,
        value: item.id
      };
    });
    const defaultValue = route.params.environmentId || _.get(list, '0.id');
    const defaultName = _.get(list, '0.label');

    projectStore.setInfo({
      environmentList: _.cloneDeep(list)
    });
    return {
      value: defaultValue,
      label: defaultName,
      icon: 'icon-apps',
      type: 'menu.operatorHub.evniroment',
      level: pageLevelMap.Environment,
      wrapperId: 'envWrapper',
      route: 'ProjectEnvDetail',
      visible: false,
      options: _.cloneDeep(list),
      onSetting() {
        router.replace({
          name: 'ProjectDetail'
        });
      }
    };
  };
  const setServiceList = (serviceList) => {
    const list = _.map(serviceList, (item) => {
      return {
        ..._.cloneDeep(item),
        label: item.name,
        value: item.id
      };
    });
    const defaultValue = route.query.id || _.get(list, '0.id');
    const defaultName = _.get(list, '0.label');

    projectStore.setInfo({
      serviceList: _.cloneDeep(list)
    });
    return {
      value: defaultValue,
      label: defaultName,
      icon: 'icon-apps',
      type: 'menu.applicationManagement.serivce',
      level: pageLevelMap.Service,
      wrapperId: 'serviceWrapper',
      route: 'ProjectServiceDetail',
      visible: false,
      options: _.cloneDeep(list)
      // onSetting() {
      //   router.replace({
      //     name: 'ProjectEnvDetail'
      //   });
      // }
    };
  };
  const setBreabCrumbData = async () => {
    const [projectList, environmentList, serviceList] = await Promise.all([
      getProjectList(),
      getEnvironmentList(),
      getServiceList()
    ]);
    const projectRes = await setProjectList(projectList);
    const environmentRes = setEnvironmentList(environmentList);
    const serviceRes = setServiceList(serviceList);
    breadCrumbList.value = [projectRes, environmentRes, serviceRes];
  };
  const handleBreadChange = (val, item) => {
    let params = {};
    let query = {};
    item.value = val;
    item.label = getListLabel(val, item.options);
    // environment
    if (item.level === pageLevelMap.Environment) {
      params = {
        ...route.params,
        environmentId: val
      };
    }
    // project
    if (item.level === pageLevelMap.Project) {
      params = {
        ...route.params,
        projectId: val
      };

      localStore.setValue(USER_DEFAULT_PROJECT, { id: val, name: item.label });
    }
    // service
    if (item.level === pageLevelMap.Service) {
      params = {
        ...route.params
      };
      query = {
        id: val
      };
    }
    router.replace({
      name: item.route,
      params,
      query
    });
  };
  return {
    getProjectList,
    getEnvironmentList,
    getServiceList,
    setProjectList,
    setEnvironmentList,
    setServiceList,
    setBreabCrumbData,
    handleBreadChange,
    breadCrumbList,
    pageLevelMap
  };
}
