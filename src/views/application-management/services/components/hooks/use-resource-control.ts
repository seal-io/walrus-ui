import { ref } from 'vue';
import _ from 'lodash';
import { ResourceKey } from '../../config/interface';
import { getResourceKeyList } from '../../config/utils';

export default function useResourceControl() {
  const drawerType = {
    TERMINAL: 'terminal',
    LOGS: 'logs'
  };
  const modalType = ref('terminal');
  const terminalShow = ref(false);
  const drawerTabs = ref<
    { dataList: ResourceKey[]; name: string; id: string }[]
  >([]);

  const handleConnectTerminal = (row) => {
    if (modalType.value === drawerType.LOGS) {
      modalType.value = drawerType.TERMINAL;
      drawerTabs.value = [];
      terminalShow.value = false;
    }
    drawerTabs.value.push({
      dataList: getResourceKeyList({ ...row }, 'executable'),
      name: row.name,
      id: row.id
    });
    drawerTabs.value = _.uniqBy(drawerTabs.value, 'id');
    setTimeout(() => {
      terminalShow.value = true;
    }, 100);
  };
  const handleViewLogs = (row) => {
    if (modalType.value === drawerType.TERMINAL) {
      modalType.value = drawerType.LOGS;
      drawerTabs.value = [];
      terminalShow.value = false;
    }
    drawerTabs.value.push({
      dataList: getResourceKeyList({ ...row }, 'executable'),
      name: row.name,
      id: row.id
    });
    drawerTabs.value = _.uniqBy(drawerTabs.value, 'id');
    setTimeout(() => {
      terminalShow.value = true;
    }, 100);
  };
  const handleTerminalDelete = (key) => {
    const index = _.findIndex(drawerTabs.value, (item) => item.name === key);
    drawerTabs.value.splice(index, 1);
    if (!drawerTabs.value.length) {
      terminalShow.value = false;
    }
  };
  return {
    modalType,
    terminalShow,
    drawerTabs,
    handleConnectTerminal,
    handleViewLogs,
    handleTerminalDelete
  };
}
