import _ from 'lodash';
import {
  ref,
  reactive,
  ComponentPublicInstance,
  computed,
  provide,
  nextTick
} from 'vue';
import useCallCommon from '@/hooks/use-call-common';
import {
  TemplateRowData,
  TemplateVersionData
} from '@/views/operation-hub/templates/config/interface';
import usePageAction from '@/hooks/use-page-action';
import useProjectBreadcrumbData from '../../projects/hooks/use-project-breadcrumb-data';

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
    completeDataSetter,
    serviceDataList,
    templateList,
    allTemplateVersions
  } = useTemplatesData();
  const { breadCrumbList, setBreabCrumbData } = useProjectBreadcrumbData();
  const { pageAction, handleEdit } = usePageAction();
  const defaultGroupKey = '_default_default_';
  const { route, router, t } = useCallCommon();
  let refMap: Record<string, refItem> = {};
  const templateInfo = ref<any>({});
  const serviceInfo = ref<any>({});
  const variablesGroup = ref<any>({});
  const variablesGroupForm = ref<any>({});
  const templateVersionList = ref<TemplateVersion[]>([]);
  const templateVersionFormCache = ref({});

  const id = route.query.id as string;
  const formData = reactive({
    projectID: route.params.projectId,
    environment: {
      id: route.params.environmentId
    },
    name: '',
    template: { id: '', version: '' },
    application: {
      id: route.query.id || ''
    },
    attributes: {}
  });

  const title = computed(() => {
    if (!id) {
      return t('applications.applications.create');
    }
    if (id && pageAction.value === 'edit') {
      return t('applications.applications.edit');
    }
    return t('applications.applications.detail');
  });

  const getServiceItemInfo = async () => {
    if (!route.query.id) return;
    try {
      const params = {
        id: route.query.id,
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
      action === 'edit'
    ) {
      initialValue = _.get(sourceData, `attributes.${item.name}`);
    }
    return initialValue;
  };
  // get set: edit create
  const generateVariablesGroup = (type) => {
    refMap = {};
    variablesGroup.value = {};
    variablesGroupForm.value = {};
    const sourceData = {
      attributes: {
        ..._.cloneDeep(_.get(serviceInfo.value, 'attributes')),
        ..._.get(templateVersionFormCache.value, formData.template.version)
      }
    };
    console.log('sourceData===', sourceData);
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
    console.log(
      'variablesGroupForm===',
      variablesGroup.value,
      variablesGroupForm.value
    );
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
      await getTemplateVersionList();
      const moduleTemplate = getTemplateSchemaById();
      formData.template.version = _.get(moduleTemplate, 'version') || '';
      templateInfo.value = _.cloneDeep(_.get(moduleTemplate, 'schema')) || {};
    } else {
      _.assignIn(formData, serviceInfo.value);
      // 1. get the template meta data 2.set the default value
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
    console.log('moduleVersionList===', allTemplateVersions.value);
  };

  const init = async () => {
    await Promise.all([getServiceItemInfo(), initCompleteData()]);
    initFormData();
    setBreabCrumbData();
  };
  return {
    id,
    init,
    generateVariablesGroup,
    getTemplateSchemaById,
    getTemplateSchemaByVersion,
    getTemplateVersionList,
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
    title,
    breadCrumbList
  };
}
