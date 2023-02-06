import { ref, onMounted, h } from 'vue';
import { find, get, split, capitalize } from 'lodash';
import {
  getProjectManageMents,
  queryUserList,
  JiraItem,
} from '@/views/intergration/api/project-management';
import { Modal } from '@arco-design/web-vue';
import i18n from '@/locale/index';
import router from '@/router';

export function useJiraTicket() {
  const showTicket = ref(false);
  const projectName = ref('');
  const projectId = ref('');
  const violationId = ref('');
  const integrationId = ref('');
  const jiraSpace = ref('');
  const severity = ref('');
  const jiraIsPrivate = ref(false);
  const plateList = ref<JiraItem[]>([]);
  const getPlateList = async () => {
    try {
      const { data } = await getProjectManageMents();
      plateList.value = data.items || [];
    } catch (error) {
      console.log(error);
      plateList.value = [];
    }
  };
  const getJiraNamespace = (data) => {
    const url = get(data, 'url') || '';
    const type = get(data, 'type') || '';
    const address = get(split(url, '//'), '1') || '';
    jiraIsPrivate.value = ['private_oauth2', 'private_access_token'].includes(
      type
    );
    jiraSpace.value = jiraIsPrivate.value ? url : get(split(address, '.'), '0');
  };
  const getIntegrationId = (provider) => {
    const data = find(plateList.value, (item) => item.provider === provider);
    integrationId.value = get(data, 'id') || '';
    getJiraNamespace(data);
  };
  const handleToIntegration = () => {
    router.push({
      name: 'allIntegration',
    });
  };
  const handleCreateJiraTicket = (provider, row) => {
    console.log('row=======', row);
    getIntegrationId(provider);
    if (!jiraSpace.value) {
      const { t } = i18n.global;
      Modal.warning({
        alignCenter: false,
        top: '20%',
        title: t('projects.modal.integration.title') || '',
        okText: t('projects.modal.integration.oktext'),
        cancelText: t('common.button.cancel'),
        hideCancel: false,
        onOk: handleToIntegration,
        content: () =>
          h(
            'div',
            {
              style: 'text-align: center',
            },
            t('projects.modal.integration.content', {
              provider: capitalize(provider),
            })
          ),
      });
      return;
    }
    projectId.value = row.id;
    projectName.value = row.name;
    violationId.value = row.violationId;
    showTicket.value = true;
    severity.value = row.severity;
  };
  // onMounted(() => {
  //   getPlateList();
  // });
  // getPlateList();
  return {
    getPlateList,
    showTicket,
    projectName,
    projectId,
    violationId,
    integrationId,
    jiraSpace,
    jiraIsPrivate,
    severity,
    handleCreateJiraTicket,
  };
}

export default {};
