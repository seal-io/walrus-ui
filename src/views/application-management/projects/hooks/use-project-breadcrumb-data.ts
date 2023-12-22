import _ from 'lodash';
import { createAxiosToken } from '@/api/axios-chunk-request';
import { reactive, ref, onBeforeUnmount } from 'vue';
import { Resources, Actions } from '@/permissions/config';
import { PROJECT, WORKFLOW } from '@/router/config';
import useCallCommon from '@/hooks/use-call-common';
import { useProjectStore, useUserStore } from '@/store';
import { queryProjects } from '@/views/application-management/projects/api';
import { queryEnvironments } from '@/views/application-management/environments/api';
import { queryServices } from '@/views/application-management/services/api';
import {
  queryPipelines,
  queryPipelineRecords
} from '@/views/application-management/workflows/api';
import { BreadcrumbOptions } from '@/views/config/interface';
import { getListLabel } from '@/utils/func';
import { ServiceDataType } from '../../services/config';

export default function useProjectData() {
  const breadCrumbList = ref<BreadcrumbOptions[]>([]);
  const { route, router } = useCallCommon();
  const projectStore = useProjectStore();
  const userStore = useUserStore();
  let projectRequestToken: any = null;
  let environmentRequestToken: any = null;
  let serviceRequestToken: any = null;
  let pipelineRequestToken: any = null;
  let pipelineExecutionRequestToken: any = null;

  // breadCrumbList dropdown loading
  const RequestLoadingMap = reactive({
    project: false,
    environment: false,
    service: false,
    pipeline: false,
    pipelineExcutions: false
  });
  const pageLevelMap = {
    Project: 'Project',
    Environment: 'Environment',
    Service: 'Service',
    Pipeline: 'Pipeline',
    PipelineExcutions: 'PipelineExcutions'
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

  // =========== project start=============
  const projectTemplate = {
    ...templateCommonConfig,
    type: 'menu.applicationManagement.project',
    level: pageLevelMap.Project,
    wrapperId: 'projectWrapper',
    route: PROJECT.Detail
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
  // =========== project end =============

  // =========== environment start=============
  const environmentTemplate = {
    ...templateCommonConfig,
    type: 'menu.operatorHub.evniroment',
    level: pageLevelMap.Environment,
    wrapperId: 'envWrapper',
    route: PROJECT.EnvDetail
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
  // =========== environment end =============

  // ======== services start ==========
  const serviceTemplate = {
    ...templateCommonConfig,
    type: 'menu.applicationManagement.resource',
    level: pageLevelMap.Service,
    wrapperId: 'serviceWrapper',
    route: PROJECT.ServiceDetail
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
      serviceList = _.map(data.items, (item) => {
        return {
          ...item,
          isService: !item.type,
          label: item.name,
          value: item.id
        };
      });
    } catch (error) {
      serviceList = [];
    } finally {
      RequestLoadingMap.service = false;
    }
    return serviceList;
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
    console.log('list===99=', list);
    return {
      ...serviceTemplate,
      value: defaultValue as string,
      label: defaultName,
      icon: 'icon-apps',
      type: 'menu.applicationManagement.resource',
      level: pageLevelMap.Service,
      wrapperId: 'serviceWrapper',
      route: PROJECT.ServiceDetail,
      visible: false,
      options: _.cloneDeep(list)
    };
  };
  // =========== services end =============

  // =========== pipelines start =============
  const pipelineTemplate = {
    ...templateCommonConfig,
    type: 'menu.applicationManagement.workflow',
    level: pageLevelMap.Pipeline,
    wrapperId: 'pipelineWrapper',
    route: WORKFLOW.Records
  };

  const getPipelineList = async () => {
    if (!route.params.flowId && !route.query.flowId) return [];
    let pipelineList: any[] = [];
    pipelineRequestToken?.cancel();
    pipelineRequestToken = createAxiosToken();
    try {
      const params = {
        page: -1,
        id: route.params.flowId
      };
      RequestLoadingMap.pipeline = true;
      const { data } = await queryPipelines(
        params,
        pipelineRequestToken?.token
      );
      pipelineList = data.items || [];
    } catch (error) {
      pipelineList = [];
    } finally {
      RequestLoadingMap.pipeline = false;
    }
    return pipelineList;
  };

  const setPipelineList = (pipelineList) => {
    const flowId = route.params.flowId || route.query.flowId;
    const list = _.map(pipelineList, (item) => {
      return {
        ..._.cloneDeep(item),
        label: item.name,
        value: item.id
      };
    });
    const defaultValue = flowId || _.get(list, '0.id');
    const defaultName = _.find(list, { value: defaultValue })?.label as string;

    projectStore.setInfo({
      pipelineList: _.cloneDeep(list)
    });
    return {
      ...pipelineTemplate,
      value: defaultValue as string,
      label: defaultName,
      options: _.cloneDeep(list)
    };
  };
  // =========== pipelines end =============

  // ========== pipeline excutions start ==========
  const pipelineExcutionTemplate = {
    ...templateCommonConfig,
    type: 'applications.workflow.name',
    level: pageLevelMap.PipelineExcutions,
    wrapperId: 'pipelineExcutionWrapper',
    route: WORKFLOW.Detail
  };

  const getPipelineRecordsList = async () => {
    if (!route.params.flowId) return [];
    let recordList: any[] = [];
    pipelineExecutionRequestToken?.cancel();
    pipelineExecutionRequestToken = createAxiosToken();
    try {
      const params = {
        page: -1,
        id: route.params.flowId as string
      };
      RequestLoadingMap.pipelineExcutions = true;
      const { data } = await queryPipelineRecords(
        params,
        pipelineExecutionRequestToken?.token
      );
      recordList = data.items || [];
    } catch (error) {
      recordList = [];
    } finally {
      RequestLoadingMap.pipelineExcutions = false;
    }
    return recordList;
  };

  const setPipelineRecordsList = (recordList) => {
    const list = _.map(recordList, (item) => {
      return {
        ..._.cloneDeep(item),
        label: `#${item.version}`,
        value: item.id
      };
    });
    const defaultValue = route.query.execId || _.get(list, '0.id');
    const defaultName = _.find(list, { value: defaultValue })?.label as string;

    projectStore.setInfo({
      pipelineRecordList: _.cloneDeep(list)
    });
    return {
      ...pipelineExcutionTemplate,
      value: defaultValue as string,
      label: defaultName,
      icon: 'icon-apps',
      type: 'workflow.stage.records',
      level: pageLevelMap.PipelineExcutions,
      wrapperId: 'pipelineRecordWrapper',
      route: WORKFLOW.Detail,
      visible: false,
      options: _.cloneDeep(list)
    };
  };
  // =========== pipeline excutions end =============
  const setBreabCrumbData = async () => {
    const [projectList, environmentList, serviceList] = await Promise.all([
      getProjectList(),
      getEnvironmentList(),
      getServiceList()
    ]);
    const services = _.map(serviceList, (item) => {
      return {
        ...item,
        isService: !item.type
      };
    });
    const projectRes = await setProjectList(projectList);
    const environmentRes = setEnvironmentList(environmentList);
    const serviceRes = setServiceList(services);
    breadCrumbList.value = [projectRes, environmentRes, serviceRes];
  };
  const handleBreadChange = (val, item) => {
    let params = {};
    let query = {};
    item.value = val;
    item.label = getListLabel(val, item.options);

    // pipeline excutions
    if (item.level === pageLevelMap.PipelineExcutions) {
      params = {
        ...route.params
      };
      query = {
        execId: val
      };
    }
    // pipeline
    if (item.level === pageLevelMap.Pipeline) {
      params = {
        ...route.params,
        flowId: val
      };
    }
    // environment
    if (item.level === pageLevelMap.Environment) {
      params = {
        ...route.params,
        environmentId: val
      };
      projectStore.setInfo({
        defaultActiveEnvironment: {
          id: val,
          name: item.label
        }
      });
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
      const data = _.find(item.options, { value: val });
      params = {
        ...route.params,
        dataType: data.isService
          ? ServiceDataType.service
          : ServiceDataType.resource
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
  const initBreadValues = async (
    values?: Array<'env' | 'service' | 'pipeline' | 'pipelineRecords'>
  ) => {
    const projectRes = await setProjectList(projectStore.projectList);
    let environmentRes: any[] = [];
    let serviceRes: any[] = [];
    let pipelineRes: any[] = [];
    let pipelineRecordsRes: any[] = [];

    if (_.includes(values, 'pipelineRecords')) {
      const pipelineRecords =
        setPipelineRecordsList(projectStore.pipelineRecordList) ||
        pipelineExcutionTemplate;
      pipelineRecordsRes = [{ ...pipelineRecords }];
    }

    if (_.includes(values, 'pipeline')) {
      const pipelines =
        setPipelineList(projectStore.pipelineList) || pipelineTemplate;
      pipelineRes = [{ ...pipelines }];
    }
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
      pipelineRes,
      environmentRes,
      serviceRes,
      pipelineRecordsRes
    ) as BreadcrumbOptions[];
  };
  onBeforeUnmount(() => {
    projectRequestToken?.cancel();
    environmentRequestToken?.cancel();
    serviceRequestToken?.cancel();
    pipelineRequestToken?.cancel();
    pipelineExecutionRequestToken?.cancel();
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
    serviceTemplate,
    pipelineTemplate,
    getPipelineList,
    setPipelineList,
    getPipelineRecordsList,
    setPipelineRecordsList
  };
}
