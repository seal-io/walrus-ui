<template>
  <div>
    <a-cascader
      style="width: 240px; margin-bottom: 8px"
      :options="containerList"
      placeholder="请选择对象"
      @change="handleObjectChange"
    ></a-cascader>
    <div id="x-terminal" ref="wrapper" class="x-terminal-wrapper"></div>
  </div>
</template>

<script lang="ts" setup>
  import 'xterm/css/xterm.css';
  import { onMounted, ref, nextTick, inject } from 'vue';
  import { Terminal } from 'xterm';
  import {
    queryApplicationResource,
    queryApplicationResourceExec
  } from '../../../api';
  import { Cascader } from '../../../config/interface';
  import { generateResourcesKeys } from '../../../config';

  const term = new Terminal();
  const wrapper: any = ref();
  const instanceId = inject('instanceId', ref(''));
  const resourceId = ref('');
  const containerList = ref<Cascader[]>([]);
  const initTerminal = () => {
    const div = document.getElementById('x-terminal') as HTMLElement;
    term?.open(div);
    term.write('\x1B[1;3;31mseal\x1B[0m>$');
    term.onData((val) => {
      term.write(val);
    });
  };
  const handleObjectChange = () => {};
  const getApplicationResource = async () => {
    if (!instanceId.value) return;
    try {
      const params = {
        instanceID: instanceId.value,
        page: 1,
        perPage: -1
      };
      const { data } = await queryApplicationResource(params);
      const list = data?.items || [];
      // const list = testData;
      containerList.value = generateResourcesKeys(list, 'executable');
    } catch (error) {
      console.log(error);
      containerList.value = [];
    }
  };
  onMounted(() => {
    nextTick(() => {
      initTerminal();
    });
  });
</script>

<style lang="less">
  .x-terminal-wrapper {
    width: 100%;
    height: 200px;
  }
</style>
