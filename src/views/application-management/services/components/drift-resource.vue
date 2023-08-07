<template>
  <a-modal
    top="10%"
    :closable="false"
    :align-center="false"
    :width="700"
    :ok-text="$t('common.button.save')"
    :visible="show"
    :mask-closable="false"
    unmount-on-close
    :body-style="{
      'max-height': '500px',
      'overflow': 'auto',
      'text-align': 'center'
    }"
    modal-class="oci-modal"
    :title="title"
    @cancel="handleCancel"
    @ok="handleCancel"
    @open="handleBeforeOpen"
    @before-close="handleBeforeClose"
  >
    <div>
      <div v-if="!single" class="m-b-20">
        <seal-select
          v-model="formData.id"
          :label="$t('applications.instance.tab.resource')"
          style="width: 100%"
          @change="handleSelectChange"
        >
          <a-option
            v-for="item in dataList"
            :key="`${item.type}/${item.name}`"
            :value="`${item.type}/${item.name}`"
            :label="`${item.type}/${item.name}`"
          ></a-option>
        </seal-select>
      </div>
      <a-spin style="width: 100%">
        <div class="font-12 align-left color-text-3 m-b-8">{{
          $t('applications.service.resource.driftInfo')
        }}</div>
        <AceEditor
          ref="rollback_editor"
          read-only
          style="width: 100%"
          :remove-lines="removeLines"
          :add-lines="addLines"
          :editor-default-value="codeResult"
          lang="json"
          :height="320"
        ></AceEditor>
        <!-- <a-alert v-show="!removeLines.length && !addLines.length">{{
              $t('applications.applications.history.diff.same')
            }}</a-alert> -->
      </a-spin>
    </div>
    <template #footer>
      <EditPageFooter style="margin-top: 0">
        <template #save>
          <a-button
            type="primary"
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
  import _ from 'lodash';
  import { ref, reactive, PropType } from 'vue';
  import useCodeDiff from '@/hooks/use-code-diff';
  import AceEditor from '@/components/ace-editor/index.vue';
  import EditPageFooter from '@/components/edit-page-footer/index.vue';
  import { DriftDataItem } from '@/views/application-management/services/config/interface';

  const props = defineProps({
    show: {
      type: Boolean,
      default() {
        return false;
      }
    },
    title: {
      type: String,
      default() {
        return '';
      }
    },
    dataList: {
      type: Array as PropType<DriftDataItem[]>,
      default() {
        return [];
      }
    },
    single: {
      type: Boolean,
      default() {
        return false;
      }
    },
    active: {
      type: String,
      default() {
        return '';
      }
    },
    changeData: {
      type: Object,
      default() {
        return {};
      }
    }
  });
  const {
    removeLines,
    addLines,
    codeResult,
    getDiffCodeResult,
    clearDiffLines
  } = useCodeDiff();
  const emit = defineEmits(['update:show']);
  const formData = reactive({
    id: ''
  });

  const handleSelectChange = () => {
    clearDiffLines();
    // find data
    const data = _.find(props.dataList, (item) => {
      return `${item.type}/${item.name}` === formData.id;
    });
    const diffContent = {
      old: JSON.stringify(data?.change?.before, null, 2),
      new: JSON.stringify(data?.change.after, null, 2)
    };
    getDiffCodeResult(diffContent);
  };
  const setDiffContent = () => {
    clearDiffLines();
    const diffContent = {
      old: JSON.stringify(props.changeData?.before, null, 2),
      new: JSON.stringify(props.changeData?.after, null, 2)
    };
    getDiffCodeResult(diffContent);
  };
  const handleCancel = () => {
    emit('update:show', false);
  };
  const handleBeforeOpen = () => {
    if (!props.single) {
      formData.id = props.active;
      handleSelectChange();
    } else {
      setDiffContent();
    }
  };
  const handleBeforeClose = () => {
    clearDiffLines();
    codeResult.value = '';
  };
</script>

<style lang="less" scoped></style>
