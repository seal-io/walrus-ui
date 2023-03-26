<template>
  <ComCard top-gap class="gpt-box">
    <GroupTitle show-back title="编写模块"></GroupTitle>
    <div class="opration-wrap">
      <div class="sel">
        <a-select
          v-model="type"
          :disabled="loading"
          :options="optionList"
          style="width: 300px"
          placeholder="请选择示例"
          @change="handleTyeChange"
        >
        </a-select>
        <!-- <span class="label" @click="handleShowExample">
          <span>示例</span>
          <icon-question-circle-fill />
        </span> -->
      </div>
    </div>
    <!-- <a-divider :margin="5"></a-divider> -->
    <a-spin :loading="loading" style="width: 100%">
      <AceEditor
        v-model="code"
        :remove-lines="removeLines"
        :add-lines="addLines"
        editor-id="firstEditor"
        :default-value="defaultValue"
        lang="json"
        height="500px"
        @change="handleCodeChange"
      ></AceEditor>
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
          :disabled="loading"
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
    <CreatePR
      v-model:show="showModal"
      title="创建PR"
      :status="status"
      :content="code"
    >
    </CreatePR>
    <CodeExplainModal
      v-model:show="showExplainModal"
      v-model:content="explainContent"
      title="说明信息"
    ></CodeExplainModal>
  </ComCard>
</template>

<script lang="ts" setup>
  import { ref, computed, watch, nextTick } from 'vue';
  import { get, map, each, reduce } from 'lodash';
  import * as Diff from 'diff';
  import useCallCommon from '@/hooks/use-call-common';
  import GroupTitle from '@/components/group-title/index.vue';
  import EditPageFooter from '@/components/edit-page-footer/index.vue';
  import AceEditor from '@/components/ace-editor/index.vue';
  import CreatePR from '../components/create-pr.vue';
  import CodeExplainModal from '../components/code-explain-modal.vue';
  import {
    postCompletionsCorrect,
    postCompletionsExplain,
    postCompletionsGenerate,
    queryCompletionExamples
  } from '../api';

  interface DiffItem {
    count: number;
    value: string;
    line: number;
    removed?: boolean;
    added?: boolean;
  }
  const optionList = ref<{ label: string; value: string }[]>([]);
  const { router } = useCallCommon();
  const type = ref('');
  const status = ref('create');
  const code = ref('');
  const defaultValue = ref(``);
  const diffValue = ref('');
  const explainValue = ref('');
  const showModal = ref(false);
  const submitLoading = ref(false);
  const loading = ref(false);
  const show = ref(false);
  const diffResult = ref<DiffItem[]>([]);
  const removeLines = ref<number[]>([]);
  const addLines = ref<number[]>([]);
  const explainContent = ref('');
  const showExplainModal = ref(false);

  const handleCodeChange = (val) => {
    console.log('code===', val);
  };
  const handleCreatePR = async () => {
    showModal.value = true;
  };
  const handleCancel = () => {
    router.back();
  };
  const clearDiffLines = () => {
    removeLines.value = [];
    addLines.value = [];
  };
  const getDiffResultLines = () => {
    clearDiffLines();
    diffResult.value = map(diffResult.value, (item, index) => {
      if (index === 0) {
        item.line = item.count;
      } else {
        item.line = item.count + get(diffResult.value, `${index - 1}.line`);
      }
      return item;
    });
    each(diffResult.value, (item) => {
      if (item.removed) {
        removeLines.value.push(item.line);
      }
      if (item.added) {
        addLines.value.push(item.line);
      }
    });
  };
  const getCorrectDiffValue = (corrected: DiffItem[]) => {
    const res = reduce(
      corrected,
      (str, item) => {
        str += item.value;
        return str;
      },
      ''
    );
    return res;
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
      explainContent.value = `${data.explanation}`;
      loading.value = false;
      diffResult.value = Diff.diffLines(code.value, data.corrected);
      defaultValue.value = getCorrectDiffValue(diffResult.value);
      console.log('diffResult==', defaultValue.value, diffResult.value);
      getDiffResultLines();
    } catch (error) {
      loading.value = false;
      diffValue.value = '';
      diffResult.value = [];
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
      // diffValue.value = data.text;
      explainValue.value = data.text;
    } catch (error) {
      loading.value = false;
      diffValue.value = '';
      console.log(error);
    }
  };
  const handleCompletionGenerate = async () => {
    clearDiffLines();
    try {
      const params = {
        text: code.value
      };
      loading.value = true;
      diffValue.value = '';
      const { data } = await postCompletionsGenerate(params);
      loading.value = false;
      defaultValue.value = data.text;
      code.value = data.text;
    } catch (error) {
      loading.value = false;
      console.log(error);
    }
  };
  const handleShowExample = () => {
    show.value = !show.value;
  };
  const handleClear = () => {
    clearDiffLines();
    code.value = '';
    defaultValue.value = '';
    diffValue.value = '';
  };
  const handleTyeChange = (val) => {
    clearDiffLines();
    code.value = val;
    defaultValue.value = val;
    diffValue.value = '';
  };
  watch(
    () => explainContent.value,
    () => {
      setTimeout(() => {
        showExplainModal.value = !!explainContent.value;
      }, 100);
    },
    {
      immediate: true
    }
  );
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
