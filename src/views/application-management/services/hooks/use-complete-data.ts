import _, { cloneDeep } from 'lodash';
import { ref } from 'vue';
import {
  TemplateRowData,
  TemplateVersionData
} from '@/views/operation-hub/templates/config/interface';
import {
  queryTemplates,
  queryItemTemplatesVersions
} from '@/views/operation-hub/templates/api';
import useCallCommon from '@/hooks/use-call-common';
import { queryServices } from '@/views/application-management/services/api';
import { queryVariables } from '../../variables/api';

export default function useCompleteData() {
  interface HintKey {
    service: any;
    var: any;
  }
  const { route } = useCallCommon();
  const loading = ref(false);
  const templateList = ref<TemplateRowData[]>([]);
  const allTemplateVersions = ref<TemplateVersionData[]>([]);
  const completeData = ref<Partial<HintKey>>({
    service: null,
    var: null
  });
  const variableList = ref<any[]>([]);
  const serviceDataList = ref<any[]>([]);

  // modules options
  const getTemplates = async () => {
    try {
      const params = {
        page: -1,
        extract: ['-status']
      };
      const { data } = await queryTemplates(params);
      templateList.value = _.map(data?.items || [], (item) => {
        return {
          ...item,
          label: item.name,
          value: item.name
        };
      });
    } catch (error) {
      templateList.value = [];
    }
  };
  // get item template version, isOnSelect is a flag for select event
  const getTemplateVersionByItem = async (
    templateName,
    isOnSelect?: boolean
  ) => {
    const isVisited = _.find(
      allTemplateVersions.value,
      (item) => item.template.name === templateName
    );
    if (isVisited && isOnSelect) {
      return;
    }
    try {
      const params = {
        templateName
      };
      const { data } = await queryItemTemplatesVersions(params);
      allTemplateVersions.value = _.concat(
        allTemplateVersions.value,
        data?.items || []
      );
    } catch (error) {
      //
    }
  };

  const getProjectVariables = async () => {
    try {
      const params = {
        page: -1,
        projectID: route.params.projectId as string,
        environmentID: route.params.environmentId as string,
        includeInherited: true
      };
      const { data } = await queryVariables(params);
      variableList.value = data.items || [];
    } catch (error) {
      variableList.value = [];
    }
  };
  const getServiceTemplateVersionMap = () => {
    const list = _.map(serviceDataList.value, (item) => {
      return {
        name: item.name,
        type: item.template.name,
        version: item.template.version
      };
    });
    return list;
  };

  const getServiceList = async () => {
    try {
      const params = {
        page: -1,
        withSchema: true,
        extract: ['-projectId', '-status']
      };
      const { data } = await queryServices(params);
      serviceDataList.value = data.items || [];
      allTemplateVersions.value = _.map(data?.items || [], (item) => {
        const { template } = cloneDeep(item);
        return {
          ...template,
          template
        };
      }) as TemplateVersionData[];
    } catch (error) {
      serviceDataList.value = [];
    }
  };
  const setVariablesCompleteData = () => {
    const vars = _.map(variableList.value, (item) => {
      return {
        value: item.name,
        label: item.name,
        tips: item.value,
        showTips: true,
        sensitive: item.sensitive
      };
    });
    return vars;
  };
  const setServiceCompleteData = () => {
    const list = getServiceTemplateVersionMap();
    const services = _.reduce(
      list,
      (obj, item) => {
        // The version corresponding to the module that has been added
        const addedServiceTemplate = _.find(
          allTemplateVersions.value || [],
          (s) => {
            return item.type === s.template.name && s.version === item.version;
          }
        );
        const k = item.name;
        obj[k] = [
          ..._.map(_.get(addedServiceTemplate, 'schema.outputs') || [], (o) => {
            return {
              value: o.name,
              label: o.name,
              description: o.description
            };
          })
        ];
        return obj;
      },
      {}
    );
    return services;
  };
  const updateServiceCompleteData = () => {
    const services = setServiceCompleteData();
    completeData.value.service = { ...services };
  };
  const updateVariablesCompleteData = () => {
    const variables = setVariablesCompleteData();
    completeData.value.var = [...variables];
  };
  const setCompleteData = () => {
    updateServiceCompleteData();
    updateVariablesCompleteData();
  };
  const getServiceTemplateVersions = () => {
    const list = _.map(serviceDataList.value, (item) => {
      return item.template.name;
    }).filter((templateName) => !!templateName);
    return list;
  };

  const initCompleteData = async () => {
    loading.value = true;
    await Promise.all([
      getTemplates(),
      getServiceList(),
      getProjectVariables()
    ]);
    setCompleteData();
    loading.value = false;
  };
  return {
    initCompleteData,
    getTemplates,
    getTemplateVersionByItem,
    completeData,
    templateList,
    allTemplateVersions,
    serviceDataList,
    completeDataLoading: loading
  };
}
