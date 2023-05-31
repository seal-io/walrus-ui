<template>
  <a-modal
    top="10%"
    :closable="false"
    :align-center="false"
    :width="900"
    :ok-text="$t('common.button.save')"
    :visible="show"
    :mask-closable="false"
    unmount-on-close
    :body-style="{
      'overflow': 'auto',
      'text-align': 'center'
    }"
    title="终端"
    @before-open="handleBeforeOpen"
    @before-close="handleBeforeClose"
  >
    <div>
      <xTerminal :url="wssURL"></xTerminal>
    </div>
    <template #footer>
      <EditPageFooter style="margin-top: 0">
        <template #cancel>
          <a-button
            :type="'primary'"
            class="cap-title cancel-btn"
            @click="handleCancel"
            >{{ $t('common.button.close') }}</a-button
          >
        </template>
      </EditPageFooter>
    </template>
  </a-modal>
</template>

<script lang="ts" setup>
  import EditPageFooter from '@/components/edit-page-footer/index.vue';
  import qs from 'query-string';
  import {
    inject,
    ref,
    computed,
    onMounted,
    watch,
    nextTick,
    defineExpose,
    PropType,
    onBeforeUnmount
  } from 'vue';
  import xTerminal from '@/components/x-terminal/index.vue';
  import router from '@/router';

  const props = defineProps({
    info: {
      type: Object as PropType<{ id: string; key: string }>,
      default() {
        return {
          key: '',
          id: ''
        };
      }
    },
    show: {
      type: Boolean,
      default() {
        return false;
      }
    },
    isLoading: {
      type: Boolean,
      default() {
        return false;
      }
    }
  });
  const emits = defineEmits(['update:show']);
  const { params } = router.currentRoute.value;
  const { host, protocol } = window.location;
  const proto = protocol === 'https:' ? 'wss' : 'ws';
  const projectID = params.projectId;
  const wssURL = ref('');

  const setWssuRL = () => {
    console.log('info:', props.info);
    if (!props.info.key || !props.info.id) {
      wssURL.value = '';
      return;
    }
    wssURL.value = `${proto}://${host}/v1/application-resources/${
      props.info.id
    }/exec?${qs.stringify({
      key: props.info.key,
      projectID
    })}`;
  };
  const handleCancel = () => {
    emits('update:show', false);
  };
  const handleBeforeOpen = () => {
    setWssuRL();
  };
  const handleBeforeClose = () => {};
</script>

<style lang="less" scoped></style>
