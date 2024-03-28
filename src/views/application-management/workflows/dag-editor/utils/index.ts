import { yaml2Json } from '@/components/form-create/config/yaml-parse';
import _ from 'lodash';
import { NodeShape } from '../config';

interface EdgeItem {
  id: string;
  source: string;
  target: string;
  shape: string;
  [key: string]: any;
}
const generateStageEdges = (stages) => {
  const result: { id: string; source: string; target: string }[] = [];
  for (let i = 0; i < result.length - 1; i += 1) {
    const source = stages[i][0];
    const target = stages[i + 1][0];
    result.push({
      source: source.name,
      target: target.name,
      id: `${source.name}-${target.name}`
    });
  }
  return result;
};

const parseDependsSteps = (expression, target) => {
  if (!expression) {
    return [];
  }
  const dependencies: EdgeItem[] = [];
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
        target,
        sourcePort: 'right',
        targetPort: 'left',
        shape: NodeShape.Edge
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
  const dependencies: EdgeItem[] = [];
  // deDuplication list
  _.each(steps, (step) => {
    dependencies.push({
      id: `${step}-${target}`,
      source: step,
      target,
      sourcePort: 'right',
      targetPort: 'left',
      shape: NodeShape.Edge
    });
  });
  return dependencies;
};

const parseStepsFlowData = (stageData, stage, result, json) => {
  const tasks = _.get(stageData, 'steps.0', []);

  _.each(tasks, (task: any) => {
    result.nodes.push({
      id: task.name,
      label: task.name,
      shape: NodeShape.Task,
      parent: stage[0].name,
      position: {
        relative: false
      },
      data: {
        group: stage[0].name,
        parent: false,
        raw: task,
        nodesStatus: json.status?.nodes
      }
    });
  });
};

const parseDagTasksData = (stageData, stage, result, json) => {
  const tasks = _.get(stageData, 'dag.tasks', []);

  _.each(tasks, (task: any) => {
    console.log('task+++++++++++', task);
    result.nodes.push({
      id: task.name,
      label: task.name,
      shape: NodeShape.Task,
      parent: stage[0].name,
      position: {
        relative: false
      },
      data: {
        group: stage[0].name,
        parent: false,
        label: task.name,
        raw: task,
        nodeAction: 'edit',
        nodesStatus: json.status?.nodes
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
};

export const parseWorkflowSpec = (data: any) => {
  // const json = yaml2Json(data);
  const result: any = {
    nodes: [],
    edges: []
  };
  const json = data;
  const templates = json?.spec?.templates || [];
  const stageList =
    _.find(
      templates,
      (template: any) => template.name === json?.spec?.entrypoint
    )?.steps || [];

  _.each(stageList, (stage: any, index) => {
    result.nodes.push({
      id: stage[0].name,
      label: stage[0].name,
      shape: NodeShape.Stage,
      position: {
        x: +index * 100,
        y: 0
      },
      data: {
        parent: true,
        raw: stage
      }
    });

    const stageData = _.find(
      templates,
      (template: any) => template.name === stage[0].name
    );
    // 1. multiple steps task
    if (_.get(stageData, 'steps')) {
      parseStepsFlowData(stageData, stage, result, json);
    }
    // 2. dag task
    if (_.get(stageData, 'dag')) {
      parseDagTasksData(stageData, stage, result, json);
    }
  });

  // result.edges = result.edges.concat(generateStageEdges(stageList));

  return result;
};

export const setPosition = (nodes, edges) => {
  // get no source nodes
  const noSourceNodes = _.difference(
    _.map(nodes, 'id'),
    _.map(edges, 'target')
  );
};

export default {};
