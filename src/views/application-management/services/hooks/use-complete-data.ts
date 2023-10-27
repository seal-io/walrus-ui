import _, { cloneDeep } from 'lodash';
import { ref, onBeforeUnmount } from 'vue';
import {
  TemplateRowData,
  TemplateVersionData
} from '@/views/operation-hub/templates/config/interface';
import { createAxiosToken } from '@/api/axios-chunk-request';
import {
  queryTemplates,
  queryItemTemplatesVersions
} from '@/views/operation-hub/templates/api';
import { queryServices } from '@/views/application-management/services/api';
import useCallCommon from '@/hooks/use-call-common';
import { queryVariables } from '../../variables/api';

export default function useCompleteData() {
  interface HintKey {
    service: any;
    var: any;
  }
  const { route } = useCallCommon();
  const id = route.query.id || '';
  const loading = ref(false);
  const templateList = ref<TemplateRowData[]>([]);
  const allTemplateVersions = ref<TemplateVersionData[]>([]);
  const completeData = ref<Partial<HintKey>>({
    service: null,
    var: null
  });
  const variableList = ref<any[]>([]);
  const serviceDataList = ref<any[]>([]);
  let templateVersionToken: any = null;
  let templateToken: any = null;
  let serviceToken: any = null;

  // modules options
  const getTemplates = async () => {
    templateToken?.cancel?.();
    templateToken = createAxiosToken();
    try {
      const params = {
        page: -1,
        withGlobal: true,
        extract: ['-status']
      };
      const { data } = await queryTemplates(params, templateToken.token);
      templateList.value = _.map(data?.items || [], (item) => {
        return {
          ...item,
          label: item.name,
          value: item.id
        };
      });
    } catch (error) {
      templateList.value = [];
    }
  };
  // get item template version, isOnSelect is a flag for select event
  const getTemplateVersionByItem = async (templateID, isOnSelect?: boolean) => {
    const isVisited = _.find(
      allTemplateVersions.value,
      (item) => item.template.id === templateID
    );
    if (isVisited && isOnSelect) {
      return;
    }
    templateVersionToken?.cancel?.();
    templateVersionToken = createAxiosToken();
    try {
      const isProjectTemplate = _.find(templateList.value, (item) => {
        return item.id === templateID && item.project?.id;
      });
      const params = {
        templateID,
        isProjectTemplate: !!isProjectTemplate
      };
      const { data } = await queryItemTemplatesVersions(
        params,
        templateVersionToken.token
      );
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
        includeInherited: true
      };
      const { data } = await queryVariables(params);
      variableList.value = data.items || [];
    } catch (error) {
      variableList.value = [];
    }
  };
  const getServiceTemplateVersionMap = () => {
    let services = serviceDataList.value;
    if (id) {
      services = _.filter(serviceDataList.value, (item) => {
        return item.id !== id;
      });
    }
    const list = _.map(services, (item) => {
      return {
        name: item.name,
        type: item.template.name,
        version: item.template.version
      };
    });
    return list;
  };

  const getServiceList = async () => {
    serviceToken?.cancel?.();
    serviceToken = createAxiosToken();
    try {
      const params = {
        page: -1,
        withSchema: true,
        extract: ['-projectId', '-status']
      };
      const { data } = await queryServices(params, serviceToken.token);
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

  const initCompleteData = async () => {
    loading.value = true;
    await Promise.all([getServiceList(), getProjectVariables()]);
    setCompleteData();
    loading.value = false;
  };
  onBeforeUnmount(() => {
    serviceToken?.cancel?.();
    templateToken?.cancel?.();
    templateVersionToken?.cancel?.();
  });
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
