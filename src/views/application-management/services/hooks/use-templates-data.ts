import _ from 'lodash';
import { ref } from 'vue';
import {
  TemplateRowData,
  TemplateVersionData
} from '@/views/operation-hub/templates/config/interface';
import {
  queryTemplates,
  queryTemplatesAllVersions
} from '@/views/operation-hub/templates/api';
import useCallCommon from '@/hooks/use-call-common';
import {
  queryServices,
  queryVariables
} from '@/views/application-management/services/api';

export default function useTemplatesData() {
  interface HintKey {
    service: any;
    var: any;
  }
  const { route } = useCallCommon();
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
        page: -1
      };
      const { data } = await queryTemplates(params);
      templateList.value = data?.items || [];
    } catch (error) {
      templateList.value = [];
      console.log(error);
    }
  };

  // apply for edit service config
  const getTemplatesVersions = async (templateIDList) => {
    // templateIDList is a array only on create  life cycle
    const templateIDs = _.uniq(_.concat(templateIDList || []));
    if (
      !templateIDs.length ||
      _.every(templateIDs, (templateID) =>
        _.find(
          allTemplateVersions.value,
          (item) => item.template.id === templateID
        )
      )
    )
      return;

    try {
      const params = {
        templateID: templateIDs,
        page: -1
      };
      const { data } = await queryTemplatesAllVersions(params);
      allTemplateVersions.value = _.concat(
        allTemplateVersions.value,
        data?.items || []
      );
    } catch (error) {
      console.log(error);
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
      console.log(error);
    }
  };
  const getServiceTemplateVersionMap = () => {
    const list = _.map(serviceDataList.value, (item) => {
      return {
        name: item.name,
        type: item.template.id,
        version: item.template.version
      };
    });
    return list;
  };

  const getServiceList = async () => {
    try {
      const params = {
        page: -1,
        projectID: route.params.projectId as string,
        environmentID: route.params.environmentId,
        extract: []
      };
      const { data } = await queryServices(params);
      serviceDataList.value = data.items || [];
    } catch (error) {
      console.log(error);
      serviceDataList.value = [];
    }
  };
  const setVariablesCompleteData = () => {
    // const vars = _.reduce(
    //   variableList.value,
    //   (obj, item) => {
    //     obj[item.name] = '';
    //     return obj;
    //   },
    //   {}
    // );
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
            return item.type === s.template.id && s.version === item.version;
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
      return item.template.id;
    }).filter((templateID) => !!templateID);
    return list;
  };

  const initCompleteData = async () => {
    await Promise.all([
      getTemplates(),
      getServiceList(),
      getProjectVariables()
    ]);
    const serviceTemplates = getServiceTemplateVersions();
    await getTemplatesVersions(serviceTemplates);
    setCompleteData();
  };
  return {
    initCompleteData,
    getTemplatesVersions,
    getTemplates,
    completeData,
    templateList,
    allTemplateVersions,
    serviceDataList
  };
}
