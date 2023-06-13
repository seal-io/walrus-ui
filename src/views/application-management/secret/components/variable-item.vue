<template>
  <div class="variable-item" direction="vertical" align="start">
    <a-grid :cols="24" :row-gap="10" :col-gap="10">
      <a-grid-item :span="10">
        <div class="name item">
          <span class="label">Name</span>
          <a-input
            :model-value="variable.name"
            :max-length="20"
            :show-word-limit="true"
            @input="(val) => handleInput(val, 'name')"
          ></a-input>
        </div>
      </a-grid-item>
      <a-grid-item :span="14">
        <div class="type item">
          <span class="label">{{ $t('common.input.type') }}</span>
          <span class="wrapper">
            <a-select
              style="width: 200px"
              :options="variableTypeList"
              :model-value="variable.type"
              @change="(val) => handleInput(val, 'type')"
            ></a-select>
            <a-checkbox
              :model-value="variable.visible"
              class="mleft-5"
              @change="(val) => handleInput(val, 'visible')"
              >{{ $t('operation.connectors.attribute.sensitive') }}</a-checkbox
            >
            <a-tooltip
              :content="$t('operation.connectors.attribute.sensitive.tips')"
            >
              <template #content>
                <div style="white-space: pre-wrap">{{
                  $t('operation.connectors.attribute.sensitive.tips')
                }}</div>
              </template>
              <icon-info-circle class="mleft-5 size-14" />
            </a-tooltip>
          </span>
        </div>
      </a-grid-item>
    </a-grid>

    <div class="value item">
      <span class="label">{{ $t('common.input.value') }}</span>
      <a-input
        v-if="variable.type === 'string'"
        :model-value="variable.default"
        @input="(val) => handleInput(val, 'default')"
      ></a-input>
      <a-input-number
        v-if="variable.type === 'number'"
        :model-value="variable.default"
        @input="(val) => handleInput(val, 'default')"
      ></a-input-number>
      <a-checkbox
        v-if="variable.type === 'bool'"
        :model-value="variable.default"
        @change="(val) => handleInput(val, 'default')"
      ></a-checkbox>
      <AceEditor
        v-if="variable.type === 'dynamic'"
        lang="yaml"
        :show-gutter="true"
        :editor-default-value="variable.default"
        :model-value="variable.default"
        @input="(val) => handleInput(val, 'default')"
      ></AceEditor>
    </div>
  </div>
</template>

<script lang="ts" setup>
  import { PropType } from 'vue';
  import { variableTypeList } from '@/views/application-management/services/config';
  import AceEditor from '@/components/ace-editor/index.vue';
  import { Variable } from '../config/interface';

  const props = defineProps({
    variable: {
      type: Object as PropType<Variable>,
      default() {
        return {
          name: '',
          type: 'string',
          default: '',
          visible: true
        };
      }
    }
  });
  const emits = defineEmits(['update:variable']);
  const handleInput = (val, key) => {
    emits('update:variable', { ...props.variable, [key]: val });
  };
</script>

<style lang="less" scoped>
  .variable-item {
    padding: 10px;
    text-align: left;
    background-color: var(--color-fill-2);
    border-radius: var(--border-radius-small);

    .item {
      text-align: left;

      .wrapper {
        display: flex;
        align-items: center;
        justify-content: flex-start;
      }
    }

    .label {
      display: inline-block;
      width: max-content;
      color: var(--color-text-3);
      font-size: 13px;
      vertical-align: top;
    }

    .value {
      margin-top: 10px;
    }
  }
</style>
