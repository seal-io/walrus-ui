import { inject, toRefs, ref, Ref } from 'vue';
import _ from 'lodash';
import { InjectProjectEnvironmentKey } from '@/views/config';
import { queryEnvironmentConnector } from '../api';
import { CheckConnectorCatagory } from '../types';
import {
  projectEnvCtxInjectionKey,
  ProjectEnvironmentContext
} from '../config';

export default function useQueryConnector(props) {
  const ProjectEnvContext = inject<Ref<Partial<ProjectEnvironmentContext>>>(
    projectEnvCtxInjectionKey,
    ref({})
  );
  const ProjectEnvironment = inject(
    InjectProjectEnvironmentKey,
    ref({
      environmentID: '',
      projectID: ''
    })
  );
  const connectorID = ref('');
  const isProjectConnector = ref(false);
  const { widget } = toRefs(props);
  const { connectors } = toRefs(ProjectEnvContext.value);

  const fetchConnectors = async () => {
    try {
      const { environmentID, projectID } = ProjectEnvironment.value;

      if (!environmentID || !projectID) return;

      const { data } = await queryEnvironmentConnector({
        environmentID,
        projectID
      });
      const connectorData = _.find(data.connectors, (item) => {
        return item.connector.type === CheckConnectorCatagory(widget.value);
      });
      connectorID.value = connectorData?.connector.id;
      isProjectConnector.value = !!connectorData?.connector?.project?.id;
    } catch (error) {
      // eslint-disable-next-line no-console
    }
  };
  return {
    connectorID,
    ProjectEnvironment,
    isProjectConnector,
    fetchConnectors
  };
}
