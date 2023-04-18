<template>
  <ComCard top-gap class="gpt-box">
    <GroupTitle
      show-back
      :title="$t('operation.templates.button.gpt')"
    ></GroupTitle>
    <div class="opration-wrap">
      <div class="sel">
        <a-select
          v-model="type"
          :disabled="loading"
          :options="optionList"
          style="width: 300px"
          :placeholder="$t('operation.templates.detail.example')"
          @change="handleTyeChange"
        >
        </a-select>
      </div>
      <a-space v-if="showFix">
        <a-link class="link-btn" @click="handleFixCall">
          <template #icon>
            <icon-font type="icon-icontypropertyrepair"></icon-font>
          </template>
          <span>{{ $t('operation.templates.detail.receiveFix') }}</span>
        </a-link>
        <a-link class="link-btn" @click="handleUndoCall">
          <template #icon>
            <icon-font type="icon-quxiao"></icon-font>
          </template>
          <span>{{ $t('operation.templates.detail.cancelFix') }}</span>
        </a-link>
      </a-space>
    </div>
    <!-- <a-divider :margin="5"></a-divider> -->
    <a-spin :loading="loading" style="width: 100%">
      <a-grid :cols="24" :col-gap="10">
        <a-grid-item :span="24">
          <AceEditor
            ref="editor"
            v-model="code"
            :remove-lines="removeLines"
            :add-lines="addLines"
            editor-id="firstEditor"
            :editor-default-value="defaultValue"
            lang="terraform"
            :height="500"
            @change="handleCodeChange"
          ></AceEditor>
        </a-grid-item>
        <!-- <a-grid-item :span="showExplainModal ? 8 : 0">
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
        </a-grid-item> -->
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
          <span>{{ $t('operation.templates.detail.gptcreate') }}</span>
        </a-button>
        <a-button
          type="primary"
          :disabled="loading"
          @click="handleCompletionExplain"
        >
          <template #icon>
            <icon-font type="icon-shengchenglujing-01"></icon-font>
          </template>
          <span>{{ $t('operation.templates.detail.explain') }}</span>
        </a-button>
        <a-button
          type="primary"
          :disabled="loading"
          @click="handleCompletionCorrect"
        >
          <template #icon>
            <icon-find-replace />
          </template>
          <span>{{ $t('operation.templates.detail.correction') }}</span>
        </a-button>
        <a-button type="outline" :disabled="loading" @click="handleClear">
          <template #icon><icon-delete /></template>
          <span>{{ $t('common.button.clear') }}</span>
        </a-button>
        <!-- <a-button type="outline" status="success">
          <template #icon
            ><icon-font type="icon-magic" style="color: green"></icon-font
          ></template>
          <span>Prettify</span>
        </a-button> -->
      </a-space>
      <a-space>
        <a-tooltip
          trigger="click"
          position="tr"
          :disabled="loading"
          :content-style="{ maxHeight: '300px' }"
          background-color="#e8f2ff"
          :popup-visible="showExplainModal"
        >
          <template #content>
            <div style="color: #4e5969; font-size: 14px; white-space: pre-wrap">
              {{
                correctionExplain ||
                $t('operation.templates.detail.nocorrection')
              }}
            </div>
          </template>
          <a-button
            ref="correctionButton"
            :disabled="loading"
            type="outline"
            shape="circle"
            class="correction-btn"
            @click="handleViewCorrection"
          >
            <a-tooltip
              :content="$t('operation.templates.detail.correctionview')"
            >
              <template #content>
                <div style="width: max-content">{{
                  $t('operation.templates.detail.correctionview')
                }}</div>
              </template>
              <span>
                <icon-font
                  type="icon-shoudongxiaoyan"
                  class="size-16"
                ></icon-font>
              </span>
            </a-tooltip>
          </a-button>
        </a-tooltip>
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
      :title="$t('operation.templates.create.title')"
      :status="status"
      :content="code"
      @save="handleShowPRLink"
    >
    </CreatePR>
    <CodeExplainModal
      v-model:show="showExplain"
      :content="explainValue"
      :title="$t('operation.templates.detail.explainInfo')"
    ></CodeExplainModal>
  </ComCard>
