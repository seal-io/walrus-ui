import { computed, ref } from 'vue';
import { useCostManageStore } from '@/store';
import useCallCommon from '@/hooks/use-call-common';
import { find, toLower } from 'lodash';

export default function useSelectPerspective(props) {
  const perspectiveRouteMap = {
    all: 'costAnalyseAll',
    project: 'costAnalyseProject',
    cluster: 'costAnalyseCluster'
  };
  const { route, router } = useCallCommon();
  const costManagentStore = useCostManageStore();
  const perspectiveId = ref(route.query.id || props.viewId);
  const perspectiveList = computed(() => {
    return costManagentStore.perspectiveList || [];
  });
  const handlePerstiveChange = (val) => {
    const data = find(perspectiveList.value, (item) => item.id === val);
    perspectiveId.value = val;
    router.push({
      name: perspectiveRouteMap[toLower(data.name)],
      query: {
        id: val
      }
    });
  };
  const handlePerspectiveManage = () => {
    router.push({
      name: 'costAnalyseList'
    });
  };
  return {
    handlePerstiveChange,
    handlePerspectiveManage,
    perspectiveList,
    perspectiveId
  };
}
