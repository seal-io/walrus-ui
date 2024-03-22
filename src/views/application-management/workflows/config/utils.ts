import { yaml2Json } from '@/components/form-create/config/yaml-parse';
import _ from 'lodash';
import ArgoTestData from './argo-test';
import { Stage } from './interface';

export const parseWorkflowSpec = (yaml: string): any[] => {
  const json = yaml2Json(yaml);
  const templates = json.spec.templates || [];
  const entrySteps =
    _.find(
      templates,
      (template: any) => template.name === json?.spec?.entrypoint
    )?.steps || [];

  const stages = _.map(entrySteps, (step: any) => {
    return _.map(step, (s: any) => {
      const stage = _.find(
        templates,
        (template: any) => template.name === s.template
      );
      return {
        name: stage.name,
        description: '',
        dependencies: [],
        steps: stage.steps
      };
    });
  });

  return stages;
};

// get substring between {{ and }}

export const getSubstring = (str: string): string => {
  if (!str) {
    return '';
  }
  return str.substring(str.indexOf('{{') + 2, str.indexOf('}}'));
};
