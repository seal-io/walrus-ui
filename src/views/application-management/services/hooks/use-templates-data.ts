import _ from 'lodash';
import { ref } from 'vue';
import {
  TemplateRowData,
  ModuleVersionData
} from '@/views/operation-hub/templates/config/interface';
import {
  queryModules,
  queryModulesAllVersions
} from '@/views/operation-hub/templates/api';
import useCallCommon from '@/hooks/use-call-common';
import {
  queryApplications,
  querySecrets
} from '@/views/application-management/services/api';

export default function useTemplatesData() {
  const { route } = useCallCommon();
  const templateList = ref<TemplateRowData[]>([]);
  const allTemplateVersions = ref<ModuleVersionData[]>([]);
  const completeData = ref<Record<string, any>>({});
  const variableList = ref<any[]>([]);
  const serviceDataList = ref<any[]>([]);
  let completeDataSetter: any = null;

  // modules options
  const getModules = async () => {
    try {
      const params = {
        page: -1
      };
      const { data } = await queryModules(params);
      templateList.value = data?.items || [];
    } catch (error) {
      templateList.value = [];
      console.log(error);
    }
  };

  // apply for edit service config
  const getTemplatesVersions = async () => {
    try {
      const params = {
        templateID: _.uniq(
          _.map(templateList.value, (item) => {
            return item.id;
          })
        )
      };
      if (!params.templateID.length) {
        return;
      }
      const { data } = await queryModulesAllVersions(params);
      allTemplateVersions.value = data?.items || [];
    } catch (error) {
      allTemplateVersions.value = [];
      console.log(error);
    }
  };
  const getProjectSecrets = async () => {
    try {
      const params = {
        page: -1,
        projectID: route.params.projectId as string,
        withGlobal: true
      };
      const { data } = await querySecrets(params);
      variableList.value = data.items || [];
    } catch (error) {
      variableList.value = [];
      console.log(error);
    }
  };
  const getServiceTemplateVersionMap = () => {
    const list = _.map(serviceDataList.value, (item) => {
      return {
        name: item.name,
        type: item.template.id,
        version: item.version
      };
    });
    return list;
  };

  const getServiceList = async () => {
    try {
      const params = {
        page: -1,
        projectID: route.params.projectId as string,
        environmentID: route.params.environmentId
      };
      const { data } = await queryApplications(params);
      serviceDataList.value = data.items || [];
    } catch (error) {
      console.log(error);
      serviceDataList.value = [];
    }
  };
  const setVariablesCompleteData = () => {
    const vars = _.reduce(
      variableList.value,
      (obj, item) => {
        obj[item.name] = '';
        return obj;
      },
      {}
    );
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
            return item.type === s.template.id && s.version === item.version;
          }
        );
        const k = item.name;
        obj[k] = [
          ..._.map(_.get(addedServiceTemplate, 'schema.outputs') || [], (o) => {
            return {
              label: o.description,
              value: o.name
            };
          })
        ];
        return obj;
      },
      {}
    );
    return services;
  };
  const setCompleteData = () => {
    completeDataSetter = {
      updateServiceCompleteData() {
        const services = setServiceCompleteData();
        completeData.value.service = { ...services };
      },
      updateVariablesCompleteData() {
        const variables = setVariablesCompleteData();
        completeData.value.secret = { ...variables };
      }
    };
    completeDataSetter?.updateServiceCompleteData?.();
    completeDataSetter?.updateVariablesCompleteData?.();
  };
  const initCompleteData = async () => {
    await Promise.all([getModules(), getServiceList(), getProjectSecrets()]);
    await getTemplatesVersions();
    setCompleteData();
  };
  return {
    initCompleteData,
    completeData,
    templateList,
    allTemplateVersions,
    serviceDataList,
    completeDataSetter
  };
}
