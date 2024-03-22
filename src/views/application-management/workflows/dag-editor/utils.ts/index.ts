import { yaml2Json } from '@/components/form-create/config/yaml-parse';
import { parseExpression } from '@/components/form-create/config/experssion-parser';
import _ from 'lodash';

const parseDependsSteps = (expression, target) => {
  if (!expression) {
    return [];
  }
  const dependencies: { id: string; source: string; target: string }[] = [];
  const cacheStepName: string[] = [];

  const logicalRegex = /\|\||&&|!/g;
  const logicalExpressions = expression.split(logicalRegex);

  logicalExpressions.forEach((logicalExpression) => {
    const steps = logicalExpression.split('.');
    const stepName = steps[0].replace(/[()\s]/g, '');

    if (!_.includes(cacheStepName, stepName)) {
      cacheStepName.push(stepName);
      dependencies.push({
        id: `${stepName}-${target}`,
        source: stepName,
        target
      });
    }
  });

  return dependencies;
};

const parseDependenciesSteps = (list, target) => {
  const steps: string[] = _.uniq(list);
  if (!steps.length) {
    return [];
  }
  const dependencies: { id: string; source: string; target: string }[] = [];
  // deDuplication list
  _.each(steps, (step) => {
    dependencies.push({
      id: `${step}-${target}`,
      source: step,
      target
    });
  });
  return dependencies;
};
export const parseWorkflowSpec = (data: any) => {
  // const json = yaml2Json(data);
  const result: any = {
    nodes: [],
    edges: []
  };
  const json = data;
  const templates = json.spec.templates || [];
  const stageList =
    _.find(
      templates,
      (template: any) => template.name === json?.spec?.entrypoint
    )?.steps || [];

  _.each(stageList, (stage: any) => {
    result.nodes.push({
      id: stage[0].name,
      label: stage[0].name,
      shape: 'lane',
      data: {
        parent: true,
        raw: stage
      }
    });
    const tasks = _.get(
      _.find(templates, (template: any) => template.name === stage[0].name),
      'steps.0',
      []
    );

    _.each(tasks, (task: any) => {
      result.nodes.push({
        id: task.name,
        label: task.name,
        shape: 'lane-rect',
        parent: stage[0].name,
        data: {
          group: stage[0].name,
          parent: false,
          raw: task
        }
      });
      if (task.depends) {
        result.edges = result.edges.concat(
          parseDependsSteps(task.depends, task.name)
        );
      } else if (task.dependencies) {
        result.edges = result.edges.concat(
          parseDependenciesSteps(task.dependencies, task.name)
        );
      }
    });
  });

  return result;
};

export default {};
