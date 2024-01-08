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
    enterProjectDefault: {
      detail: false,
      list: false,
      projectId: ''
    },
    isSetDefaultActiveEnvironment: false,
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
      const isSetDefaultActiveEnv = this.isSetDefaultActiveEnvironment;
      this.$reset();
      this.setDefaultActiveProject(project);
      this.setDefaultActiveEnvironment(environment);
      this.setIsDefaultActiveEnvironment(isSetDefaultActiveEnv);
    },
    setDefaultActiveProject(project: any) {
      this.defaultActiveProject = project;
    },
    setDefaultActiveEnvironment(environment: any) {
      this.defaultActiveEnvironment = environment;
    },
    setIsDefaultActiveEnvironment(isSet: boolean) {
      this.isSetDefaultActiveEnvironment = isSet;
    },
    setEnterProjectDefault(data: any) {
      this.enterProjectDefault = data;
    },
    checkIsDefaultActiveEnvironment({ id }: any) {
      const { defaultActiveEnvironment } = this;
      return defaultActiveEnvironment?.id === id;
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
