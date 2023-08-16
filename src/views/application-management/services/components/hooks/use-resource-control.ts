import { onBeforeUnmount, ref } from 'vue';
import _ from 'lodash';
import {
  listenerCloseControlPanel,
  emitCloseControlPanel
} from '../../hooks/use-close-control-panel';
import { ResourceKey } from '../../config/interface';
import { getResourceKeyList } from '../../config/utils';

export default function useResourceControl() {
  const drawerType = {
    TERMINAL: 'terminal',
    LOGS: 'logs'
  };
  const resourceAction = {
    Executable: 'executable',
    Loggable: 'loggable'
  };
  const modalType = ref('terminal');
  const terminalShow = ref(false);
  const updateActive = ref('');
  const drawerTabs = ref<
    { dataList: ResourceKey[]; name: string; id: string; nodeInfo: object }[]
  >([]);

  listenerCloseControlPanel(() => {
    terminalShow.value = false;
    drawerTabs.value = [];
  });
  const handleConnectTerminal = (row) => {
    if (modalType.value === drawerType.LOGS) {
      modalType.value = drawerType.TERMINAL;
      drawerTabs.value = [];
      terminalShow.value = false;
    }
    drawerTabs.value.push({
      dataList: getResourceKeyList({ ...row }, resourceAction.Executable),
      name: row.name,
      id: row.id,
      nodeInfo: {}
    });
    updateActive.value = row.name;
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
      dataList: getResourceKeyList({ ...row }, resourceAction.Loggable),
      name: row.name,
      id: row.id,
      nodeInfo: {}
    });
    updateActive.value = row.name;
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
  onBeforeUnmount(() => {
    emitCloseControlPanel();
  });
  return {
    modalType,
    terminalShow,
    drawerTabs,
    updateActive,
    handleConnectTerminal,
    handleViewLogs,
    handleTerminalDelete
  };
}
