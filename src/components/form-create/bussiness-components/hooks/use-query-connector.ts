import { inject, toRefs, ref } from 'vue';
import _ from 'lodash';
import { InjectProjectEnvironmentKey } from '@/views/config';
import { queryEnvironmentConnector } from '../api';
import { CheckConnectorCatagory } from '../types';
import {
  projectEnvCtxInjectionKey,
  ProjectEnvironmentContext
} from '../config';

export default function useQueryConnector(props) {
  const ProjectEnvContext = inject<Partial<ProjectEnvironmentContext>>(
    projectEnvCtxInjectionKey,
    {}
  );
  const ProjectEnvironment = inject(InjectProjectEnvironmentKey, {
    environmentID: '',
    projectID: ''
  });
  const connectorID = ref('');
  const isProjectConnector = ref(false);
  const { widget } = toRefs(props);
  const { connectors } = toRefs(ProjectEnvContext);

  const fetchConnectors = async () => {
    try {
      const { environmentID, projectID } = ProjectEnvironment;

      if (!environmentID || !projectID) return;

      const { data } = await queryEnvironmentConnector({
        environmentID,
        projectID
      });
      const connectorData = _.find(data.connectors, (item) => {
        return item.connector.type === CheckConnectorCatagory(widget.value);
      });
      connectorID.value = connectorData?.connector.id;
      isProjectConnector.value = !!connectorData?.project?.id;
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
