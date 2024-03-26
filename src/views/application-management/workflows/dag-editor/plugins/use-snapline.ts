import { Snapline } from '@antv/x6-plugin-snapline';
// import setSnaplineStyle from '../style/snapline';

export default (graph) => {
  // setSnaplineStyle();
  graph.use(
    new Snapline({
      className: 'snapline',
      enabled: true,
      sharp: true
    })
  );
};
