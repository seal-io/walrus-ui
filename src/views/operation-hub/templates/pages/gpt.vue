<template>
  <ComCard top-gap class="gpt-box">
    <GroupTitle show-back title="新建模块"></GroupTitle>
    <div class="opration-wrap">
      <div class="sel">
        <a-select
          v-model="type"
          :options="optionList"
          :style="{
            'width': show ? '300px' : 0,
            'overflow': 'hidden',
            'border-width': show ? '1px' : '0'
          }"
          @change="handleTyeChange"
        >
        </a-select>
        <span class="label" @click="handleShowExample">
          <!-- <icon-code-square /> -->
          <span>示例</span>
          <icon-question-circle-fill />
        </span>
      </div>
    </div>
    <!-- <a-divider :margin="5"></a-divider> -->
    <a-spin :loading="loading" style="width: 100%">
      <a-split>
        <template #first>
          <AceEditor
            v-model="code"
            editor-id="firstEditor"
            :default-value="defaultValue"
            lang="json"
            height="500px"
            @change="handleCodeChange"
          ></AceEditor>
        </template>
        <template #second>
          <AceEditor
            editor-id="secondEditor"
            :default-value="diffValue"
            read-only
            lang="json"
            height="500px"
            @change="handleCodeChange"
          ></AceEditor>
        </template>
      </a-split>
    </a-spin>
    <a-space style="margin-top: 10px">
      <a-button
        type="primary"
        :disabled="loading"
        @click="handleCompletionGenerate"
      >
        <template #icon><icon-common /></template>
        <span>生成</span>
      </a-button>
      <a-button
        type="primary"
        :disabled="loading"
        @click="handleCompletionExplain"
      >
        <template #icon>
          <icon-font type="icon-shengchenglujing-01"></icon-font>
        </template>
        <span>解释</span>
      </a-button>
      <a-button
        type="primary"
        :disabled="loading"
        @click="handleCompletionCorrect"
      >
        <template #icon>
          <icon-find-replace />
        </template>
        <span>纠错</span>
      </a-button>
      <a-button type="outline" :disabled="loading" @click="handleClear">
        <template #icon><icon-delete /></template>
        <span>清空</span>
      </a-button>
      <!-- <a-button type="outline" status="success">
          <template #icon
            ><icon-font type="icon-magic" style="color: green"></icon-font
          ></template>
          <span>Prettify</span>
        </a-button> -->
    </a-space>
    <EditPageFooter>
      <template #save>
        <a-button
          type="primary"
          class="cap-title cancel-btn"
          :loading="submitLoading"
          @click="handleCreatePR"
          >{{ $t('operation.templates.gpt.create') }}</a-button
        >
      </template>
      <template #cancel>
        <a-button
          type="outline"
          class="cap-title cancel-btn"
          @click="handleCancel"
          >{{ $t('common.button.cancel') }}</a-button
        >
      </template>
    </EditPageFooter>
    <CreatePR v-model:show="showModal" title="创建PR" :status="status">
    </CreatePR>
  </ComCard>
</template>

<script lang="ts" setup>
  import { ref } from 'vue';
  import { get, map } from 'lodash';
  import useCallCommon from '@/hooks/use-call-common';
  import GroupTitle from '@/components/group-title/index.vue';
  import EditPageFooter from '@/components/edit-page-footer/index.vue';
  import AceEditor from '@/components/ace-editor/index.vue';
  import CreatePR from '../components/create-pr.vue';
  import {
    postCompletionsCorrect,
    postCompletionsExplain,
    postCompletionsGenerate,
    queryCompletionExamples
  } from '../api';

  const optionList = ref<{ label: string; value: string }[]>([]);
  const { router } = useCallCommon();
  const type = ref('');
  const status = ref('create');
  const code = ref('');
  const defaultValue = ref('');
  const diffValue = ref('');
  const showModal = ref(false);
  const submitLoading = ref(false);
  const loading = ref(false);
  const show = ref(false);

  const handleCodeChange = (val) => {
    console.log('code===', val);
  };
  const handleCreatePR = async () => {
    showModal.value = true;
  };
  const handleCancel = () => {
    router.back();
  };
  const getCompletionExample = async () => {
    try {
      const { data } = await queryCompletionExamples();
      optionList.value = map(data || [], (item) => {
        return {
          label: item.name,
          value: item.prompt
        };
      });
      // type.value = get(optionList.value, '0.value');
      // code.value = get(optionList.value, '0.value');
      // defaultValue.value = get(optionList.value, '0.value');
    } catch (error) {
      optionList.value = [];
      console.log(error);
    }
  };
  const handleCompletionCorrect = async () => {
    try {
      const params = {
        text: code.value
      };
      loading.value = true;
      const { data } = await postCompletionsCorrect(params);
      diffValue.value = `${data.corrected}\n\n${data.explanation}`;
      loading.value = false;
    } catch (error) {
      loading.value = false;
      diffValue.value = '';
      console.log(error);
    }
  };
  const handleCompletionExplain = async () => {
    try {
      const params = {
        text: code.value
      };
      loading.value = true;
      const { data } = await postCompletionsExplain(params);
      loading.value = false;
      diffValue.value = data.text;
      code.value = '';
    } catch (error) {
      loading.value = false;
      diffValue.value = '';
      code.value = '';
      console.log(error);
    }
  };
  const handleCompletionGenerate = async () => {
    try {
      const params = {
        text: code.value
      };
      loading.value = true;
      diffValue.value = '';
      const { data } = await postCompletionsGenerate(params);
      loading.value = false;
      defaultValue.value = data.text;
      code.value = '';
    } catch (error) {
      loading.value = false;
      defaultValue.value = '';
      code.value = '';
      console.log(error);
    }
  };
  const handleShowExample = () => {
    show.value = !show.value;
  };
  const handleClear = () => {
    code.value = '';
    defaultValue.value = '';
    diffValue.value = '';
  };
  const handleTyeChange = (val) => {
    code.value = val;
    defaultValue.value = val;
    diffValue.value = '';
  };
  getCompletionExample();
</script>

<style lang="less" scoped>
  .gpt-box {
    .opration-wrap {
      display: flex;
      justify-content: flex-end;

      .sel {
        height: 36px;
        overflow: hidden;
        line-height: 36px;

        .label {
          margin-left: 4px;
          color: rgb(var(--arcoblue-6));
          cursor: pointer;

          &:hover {
            color: rgb(var(--arcoblue-5));
          }
        }
      }
    }

    :deep(.arco-spin-mask) {
      z-index: 1000;

      .arco-icon.arco-icon-loading.arco-icon-spin {
        font-size: 22px;
      }
    }
  }
</style>