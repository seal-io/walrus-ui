<template>
  <div class="flow-wrapper">
    <VueFlow
      :nodes="nodeList"
      :edges="edgeList"
      :default-zoom="4"
      :max-zoom="4"
      :min-zoom="0.1"
      fit-view-on-init
      @node-click="handleNodeClick"
    >
      <Background></Background>
      <Controls></Controls>
      <template #node-custom="data">
        <CustomNode :data="data" @action="handleActionSelect"></CustomNode>
      </template>
    </VueFlow>
  </div>
</template>

<script lang="ts" setup>
  import _ from 'lodash';
  import { ref, inject, watch } from 'vue';
  import { VueFlow, useVueFlow, Node, Handle, Edge } from '@vue-flow/core';
  import { Background } from '@vue-flow/background';
  import { Controls } from '@vue-flow/controls';
  import { NodeList, EdgeList } from './config';
  import CustomNode from './components/custom-node.vue';
  import { queryInstanceResourceGraph } from '../../../api';

  const instanceId = inject('instanceId', ref(''));
  const elements = ref([]);
  const nodeList = ref<Node[]>([]);
  const edgeList = ref<Edge[]>([]);
  const { onConnect, addEdges, nodes, edges } = useVueFlow({});

  const handleNodeClick = ({ node }) => {
    console.log('node==click', node);
    node.toolbar.isVisible = true;
  };
  const handleActionSelect = ({ node, action }) => {
    console.log('node===action', { node, action });
    node.toolbar.isVisible = false;
  };
  const setNodeList = (data) => {
    nodeList.value = _.map(data.nodes || [], (o) => {
      const node = _.cloneDeep(o);
      node.nodeType = node.type;
      node.type = 'input';
      node.label = node.name;
      node.position = { x: 0, y: 0 };
      return node;
    });
  };
  const setLinks = (data) => {
    edgeList.value = _.map(data.links || [], (o) => {
      const link = _.cloneDeep(o);
      link.id = `${link.source}-${link.target}`;
      return link;
    });
  };
  const getInstanceResourceGraph = async () => {
    try {
      const params = {
        instanceID: instanceId.value
      };
      const { data } = await queryInstanceResourceGraph(params);
      setNodeList(data);
      setLinks(data);
    } catch (error) {
      console.log(error);
    }
  };
  watch(
    () => instanceId.value,
    () => {
      // getInstanceResourceGraph();
    },
    {
      immediate: true
    }
  );
</script>

<style lang="less">
  @import url('./style/index.less');

  .flow-wrapper {
    width: 100%;
    height: 500px;
  }
</style>
