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

export default function useTemplatesData() {
  const moduleTemplates = ref<TemplateRowData[]>([]);
  const allModuleVersions = ref<ModuleVersionData[]>([]);
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
      moduleTemplates.value = data?.items || [];
    } catch (error) {
      moduleTemplates.value = [];
      console.log(error);
    }
  };

  // apply for edit module config
  const getModulesVersions = async () => {
    try {
      const params = {
        moduleID: _.uniq(
          _.map(moduleTemplates.value, (item) => {
            return item.id;
          })
        )
      };
      if (!params.moduleID.length) {
        return;
      }
      const { data } = await queryModulesAllVersions(params);
      allModuleVersions.value = data?.items || [];
      console.log('allModuleVersions======', allModuleVersions.value);
    } catch (error) {
      allModuleVersions.value = [];
      console.log(error);
    }
  };
  const getServiceList = async () => {};
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
    const services = _.reduce(
      serviceDataList.value,
      (obj, item) => {
        obj[item.name] = '';
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
        completeData.value.var = { ...variables };
      }
    };
    completeDataSetter?.updateServiceCompleteData?.();
    completeDataSetter?.updateVariablesCompleteData?.();
  };
  const initCompleteData = async () => {
    await Promise.all([getModules(), getServiceList()]);
    await getModulesVersions();
    setCompleteData();
  };
  return {
    initCompleteData,
    completeData,
    moduleTemplates,
    allModuleVersions,
    serviceDataList,
    completeDataSetter
  };
}
