import { ref } from 'vue';
import { deleteModal, execSucceed } from '@/utils/monitor';
import { applyPipeline } from '../api';

export default function useRunWorkflow() {
  const showConfig = ref(false);
  const dataInfo = ref<any>({});

  const handleApply = async (row) => {
    try {
      dataInfo.value = row;
      setTimeout(() => {
        showConfig.value = true;
      }, 100);
    } catch (error) {
      // ignore
    }
  };

  const handleApplyFlow = async (data) => {
    try {
      await applyPipeline({
        ...data,
        projectId: dataInfo.value.project?.id
      });
      execSucceed('applications.workflow.table.runmsg');
    } catch (error) {
      // ignore
    }
  };

  const handleSave = async (data) => {
    handleApplyFlow(data);
  };

  return {
    showConfig,
    dataInfo,
    handleApply,
    handleSave
  };
}