</template>

<script lang="ts" setup>
  import { ref, computed, watch, nextTick, h, inject } from 'vue';
  import { get, map, each, reduce, add } from 'lodash';
  import * as Diff from 'diff';
  import { Modal, Button, Link } from '@arco-design/web-vue';
  import { onClickOutside } from '@vueuse/core';
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
  const { router, t, locale } = useCallCommon();
  const correctionButton = ref();
  const type = ref('');
  const status = ref('create');
  const code = ref('');
  const editor = ref();
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
  const showExplain = ref(false);
  const showFix = ref(false);
  let modalInstance: any = null;

  onClickOutside(correctionButton, (ev) => {
    showExplainModal.value = false;
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
    each(diffResult.value, (item, index) => {
      let { count } = item;
      while (count > 0) {
        if (item.removed) {
          removeLines.value.push(
            add(get(diffResult.value, `${index - 1}.line`) || 0, count)
          );
        }
        if (item.added) {
          addLines.value.push(
            add(get(diffResult.value, `${index - 1}.line`) || 0, count)
          );
        }
        count -= 1;
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
  const handleViewCorrection = () => {
    showExplainModal.value = !showExplainModal.value;
  };
  const getCompletionExample = async () => {
    try {
      type.value = '';
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
      loading.value = false;
      diffResult.value = Diff.diffLines(code.value, data.corrected);
      defaultValue.value = getCorrectDiffValue(diffResult.value);
      showFix.value = true;
      console.log('diffResult==', defaultValue.value, diffResult.value);
      getDiffResultLines();
      setTimeout(() => {
        handleViewCorrection();
      }, 100);
    } catch (error) {
      loading.value = false;
      showFix.value = false;
      diffValue.value = '';
      diffResult.value = [];
      console.log(error);
    }
  };
  const handleCompletionExplain = async () => {
    if (explainValue.value) {
      showExplain.value = true;
      return;
    }
    try {
      const params = {
        text: code.value
      };
      loading.value = true;
      const { data } = await postCompletionsExplain(params);
      loading.value = false;
      // diffValue.value = data.text;
      explainValue.value = data.text;
      setTimeout(() => {
        showExplain.value = !!explainValue.value;
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
    explainValue.value = '';
    correctionExplain.value = '';
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
    type.value = '';
    defaultValue.value = '';
    diffValue.value = '';
    diffResult.value = [];
    showFix.value = false;
    explainValue.value = '';
    correctionExplain.value = '';
    editor.value?.clear();
  };
  const handleTyeChange = (val) => {
    clearDiffLines();
    code.value = val;
    defaultValue.value = val;
    diffValue.value = '';
    showFix.value = false;
    explainValue.value = '';
    correctionExplain.value = '';
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
      title: 'operation.templates.detail.cancelFix.tips',
      onOk: handleUndo
    });
  };
  const handleFixAll = () => {
    const res = reduce(
      diffResult.value,
      (str, item) => {
        if (item.removed) {
          str += '';
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
      title: 'operation.templates.detail.receiveFix.tips',
      onOk: handleFixAll
    });
  };

  const handleShowPRLink = (url) => {
    modalInstance = Modal.success({
      title: t('operation.templates.pr.done'),
      top: '20%',
      width: 500,
      maskClosable: false,
      // okText: '前往处理PR',
      // hideCancel: false,
      // cancelText: '关闭',
      footer: () => {
        return h('div', {}, [
          h(
            Button,
            {
              type: 'primary',
              onClick: () => {
                window.open(url);
                modalInstance?.close?.();
              }
            },
            t('operation.templates.pr.handle')
          ),
          h(
            Button,
            {
              type: 'outline',
              onClick: () => {
                modalInstance?.close?.();
              }
            },
            t('common.button.close')
          )
        ]);
      },
      content: ''
    });
  };
  watch(
    () => locale.value,
    () => {
      console.log('locale===', locale.value);

      getCompletionExample();
    },
    {
      immediate: false
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

    .correction-btn {
      // position: fixed;
      // right: 40px;
      // bottom: 180px;
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
