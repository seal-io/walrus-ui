import _ from 'lodash';
import { reactive, ref } from 'vue';
import { Resources, Actions } from '@/permissions/config';
import { PROJECT } from '@/router/config';
import useCallCommon from '@/hooks/use-call-common';
import { useProjectStore, useUserStore } from '@/store';
import { queryProjects } from '@/views/application-management/projects/api';
import { queryEnvironments } from '@/views/application-management/environments/api';
import { queryServices } from '@/views/application-management/services/api';
import { BreadcrumbOptions } from '@/views/config/interface';
import localStore from '@/utils/localStore';
import { USER_DEFAULT_PROJECT } from '@/views/config';
import { getListLabel } from '@/utils/func';

export default function useProjectData() {
  const breadCrumbList = ref<BreadcrumbOptions[]>([]);
  const { route, router } = useCallCommon();
  const projectStore = useProjectStore();
  const userStore = useUserStore();
  // breadCrumbList dropdown loading
  const RequestLoadingMap = reactive({
    project: false,
    environment: false,
    service: false
  });
  const pageLevelMap = {
    Project: 'Project',
    Environment: 'Environment',
    Service: 'Service'
  };
  const templateCommonConfig = {
    value: '',
    label: '',
    hasOptions: true,
    icon: '',
    visible: false,
    inputValue: '',
    options: []
  };

  const projectTemplate = {
    ...templateCommonConfig,
    type: 'menu.applicationManagement.project',
    level: pageLevelMap.Project,
    wrapperId: 'projectWrapper',
    route: PROJECT.Detail
  };
  const environmentTemplate = {
    ...templateCommonConfig,
    type: 'menu.operatorHub.evniroment',
    level: pageLevelMap.Environment,
    wrapperId: 'envWrapper',
    route: PROJECT.EnvDetail
  };
  const serviceTemplate = {
    ...templateCommonConfig,
    type: 'menu.applicationManagement.serivce',
    level: pageLevelMap.Service,
    wrapperId: 'serviceWrapper',
    route: PROJECT.ServiceDetail
  };

  const getProjectList = async () => {
    let projectList: any[] = [];
    try {
      const params = {
        page: -1
      };
      RequestLoadingMap.project = true;
      const { data } = await queryProjects(params);
      projectList = data.items || [];
      const list = _.map(data.items, (item) => {
        return {
          label: item.name,
          value: item.id
        };
      });
      projectStore.setInfo({
        projectList: list
      });
    } catch (error) {
      projectList = [];
      projectStore.setInfo({
        projectList: []
      });
      console.log(error);
    } finally {
      RequestLoadingMap.project = false;
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
      RequestLoadingMap.environment = true;
      const { data } = await queryEnvironments(params);
      environmentList = data.items || [];
    } catch (error) {
      environmentList = [];
      console.log(error);
    } finally {
      RequestLoadingMap.environment = false;
    }
    return environmentList;
  };

  const getServiceList = async (queryparams?: object) => {
    let serviceList: any[] = [];
    try {
      const params = {
        page: 1,
        perPage: 10,
        projectID: route.params.projectId as string,
        environmentID: route.params.environmentId as string,
        extract: ['-attributes', '-projectId', '-status', '-template'],
        ...queryparams
      };
      RequestLoadingMap.service = true;
      const { data } = await queryServices(params);
      serviceList = data.items || [];
    } catch (error) {
      serviceList = [];
      console.log(error);
    } finally {
      RequestLoadingMap.service = false;
    }
    return serviceList;
  };

  const setProjectList = async (projectList) => {
    const accessedList = _.filter(projectList, (item) => {
      return userStore.hasProjectResourceActions({
        resource: Resources.Projects,
        projectID: item.id || item.value,
        actions: [Actions.GET]
      });
    });
    const list = _.map(accessedList, (item) => {
      return {
        ..._.cloneDeep(item),
        label: item.name || item.label,
        value: item.id || item.value
      };
    });
    const defaultValue = route.params.projectId || _.get(list, '0.value');
    const defaultName = _.get(list, '0.label');
    // const defaultProject = await localStore.getValue(USER_DEFAULT_PROJECT);

    return {
      ...projectTemplate,
      value: defaultValue,
      label: defaultName,
      options: _.cloneDeep(list),
      onSetting() {
        router.replace({
          name: PROJECT.List
        });
      }
    };
  };
  const setEnvironmentList = (environmentList) => {
    // const accessedList = _.filter(environmentList, (item) => {
    //   return userStore.hasProjectResourceActions({
    //     resource: Resources.Environments,
    //     projectID: route.params.projectId,
    //     actions: [Actions.GET]
    //   });
    // });
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
      ...environmentTemplate,
      value: defaultValue,
      label: defaultName,
      options: _.cloneDeep(list)
    };
  };
  const setServiceList = (serviceList) => {
    // const accessedList = _.filter(serviceList, (item) => {
    //   return userStore.hasProjectResourceActions({
    //     resource: Resources.Environments,
    //     projectID: route.params.projectId,
    //     actions: [Actions.GET]
    //   });
    // });
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
      ...serviceTemplate,
      value: defaultValue,
      label: defaultName,
      icon: 'icon-apps',
      type: 'menu.applicationManagement.serivce',
      level: pageLevelMap.Service,
      wrapperId: 'serviceWrapper',
      route: PROJECT.ServiceDetail,
      visible: false,
      options: _.cloneDeep(list)
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
        from: route.query.from, // if from has value click environment: router.replace
        id: val
      };
    }
    router.replace({
      name: item.route,
      params,
      query
    });
  };
  const initBreadValues = async (values?: Array<'env' | 'service'>) => {
    const projectRes = await setProjectList(projectStore.projectList);
    let environmentRes: any[] = [];
    let serviceRes: any[] = [];
    if (_.includes(values, 'env')) {
      const env =
        setEnvironmentList(projectStore.environmentList) || environmentTemplate;
      environmentRes = [{ ...env }];
    }
    if (_.includes(values, 'service')) {
      const service =
        setServiceList(projectStore.serviceList) || serviceTemplate;
      serviceRes = [{ ...service }];
    }
    return _.concat(
      projectRes,
      environmentRes,
      serviceRes
    ) as BreadcrumbOptions[];
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
    initBreadValues,
    breadCrumbList,
    pageLevelMap,
    RequestLoadingMap,
    projectTemplate,
    environmentTemplate,
    serviceTemplate
  };
}
