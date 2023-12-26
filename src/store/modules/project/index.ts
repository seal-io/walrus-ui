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
    defaultActiveProject: {}, // {id: '', name: ''}
    defaultActiveEnvironment: {} // {id: '', name: ''}
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
      const project = cloneDeep(this.defaultActiveProject);
      const environment = cloneDeep(this.defaultActiveEnvironment);
      this.$reset();
      this.setDefaultActiveProject(project);
      this.setDefaultActiveEnvironment(environment);
    },
    setDefaultActiveProject(project: any) {
      this.defaultActiveProject = project;
    },
    setDefaultActiveEnvironment(environment: any) {
      this.defaultActiveEnvironment = environment;
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
