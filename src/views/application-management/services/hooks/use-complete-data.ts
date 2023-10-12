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
import { initFormState } from '@/components/dynamic-form/utils/init-form-state';
import { queryServices } from '@/views/application-management/services/api';
import useCallCommon from '@/hooks/use-call-common';
import { queryVariables } from '../../variables/api';

export default function useCompleteData(props?) {
  interface HintKey {
    service: any;
    var: any;
  }
  interface TemplateVersionItem {
    schema?: {
      outputs: any[];
    };
    template: {
      id: string;
      name: string;
      version: string;
      template: {
        id: string;
      };
    };
  }
  const { route } = useCallCommon();
  const id = route.query.id || '';
  const loading = ref(false);
  const templateList = ref<TemplateRowData[]>([]);
  const allTemplateVersions = ref<TemplateVersionItem[]>([]);
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
  const getTemplateVersions = async (
    formTemplateData,
    isOnSelect?: boolean
  ) => {
    const templateID = formTemplateData.template?.id;
    const isVisited = _.find(
      allTemplateVersions.value,
      (item) => item.template.template.id === templateID
    );
    if (isVisited && isOnSelect) {
      return;
    }
    templateVersionToken?.cancel?.();
    templateVersionToken = createAxiosToken();
    try {
      const isProjectTemplate = formTemplateData.project?.id;
      const params = {
        templateID,
        isProjectTemplate: !!isProjectTemplate,
        extract: ['-schema', '-uiSchema']
      };
      const { data } = await queryItemTemplatesVersions(
        params,
        templateVersionToken.token
      );
      const list = _.map(data?.items || [], (item) => {
        return {
          template: {
            ..._.pick(item, ['id', 'name', 'version']),
            template: item.template
          }
        };
      });
      allTemplateVersions.value = _.concat(allTemplateVersions.value, list);
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
        templateId: item.template.id,
        versionId: item.template.template.id,
        version: item.template.version
      };
    });
    return list;
  };

  const parseSchemaOutputs = (schema) => {
    const result = initFormState(
      _.get(schema, 'openAPISchema.components.schemas.outputs') || {}
    );
    return result.fieldSchemaList.map((item) => {
      return {
        name: item.name,
        description: item.description
      };
    });
  };
  /**
   * Description
   * @returns {any}
   * params.flow: used for workflow create service step
   */
  const getServiceList = async () => {
    serviceToken?.cancel?.();
    serviceToken = createAxiosToken();
    try {
      const params = {
        page: -1,
        withSchema: true,
        extract: ['-projectId', '-status', '-schema', '-uiSchema'],
        flow: undefined
      };
      params.flow = props?.flow || undefined;
      const { data } = await queryServices(params, serviceToken.token);
      serviceDataList.value = data.items || [];
      allTemplateVersions.value = _.map(data?.items || [], (item) => {
        const { template } = cloneDeep(item);
        return {
          schema: {
            outputs: parseSchemaOutputs(template.schema)
          },
          template: {
            ..._.omit(template, ['schema', 'uiSchema'])
          }
        };
      }) as any[];
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
            return (
              s.template.id === item.templateId &&
              s.template.version === item.version
            );
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
    getTemplateVersions,
    completeData,
    templateList,
    allTemplateVersions,
    serviceDataList,
    completeDataLoading: loading
  };
}
