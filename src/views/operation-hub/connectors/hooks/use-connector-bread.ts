import { ref } from 'vue';
import { BreadcrumbOptions } from '@/views/config/interface';
import useProjectData from '@/views/application-management/projects/hooks/use-project-breadcrumb-data';
import { useProjectStore } from '@/store';

export default function useConnectorBread() {
  const projectStore = useProjectStore();
  const breadCrumbList = ref<BreadcrumbOptions[]>([]);
  const loading = ref(false);
  const { getProjectList, setProjectList, handleBreadChange } =
    useProjectData();
  const handleSelectChange = ({ value, item }) => {
    handleBreadChange(value, item);
  };
  const setBreadCrumbList = async () => {
    loading.value = true;
    const list = await setProjectList(projectStore.projectList);
    breadCrumbList.value = [{ ...list, backAction: true }];

    const projectList = await getProjectList();
    const projectRes = await setProjectList(projectList);
    breadCrumbList.value = [
      {
        ...projectRes,
        backAction: true
      }
    ];
    loading.value = false;
  };
  return {
    handleSelectChange,
    setBreadCrumbList,
    breadCrumbList,
    loading
  };
}
