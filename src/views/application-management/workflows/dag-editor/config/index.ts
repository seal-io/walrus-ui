export const NodeShape = {
  Stage: 'stage',
  Approval: 'approval',
  Task: 'task',
  Edge: 'edge'
};

export const NODE_SIZE = {
  width: 160,
  height: 80
};

export const APPROVAL_NODE_SIZE = {
  width: 80,
  height: 80
};

export const STAGE_NODE_SIZE = {
  width: 1,
  height: 1000
};

export const NODE_GAP = {
  nodeSep: 50,
  rankSep: 100
};

export const PHASES = {
  Pending: 'Pending',
  Running: 'Running',
  Succeeeded: 'Succeeeded',
  Failed: 'Failed',
  Error: 'Error',
  Omitted: 'Omitted'
};

export const tools = [
  {
    label: 'applications.environment.graph.fitview',
    value: 'fitCenter',
    icon: 'icon-fit_screen-o'
  },
  {
    label: 'common.button.refresh',
    value: 'refresh',
    compile: true,
    icon: 'icon-sync'
  },
  {
    label: 'common.button.undo',
    value: 'undo',
    disabled: false,
    icon: 'icon-undo'
  },
  {
    label: 'common.button.redo',
    value: 'redo',
    disabled: false,
    icon: 'icon-redo'
  }
];

export default {};
