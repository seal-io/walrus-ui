import _, { cloneDeep } from 'lodash';
import { ref, onBeforeUnmount, computed, inject, watch } from 'vue';
import { TemplateRowData } from '@/views/operation-hub/templates/config/interface';
import { createAxiosToken } from '@/api/axios-chunk-request';
import {
  queryTemplates,
  queryItemTemplatesVersions
} from '@/views/operation-hub/templates/api';
import { queryServices } from '@/views/application-management/services/api';
import { queryEnvironmentAvailableDefinitions } from '@/views/application-management/environments/api';
import useCallCommon from '@/hooks/use-call-common';
import { queryResourceDefinitions } from '@/views/operation-hub/resource-definitions/api';
import { HintKey } from '@/views/config/interface';
import { HintKeyMaps } from '@/views/config';
import { queryVariables, queryEnvironmentVariables } from '../../variables/api';
import { ServiceDataType, ProvideSetServiceInfoKey } from '../config';

export default function useCompleteData(props?) {
  interface TemplateVersionItem {
    schema?: {
      outputs: any[];
    };
    type?: string;
    template: {
      id: string;
      name: string;
      version: string;
      template: {
        id: string;
      };
    };
  }
  interface TemplateListItem extends TemplateRowData {
    label: string;
    value: string;
  }
  const { route } = useCallCommon();
  const id = route.query.id || '';
  const loading = ref(false);
  const templateList = ref<TemplateListItem[]>([]);
  const allTemplateVersions = ref<TemplateVersionItem[]>([]);
  const resourceDefinitionSchemaMap = ref<any>({});
  const completeData = ref<Partial<HintKey>>({
    [HintKeyMaps.resource]: null,
    [HintKeyMaps.var]: null
  });
  const variableList = ref<any[]>([]);
  const serviceDataList = ref<any[]>([]);
  let templateVersionToken: any = null;
  let templateToken: any = null;
  let serviceToken: any = null;

  const dataType = computed(() => {
    return props?.value.resourceType;
  });

  const getAllResourceDefinitions = async () => {
    try {
      const params = {
        page: -1
      };
      const { data } = await queryResourceDefinitions(params);
      resourceDefinitionSchemaMap.value = _.reduce(
        data?.items || [],
        (obj, item) => {
          obj[item.type] = item.schema;
          return obj;
        },
        {}
      );
    } catch (error) {
      console.log(error);
    }
  };
  // template options
  const getTemplates = async () => {
    templateToken?.cancel?.();
    templateToken = createAxiosToken();
    try {
      const params = {
        page: -1,
        withGlobal: true,
        sort: ['-name'],
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

  const getResourceDefinitions = async () => {
    try {
      const environmentID =
        route.params.environmentId || props?.value?.flow?.environmentId;
      const { data } = await queryEnvironmentAvailableDefinitions({
        environmentID,
        sort: ['-type']
      });
      templateList.value = _.map(data || [], (item) => {
        return {
          ...item,
          label: item.type,
          value: item.type
        };
      });
    } catch (error) {
      templateList.value = [];
      // console.log(error)
    }
  };

  const initTemplateList = async () => {
    if (dataType.value === ServiceDataType.resource) {
      await getResourceDefinitions();
    } else {
      await getTemplates();
    }
  };
  // get item template version, isOnSelect is a flag for select event
  const getTemplateVersions = async (
    formTemplateData,
    isOnSelect?: boolean
  ) => {
    if (
      dataType.value === ServiceDataType.resource ||
      !formTemplateData?.template?.id
    ) {
      return;
    }
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

  // optional args includeInherited, default is true
  const getProjectVariables = async () => {
    try {
      const params = {
        page: -1,
        includeInherited: true
      };

      if (props?.value?.flow?.projectId) {
        const { data } = await queryEnvironmentVariables({
          ...params,
          projectID: props.value?.flow?.projectId,
          environmentID: props.value?.flow?.environmentId
        });
        variableList.value = data.items || [];
      } else {
        const { data } = await queryVariables(params);
        variableList.value = data.items || [];
      }
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
        type: item.type,
        isService: !item.type,
        templateId: item.template?.id,
        versionId: item.template?.template?.id,
        version: item.template?.version
      };
    });
    return list;
  };

  const parseSchemaOutputs = (schema) => {
    const outputs = _.get(
      schema,
      'openAPISchema.components.schemas.outputs.properties',
      {}
    );
    const result: any[] = [];
    _.each(_.keys(outputs), (key) => {
      const item = outputs[key];
      result.push({
        name: key,
        description: item.description
      });
    });
    return result;
  };
  const setAllTemplateVersions = (list) => {
    allTemplateVersions.value = _.map(list || [], (item) => {
      if (item.type) {
        // resource
        return {
          schema: {
            outputs: parseSchemaOutputs(
              _.get(resourceDefinitionSchemaMap.value, item.type, {})
            )
          },
          type: item.type,
          template: {}
        };
      }
      // service
      const { template } = cloneDeep(item);
      return {
        schema: {
          outputs: parseSchemaOutputs(template?.schema)
        },
        template: {
          ..._.omit(template, ['schema', 'uiSchema'])
        }
      };
    }) as any[];
  };

  /**
   * Description
   * @returns {any}
   * params.flow: used for workflow create service step
   */
  const getServiceList = async (partialParams?) => {
    serviceToken?.cancel?.();
    serviceToken = createAxiosToken();
    try {
      const params = {
        page: -1,
        withSchema: true,
        extract: ['-projectId', '-status', '-schema', '-uiSchema'],
        ...partialParams,
        flow: undefined
      };
      params.flow = props?.value?.flow || undefined;
      const { data } = await queryServices(params, serviceToken.token);
      serviceDataList.value = data.items || [];
      setAllTemplateVersions(data.items || []);
      return cloneDeep(data.items || []);
    } catch (error) {
      serviceDataList.value = [];
      return [];
    }
  };
  const setVariablesCompleteData = () => {
    const vars = _.map(variableList.value, (item) => {
      return {
        value: item.name,
        label: item.name,
        tips: item.value,
        showTips: false,
        sensitive: item.sensitive
      };
    });
    return vars;
  };
  const genResourceCompleteData = (list) => {
    const resources = _.reduce(
      list,
      (obj, item) => {
        // The version corresponding to the module that has been added
        const addedServiceTemplate = _.find(
          allTemplateVersions.value || [],
          (s) => {
            return s.type === item.type;
          }
        );
        const k = item.name;
        obj[k] = [
          ..._.map(_.get(addedServiceTemplate, 'schema.outputs') || [], (o) => {
            return {
              value: o.name,
              label: o.name,
              isService: item.isService,
              description: ''
            };
          })
        ];
        return obj;
      },
      {}
    );
    return resources;
  };

  const genServiceCompleteData = (list) => {
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
              isService: item.isService,
              showTips: false,
              tips: o.description,
              description: ''
            };
          })
        ];
        return obj;
      },
      {}
    );
    return services;
  };
  const setServiceCompleteData = () => {
    const list = getServiceTemplateVersionMap();

    const serviceList = _.filter(list, (item) => {
      return item.isService;
    });
    const resourceList = _.filter(list, (item) => {
      return !item.isService;
    });

    const services = genServiceCompleteData(serviceList);
    const resources = genResourceCompleteData(resourceList);
    return {
      services,
      resources
    };
  };
  const updateServiceCompleteData = () => {
    const res = setServiceCompleteData();

    completeData.value[HintKeyMaps.resource] = {
      ...res.resources,
      ...res.services
    };
    // completeData.value[HintKeyMaps.service] = { ...res.services };
  };
  const updateVariablesCompleteData = () => {
    const variables = setVariablesCompleteData();
    completeData.value[HintKeyMaps.var] = [...variables];
  };
  const setCompleteData = () => {
    updateServiceCompleteData();
    updateVariablesCompleteData();
  };

  const initCompleteData = async () => {
    loading.value = true;
    await getAllResourceDefinitions();
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
    setCompleteData,
    updateServiceCompleteData,
    setAllTemplateVersions,
    resourceDefinitionSchemaMap,
    getServiceList,
    getAllResourceDefinitions,
    getProjectVariables,
    getTemplateVersions,
    initTemplateList,
    completeData,
    templateList,
    allTemplateVersions,
    serviceDataList,
    completeDataLoading: loading
  };
}
