import _ from 'lodash';
import { ref, reactive, ComponentPublicInstance, computed } from 'vue';
import { PageAction } from '@/views/config';
import useCallCommon from '@/hooks/use-call-common';
import {
  TemplateRowData,
  TemplateVersionData
} from '@/views/operation-hub/templates/config/interface';
import usePageAction from '@/hooks/use-page-action';

import { queryItemApplicationService } from '../api';
import useTemplatesData from './use-templates-data';

export default function useServiceData(props?) {
  type refItem = Element | ComponentPublicInstance | null;
  interface TemplateVersion extends TemplateVersionData {
    label: string;
    value: string;
  }
  const {
    completeData,
    initCompleteData,
    getTemplatesVersions,
    serviceDataList,
    templateList,
    allTemplateVersions
  } = useTemplatesData();
  const { pageAction, handleEdit } = usePageAction();
  const defaultGroupKey = '_default_default_';
  const { route, router, t } = useCallCommon();
  const refMap = ref<Record<string, refItem>>({});
  const templateInfo = ref<any>({});
  const serviceInfo = ref<any>({});
  const variablesGroup = ref<any>({});
  const variablesGroupForm = ref<any>({});
  const templateVersionList = ref<TemplateVersion[]>([]);
  const templateVersionFormCache = ref({});
  const asyncLoading = ref(false);

  const id = route.query.id as string;
  const formData = reactive({
    projectID: route.params.projectId,
    project: {
      id: route.params.projectId
    },
    environment: {
      id: route.params.environmentId
    },
    name: '',
    template: { id: '', version: '' },
    attributes: {}
  });

  const title = computed(() => {
    if (!id) {
      return t('applications.applications.create');
    }
    if (id && pageAction.value === PageAction.EDIT) {
      return t('applications.applications.edit');
    }
    return t('applications.applications.detail');
  });

  const getServiceItemInfo = async () => {
    // create
    if (!route.query.id) return;
    try {
      const params = {
        id: route.query.id,
        environmentID: route.params.environmentId,
        projectID: route.params.projectId
      };
      const { data } = await queryItemApplicationService(params);
      serviceInfo.value = data;
    } catch (error) {
      serviceInfo.value = {};
      console.log(error);
    }
  };

  const getInitialValue = (item, sourceData, action) => {
    let initialValue = item.default;
    if (
      _.get(templateVersionFormCache.value, formData.template.version) ||
      action === PageAction.EDIT
    ) {
      initialValue = _.get(sourceData, `attributes.${item.name}`);
    }
    return initialValue;
  };
  // get set: edit create
  const generateVariablesGroup = (type) => {
    refMap.value = {};
    variablesGroup.value = {};
    variablesGroupForm.value = {};
    const sourceData = {
      attributes: {
        ..._.cloneDeep(_.get(serviceInfo.value, 'attributes')),
        ..._.get(templateVersionFormCache.value, formData.template.version)
      }
    };
    const variablesList = _.filter(
      _.get(templateInfo.value, 'variables'),
      (v) => !v.hidden
    );
    _.each(variablesList, (item) => {
      const initialValue = getInitialValue(item, sourceData, type);
      const group = _.get(_.split(item.group, '/'), '0');
      if (group) {
        if (!variablesGroup.value[group]) {
          variablesGroup.value[group] = {
            variables: [],
            label: group
          };
          variablesGroup.value[group].variables.push(item);
        } else {
          variablesGroup.value[group].variables.push(item);
        }

        _.set(
          variablesGroupForm.value,
          `${group}.attributes.${item.name}`,
          initialValue
        );
      } else {
        if (!variablesGroup.value[defaultGroupKey]) {
          variablesGroup.value[defaultGroupKey] = {
            variables: [],
            label: 'Basic'
          };
        }
        variablesGroup.value[defaultGroupKey].variables.push(item);
        _.set(
          variablesGroupForm.value,
          `${defaultGroupKey}.attributes.${item.name}`,
          initialValue
        );
      }
    });
  };

  //  change module ...
  const getTemplateSchemaById = () => {
    const moduleTemplate = _.find(
      templateVersionList.value,
      (item) => item.template.id === formData.template.id
    );
    return moduleTemplate;
  };
  // change version ...
  const getTemplateSchemaByVersion = () => {
    console.log('templateVersionList===', formData, templateVersionList.value);
    const moduleTemplate = _.find(
      templateVersionList.value,
      (item) => item.value === formData.template.version
    );
    return moduleTemplate;
  };
  const getTemplateVersionList = async () => {
    try {
      const list = _.filter(
        allTemplateVersions.value,
        (item) => item.template.id === formData.template.id
      );
      templateVersionList.value = _.map(list, (item) => {
        return {
          ..._.cloneDeep(item),
          label: item.version,
          value: item.version
        };
      });
    } catch (error) {
      console.log(error);
    }
  };

  const initFormData = async () => {
    if (!id) {
      // webservice
      const webservice = _.find(
        templateList.value,
        (item) => item.id === 'webservice'
      );
      formData.template.id = webservice
        ? webservice.id
        : _.get(templateList.value, '0.id') || '';
      await getTemplatesVersions(formData.template.id);
      await getTemplateVersionList();
      const moduleTemplate = getTemplateSchemaById();
      formData.template.version = _.get(moduleTemplate, 'version') || '';
      templateInfo.value = _.cloneDeep(_.get(moduleTemplate, 'schema')) || {};
    } else {
      _.assignIn(formData, serviceInfo.value);
      // 1. get the template meta data 2.set the default value
      await getTemplatesVersions(formData.template.id);
      await getTemplateVersionList();
      const moduleTemplate = getTemplateSchemaByVersion();
      templateInfo.value = _.cloneDeep(_.get(moduleTemplate, 'schema'));
      const variablesList = _.filter(
        _.get(templateInfo.value, 'variables'),
        (v) => !v.hidden
      );
      _.each(variablesList || [], (item) => {
        item.default = _.get(serviceInfo.value, `attributes.${item.name}`);
      });
    }

    generateVariablesGroup(pageAction.value);
  };

  const init = async () => {
    asyncLoading.value = true;
    await Promise.all([getServiceItemInfo(), initCompleteData()]);
    await initFormData();
    asyncLoading.value = false;
  };
  return {
    id,
    init,
    generateVariablesGroup,
    getTemplateSchemaById,
    getTemplateSchemaByVersion,
    getTemplateVersionList,
    getTemplatesVersions,
    asyncLoading,
    formData,
    refMap,
    pageAction,
    handleEdit,
    defaultGroupKey,
    templateInfo,
    serviceInfo,
    variablesGroup,
    variablesGroupForm,
    templateVersionList,
    templateVersionFormCache,
    serviceDataList,
    templateList,
    completeData,
    title
  };
}
