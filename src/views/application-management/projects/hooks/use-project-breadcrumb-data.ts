import _ from 'lodash';
import { createAxiosToken } from '@/api/axios-chunk-request';
import { reactive, ref, onBeforeUnmount } from 'vue';
import { Resources, Actions } from '@/permissions/config';
import { PROJECT } from '@/router/config';
import useCallCommon from '@/hooks/use-call-common';
import { useProjectStore, useUserStore } from '@/store';
import { queryProjects } from '@/views/application-management/projects/api';
import { queryEnvironments } from '@/views/application-management/environments/api';
import { queryServices } from '@/views/application-management/services/api';
import { BreadcrumbOptions } from '@/views/config/interface';
import { getListLabel } from '@/utils/func';

export default function useProjectData() {
  const breadCrumbList = ref<BreadcrumbOptions[]>([]);
  const { route, router } = useCallCommon();
  const projectStore = useProjectStore();
  const userStore = useUserStore();
  let projectRequestToken: any = null;
  let environmentRequestToken: any = null;
  let serviceRequestToken: any = null;

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
    if (!route.params.projectId) return [];
    let projectList: any[] = [];
    projectRequestToken?.cancel();
    projectRequestToken = createAxiosToken();
    try {
      const params = {
        page: -1
      };
      RequestLoadingMap.project = true;
      const { data } = await queryProjects(params, projectRequestToken?.token);
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
    } finally {
      RequestLoadingMap.project = false;
    }
    return projectList;
  };
  const getEnvironmentList = async () => {
    if (!route.params.environmentId) return [];
    let environmentList: any[] = [];
    environmentRequestToken?.cancel();
    environmentRequestToken = createAxiosToken();
    try {
      const params = {
        page: -1
      };
      RequestLoadingMap.environment = true;
      const { data } = await queryEnvironments(
        params,
        environmentRequestToken?.token
      );
      environmentList = data.items || [];
    } catch (error) {
      environmentList = [];
    } finally {
      RequestLoadingMap.environment = false;
    }
    return environmentList;
  };

  const getServiceList = async (queryparams?: object) => {
    let serviceList: any[] = [];
    serviceRequestToken?.cancel();
    serviceRequestToken = createAxiosToken();
    try {
      const params = {
        page: 1,
        perPage: 10,
        extract: ['-attributes', '-projectId', '-status', '-template'],
        ...queryparams
      };
      RequestLoadingMap.service = true;
      const { data } = await queryServices(params, serviceRequestToken?.token);
      serviceList = data.items || [];
    } catch (error) {
      serviceList = [];
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
    const defaultName = _.find(list, { value: defaultValue })?.label as string;

    return {
      ...projectTemplate,
      value: defaultValue as string,
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
    const list = _.map(environmentList, (item) => {
      return {
        ..._.cloneDeep(item),
        label: item.name,
        value: item.id
      };
    });
    const defaultValue = route.params.environmentId || _.get(list, '0.id');
    const defaultName = _.find(list, { value: defaultValue })?.label as string;

    projectStore.setInfo({
      environmentList: _.cloneDeep(list)
    });
    return {
      ...environmentTemplate,
      value: defaultValue as string,
      label: defaultName,
      options: _.cloneDeep(list)
    };
  };
  const setServiceList = (serviceList) => {
    const list = _.map(serviceList, (item) => {
      return {
        ..._.cloneDeep(item),
        label: item.name as string,
        value: item.id
      };
    });
    const defaultValue = route.query.id || _.get(list, '0.id');
    const defaultName = _.find(list, { value: defaultValue })?.label as string;

    projectStore.setInfo({
      serviceList: _.cloneDeep(list)
    });
    return {
      ...serviceTemplate,
      value: defaultValue as string,
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

      projectStore.setInfo({
        defaultActiveProject: {
          id: val,
          name: item.label
        }
      });
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
  // init breadCrumbList data from cache
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
  onBeforeUnmount(() => {
    projectRequestToken?.cancel();
    environmentRequestToken?.cancel();
    serviceRequestToken?.cancel();
  });
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
