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
      <a-space v-if="showFix">
        <a-link class="link-btn" @click="handleFixCall">
          <template #icon>
            <icon-font type="icon-icontypropertyrepair"></icon-font>
          </template>
          <span>接受修复</span>
        </a-link>
        <a-link class="link-btn" @click="handleUndoCall">
          <template #icon>
            <icon-font type="icon-quxiao"></icon-font>
          </template>
          <span>放弃修复</span>
        </a-link>
      </a-space>
    </div>
    <!-- <a-divider :margin="5"></a-divider> -->
    <a-spin :loading="loading" style="width: 100%">
      <a-grid :cols="24" :col-gap="10">
        <a-grid-item :span="showExplainModal ? 16 : 24">
          <AceEditor
            v-model="code"
            :remove-lines="removeLines"
            :add-lines="addLines"
            editor-id="firstEditor"
            :editor-default-value="defaultValue"
            lang="json"
            :height="500"
            @change="handleCodeChange"
          ></AceEditor>
        </a-grid-item>
        <a-grid-item :span="showExplainModal ? 8 : 0">
          <div
            v-show="showExplainModal"
            id="modal-container"
            class="modal-container"
          >
            <AceEditor
              editor-id="infoEditor"
              :editor-default-value="explainContent"
              :show-gutter="false"
              read-only
              :height="500"
            ></AceEditor>
          </div>
        </a-grid-item>
      </a-grid>
    </a-spin>
    <div class="tools-wrap">
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
      <a-space>
        <a-button type="primary" :disabled="loading" @click="handleViewExplain">
          <template #icon>
            <icon-info-circle />
          </template>
          <span>查看解释</span>
        </a-button>
        <a-button
          type="primary"
          :disabled="loading"
          @click="handleViewCorrection"
        >
          <template #icon>
            <icon-font type="icon-shoudongxiaoyan"></icon-font>
          </template>
          <span>纠错说明</span>
        </a-button>
      </a-space>
    </div>
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
    <!-- <CodeExplainModal
      v-model:show="showExplainModal"
      v-model:content="explainContent"
      title="说明信息"
    ></CodeExplainModal> -->
  </ComCard>
</template>

<script lang="ts" setup>
  import { ref, computed, watch, nextTick } from 'vue';
  import { get, map, each, reduce } from 'lodash';
  import * as Diff from 'diff';
  import { deleteModal } from '@/utils/monitor';
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
  // const explainContent = ref('');
  const correctionExplain = ref('');
  const showExplainModal = ref(false);
  const explainStatus = ref('explain'); // explain、correction
  const showFix = ref(false);

  const explainContent = computed(() => {
    if (explainStatus.value === 'explain') {
      return explainValue.value;
    }
    return correctionExplain.value;
  });
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
      correctionExplain.value = `${data.explanation}`;
      explainStatus.value = 'correction';
      setTimeout(() => {
        showExplainModal.value = true;
      }, 100);
      loading.value = false;
      diffResult.value = Diff.diffLines(code.value, data.corrected);
      defaultValue.value = getCorrectDiffValue(diffResult.value);
      showFix.value = true;
      console.log('diffResult==', defaultValue.value, diffResult.value);
      getDiffResultLines();
    } catch (error) {
      loading.value = false;
      showFix.value = false;
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
      explainStatus.value = 'explain';
      setTimeout(() => {
        showExplainModal.value = true;
      }, 100);
    } catch (error) {
      loading.value = false;
      diffValue.value = '';
      console.log(error);
    }
  };
  const handleCompletionGenerate = async () => {
    clearDiffLines();
    showExplainModal.value = false;
    showFix.value = false;
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

  const handleUndo = () => {
    const res = reduce(
      diffResult.value,
      (str, item) => {
        if (item.added) {
          str += '';
        } else {
          str += `${item.value}`;
        }
        return str;
      },
      ''
    );
    defaultValue.value = res;
    code.value = res;
    clearDiffLines();
    showFix.value = false;
    showExplainModal.value = false;
  };
  const handleUndoCall = () => {
    deleteModal({
      title: '确定取消全部修复？',
      onOk: handleUndo
    });
  };
  const handleFixAll = () => {
    const res = reduce(
      diffResult.value,
      (str, item) => {
        if (item.removed) {
          str += '\n';
        } else {
          str += `${item.value}`;
        }
        return str;
      },
      ''
    );
    clearDiffLines();
    defaultValue.value = res;
    code.value = res;
    showFix.value = false;
    showExplainModal.value = false;
  };
  const handleFixCall = () => {
    deleteModal({
      title: '确定接受全部修复？',
      onOk: handleFixAll
    });
  };
  const handleViewCorrection = () => {
    if (explainStatus.value === 'correction') {
      showExplainModal.value = !showExplainModal.value;
    } else {
      showExplainModal.value = true;
      explainStatus.value = 'correction';
    }
  };
  const handleViewExplain = () => {
    if (explainStatus.value === 'explain') {
      showExplainModal.value = !showExplainModal.value;
    } else {
      showExplainModal.value = true;
      explainStatus.value = 'explain';
    }
  };
  watch(
    () => explainValue.value,
    () => {
      setTimeout(() => {
        showExplainModal.value = !!explainValue.value;
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
    .tools-wrap {
      display: flex;
      justify-content: space-between;
    }
    // .modal-container {
    //   padding: 10px;
    //   background-color: #fff;
    //   height: 100%;
    //   overflow: auto;
    //   border: 1px solid var(--color-border-2);
    //   border-radius: var(--border-radius-small);

    //   .info-content {
    //     background-color: var(--color-fill-2);
    //     height: 100%;
    //   }
    // }
    .opration-wrap {
      display: flex;
      flex-direction: row-reverse;
      align-items: center;
      justify-content: space-between;

      .link-btn {
        font-size: 12px;
      }

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
