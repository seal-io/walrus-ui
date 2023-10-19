import { clone, cloneDeep } from 'lodash';
import { defineStore } from 'pinia';
import BC from '@/hooks/broadcast-channel';

const useProjectStore = defineStore('project', {
  persist: {
    key: 'project'
  },
  state: (): any => ({
    projectList: [],
    environmentList: [],
    serviceList: [],
    pipelineList: [],
    pipelineRecordList: [],
    defaultActiveProject: {} // {id: '', name: ''}
  }),
  getters: {
    filterInfo(state: any): any {
      return { ...state };
    }
  },
  actions: {
    setInfo(partial: any) {
      this.$patch(partial);
    },
    resetInfo() {
      this.$reset();
    },
    removeProjects(ids) {
      const projectList = cloneDeep(this.projectList).filter(
        (item) => !ids.includes(item.value)
      );
      this.setInfo({
        projectList
      });
      BC.postMessage({
        type: 'project',
        data: {
          projectList
        }
      });
    }
  }
});

export default useProjectStore;
