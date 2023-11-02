import _ from 'lodash';
import { ref, reactive, ComponentPublicInstance, computed } from 'vue';
import { PageAction } from '@/views/config';
import { createAxiosToken } from '@/api/axios-chunk-request';
import useCallCommon from '@/hooks/use-call-common';
import { TemplateVersionData } from '@/views/operation-hub/templates/config/interface';
import { queryItemTemplatesVersions } from '@/views/operation-hub/templates/api';
import { initFormState } from '@/components/dynamic-form/utils/init-form-state';
import usePageAction from '@/hooks/use-page-action';
import { useServiceStore } from '@/store';
import semverEq from 'semver/functions/eq';
import semverGt from 'semver/functions/gt';

import { ServiceFormData } from '../config/interface';
import { queryItemService } from '../api';
import useCompleteData from './use-complete-data';

export default function useServiceData(props?) {
  type refItem = Element | ComponentPublicInstance | null;
  interface TemplateVersion extends TemplateVersionData {
    label: string;
    value: string;
  }
  /**
   * Service configuration can refer to output of other services,
   * so it is necessary to obtain the schema of existing services
   */
  const {
    completeData,
    initCompleteData,
    getTemplateVersions,
    getTemplates,
    serviceDataList,
    templateList,
    completeDataLoading,
    allTemplateVersions
  } = useCompleteData();
  const serviceStore = useServiceStore();
  const { pageAction, handleEdit } = usePageAction();
  const defaultGroupKey = '_default_default_';
  const defaultGroupLabel = 'Basic';
  const { route } = useCallCommon();
  const refMap = ref<Record<string, any>>({});
  const templateInfo = ref<any>({});
  const serviceInfo = ref<any>({}); // Store information about the active service, also be used when cloning
  const variablesGroup = ref<any>({});
  const variablesGroupForm = ref<any>({});
  const templateVersionList = ref<TemplateVersion[]>([]);
  const templateVersionFormCache = ref({});
  const asyncLoading = ref(false);
  let templateVersionSchemaToken: any = null;

  const id = route.query.id as string;
  const formData: ServiceFormData = reactive({
    projectID: route.params.projectId as string,
    project: {
      id: route.params.projectId as string
    },
    environment: {
      id: route.params.environmentId as string
    },
    description: '',
    labels: {},
    name: '',
    template: {
      // template version info
      name: '',
      version: '',
      id: '',
      project: { id: route.params.projectId as string },
      // template info
      template: { id: '' }
    },
    attributes: {}
  });

  const title = () => {
    if (!id) {
      return 'applications.applications.create';
    }
    if (id && pageAction.value === PageAction.EDIT) {
      return 'applications.applications.edit';
    }
    return 'applications.applications.detail';
  };

  const setDefaultTemplate = (template) => {
    return template.name === 'webservice';
  };
  const getServiceItemInfo = async () => {
    // create
    if (!route.query.id) return;
    try {
      const params = {
        id: route.query.id
      };
      const { data } = await queryItemService(params);
      serviceInfo.value = data;
    } catch (error) {
      serviceInfo.value = {};
    }
  };
  const setRefMap = (el: refItem, name) => {
    if (el) {
      refMap.value[`${name}`] = el;
    }
  };
  const getInitialValue = (item, sourceData) => {
    return _.get(sourceData, ['attributes', ...item.fieldPath]) || item.default;
  };
  // get: set, edit: create
  const generateVariablesGroup = (type) => {
    refMap.value = {};
    variablesGroup.value = {};
    variablesGroupForm.value = {};
    let sourceData = {
      attributes: {}
    };

    if (_.get(templateVersionFormCache.value, formData.template.version)) {
      sourceData = {
        attributes: {
          ..._.cloneDeep(
            _.get(templateVersionFormCache.value, formData.template.version)
          )
        }
      };
    } else if (type === PageAction.EDIT && id) {
      sourceData = {
        attributes: {
          ..._.cloneDeep(_.get(serviceInfo.value, 'attributes'))
        }
      };
    }

    // const variablesList = _.filter(
    //   _.get(templateInfo.value, 'variables'),
    //   (v) => !v.hidden
    // );
    const variablesList = _.filter(
      templateInfo.value,
      (v) => !v.uiSchema.hidden
    );
    _.each(variablesList, (item) => {
      const initialValue = getInitialValue(item, sourceData);
      item.default = initialValue;
      // filter empty group name
      const groups: string[] = _.filter(
        _.split(item.uiSchema.group, /\/+/) || [],
        (g) => !!g
      );
      const group = _.get(groups, '0');
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
          [group, 'attributes', ...item.fieldPath],
          initialValue
        );
      } else {
        if (!variablesGroup.value[defaultGroupKey]) {
          variablesGroup.value[defaultGroupKey] = {
            variables: [],
            label: defaultGroupLabel
          };
        }
        variablesGroup.value[defaultGroupKey].variables.push(item);
        _.set(
          variablesGroupForm.value,
          [defaultGroupKey, 'attributes', ...item.fieldPath],
          initialValue
        );
      }
    });
  };

  //  change module ...
  const setFormTemplateVersion = () => {
    const moduleTemplate = _.find(
      templateVersionList.value,
      (item) => item.template.template?.id === formData.template.template.id
    );
    formData.template.version = _.get(moduleTemplate, 'template.version') || '';
    formData.template.id = _.get(moduleTemplate, 'template.id') || '';
    return moduleTemplate;
  };

  // change version ...
  const getTemplateSchemaByVersion = async () => {
    templateVersionSchemaToken?.cancel();
    templateVersionSchemaToken = createAxiosToken();
    try {
      const params = {
        templateID: formData.template.template.id,
        isProjectTemplate: !!formData.template.project?.id,
        query: formData.template.version
      };
      const { data } = await queryItemTemplatesVersions(
        params,
        templateVersionSchemaToken.token
      );
      return data?.items?.[0];
    } catch (error) {
      // ignore
      return {};
    }
    // const moduleTemplate = _.find(
    //   templateVersionList.value,
    //   (item) => item.value === formData.template.version
    // );
    // return moduleTemplate;
  };

  const setTemplateVersionList = async () => {
    try {
      const list = _.filter(
        allTemplateVersions.value,
        (item) => item.template.template.id === formData.template.template.id
      );
      let versions = _.map(list, (item) => {
        return {
          ..._.cloneDeep(item),
          label: item.template.version,
          value: item.template.version
        };
      });
      versions = _.uniqBy(versions, 'value');
      templateVersionList.value = versions.sort((v1, v2) => {
        if (semverEq(v1.value, v2.value)) {
          return 0;
        }
        if (semverGt(v1.value, v2.value)) {
          return -1;
        }
        return 1;
      }) as TemplateVersion[];
    } catch (error) {
      // ignore
    }
  };

  const setTemplateInfo = (moduleData) => {
    const variables =
      _.cloneDeep(
        _.get(moduleData, 'customizeOpenAPISchema.components.schemas.variables')
      ) || {};
    const result = initFormState(variables);
    templateInfo.value = result.fieldSchemaList;
  };

  const setFormAttributes = async () => {
    _.assignIn(formData, serviceInfo.value);
    // 1. get the template meta data 2.set the default value
    await getTemplateVersions(formData.template);
    await setTemplateVersionList();
    const moduleTemplate = await getTemplateSchemaByVersion();
    // templateInfo.value = _.cloneDeep(_.get(moduleTemplate, 'schema'));

    // const variablesList = _.filter(
    //   _.get(templateInfo.value, 'variables'),
    //   (v) => !v.hidden
    // );
    setTemplateInfo(moduleTemplate);
    const variablesList = _.filter(
      templateInfo.value,
      (v) => !v.uiSchema.hidden
    );
    _.each(variablesList || [], (item) => {
      item.default = _.get(serviceInfo.value, [
        'attributes',
        ...item.fieldPath
      ]);
    });
  };
  const setFormDataTemplate = () => {
    // webservice bydefault
    let defaultTemplate = _.find(templateList.value, (item) =>
      setDefaultTemplate(item)
    );
    defaultTemplate = defaultTemplate || _.get(templateList.value, '0');
    formData.template.name = defaultTemplate.name;
    formData.template.template.id = defaultTemplate.id;
    formData.template.project = defaultTemplate.project || {};
  };
  // for service create page
  const initFormData = async () => {
    if (id) {
      await setFormAttributes();
    } else {
      setFormDataTemplate();
      await getTemplateVersions(formData.template);
      await setTemplateVersionList();
      setFormTemplateVersion();
      const templateSchema = await getTemplateSchemaByVersion();
      setTemplateInfo(templateSchema);
    }
    // generateVariablesGroup(pageAction.value);
  };
  // for service detail
  const initInfo = async () => {
    asyncLoading.value = true;
    serviceInfo.value = serviceStore.getServiceInfo(id);
    await setFormAttributes();
    // generateVariablesGroup(pageAction.value);
    asyncLoading.value = false;
  };

  // for service edit page
  const init = async () => {
    asyncLoading.value = true;
    // getServiceItemInfo would be called in create page
    await Promise.all([getServiceItemInfo(), getTemplates()]);
    await initFormData();
    asyncLoading.value = false;

    /* beacuse of the init versions data do not include the all template versions,
     * but only the created service versions
     */
    await initCompleteData();
    allTemplateVersions.value = [];
  };

  return {
    id,
    init,
    generateVariablesGroup,
    setFormAttributes,
    setFormTemplateVersion,
    getTemplateSchemaByVersion,
    setTemplateVersionList,
    getTemplateVersions,
    initCompleteData,
    initInfo,
    setTemplateInfo,
    asyncLoading,
    completeDataLoading,
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
    setRefMap
  };
}
