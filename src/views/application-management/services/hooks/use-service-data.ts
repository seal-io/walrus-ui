import _ from 'lodash';
import { ref, reactive, ComponentPublicInstance, computed } from 'vue';
import { PageAction } from '@/views/config';
import useCallCommon from '@/hooks/use-call-common';
import { TemplateVersionData } from '@/views/operation-hub/templates/config/interface';
import usePageAction from '@/hooks/use-page-action';
import { useServiceStore } from '@/store';
import semverEq from 'semver/functions/eq';
import semverGt from 'semver/functions/gt';

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
    getTemplateVersionByItem,
    getTemplates,
    serviceDataList,
    templateList,
    completeDataLoading,
    allTemplateVersions
  } = useCompleteData();
  const serviceStore = useServiceStore();
  const { pageAction, handleEdit } = usePageAction();
  const defaultGroupKey = '_default_default_';
  const { route } = useCallCommon();
  const refMap = ref<Record<string, refItem>>({});
  const templateInfo = ref<any>({});
  const serviceInfo = ref<any>({}); // Store information about the active service, also be used when cloning
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
    description: '',
    labels: {},
    name: '',
    template: { name: '', version: '', id: '' },
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
    } else if (type === PageAction.EDIT) {
      sourceData = {
        attributes: {
          ..._.cloneDeep(_.get(serviceInfo.value, 'attributes'))
        }
      };
    }

    const variablesList = _.filter(
      _.get(templateInfo.value, 'variables'),
      (v) => !v.hidden
    );
    _.each(variablesList, (item) => {
      const initialValue = getInitialValue(item, sourceData, type);
      // filter empty group name
      const groups: string[] = _.filter(
        _.split(item.group, /\/+/) || [],
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
  const getTemplateSchemaByName = () => {
    const moduleTemplate = _.find(
      templateVersionList.value,
      (item) => item.template.name === formData.template.name
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
        (item) => item.template.name === formData.template.name
      );
      let versions = _.map(list, (item) => {
        return {
          ..._.cloneDeep(item),
          label: item.version,
          value: item.version
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
      });
    } catch (error) {
      // ignore
    }
  };

  const setFormAttributes = async () => {
    _.assignIn(formData, serviceInfo.value);
    // 1. get the template meta data 2.set the default value
    await getTemplateVersionByItem(formData.template.name);
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
  };
  // for service create page
  const initFormData = async () => {
    if (id) {
      await setFormAttributes();
    } else {
      // webservice bydefault
      const webservice = _.find(templateList.value, (item) =>
        setDefaultTemplate(item)
      );
      formData.template.name = webservice
        ? webservice.name
        : _.get(templateList.value, '0.name') || '';
      await getTemplateVersionByItem(formData.template.name);
      await getTemplateVersionList();

      const moduleTemplate = getTemplateSchemaByName();
      formData.template.version = _.get(moduleTemplate, 'version') || '';
      templateInfo.value = _.cloneDeep(_.get(moduleTemplate, 'schema')) || {};
    }
    generateVariablesGroup(pageAction.value);
  };
  // for service detail
  const initInfo = async () => {
    asyncLoading.value = true;
    serviceInfo.value = serviceStore.getServiceInfo(id);
    await setFormAttributes();
    generateVariablesGroup(pageAction.value);
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
    getTemplateSchemaByName,
    getTemplateSchemaByVersion,
    getTemplateVersionList,
    getTemplateVersionByItem,
    initCompleteData,
    initInfo,
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
