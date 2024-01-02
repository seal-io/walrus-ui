<template>
  <div class="selector-wrap">
    <a-select
      v-model="values"
      :placeholder="placeholder"
      multiple
      :max-tag-count="1"
      allow-search
      size="large"
      style="width: 386px"
      @change="handleChange"
    >
      <a-option v-if="list.length" style="display: none"></a-option>
      <a-option
        v-for="(item, index) in list"
        :key="index"
        :value="item[keyMap.value]"
        :disabled="includes(selected, item[keyMap.value])"
        >{{ item[keyMap.label] }}
        <span style="color: var(--color-text-3)" class="font-12">{{
          item.tips ? `(${$t(item.tips)})` : ''
        }}</span></a-option
      >
      <template #empty>
        <div class="flex flex-justify-center p-10">
          <primaryButtonGroup
            v-if="
              userStore.hasProjectResourceActions({
                resource: Resources.Connectors,
                projectID: route.params.projectId,
                actions: [Actions.POST]
              })
            "
            size="medium"
            :actions="connectorTypeList"
            position="br"
            trigger="hover"
            item-type="text"
            @select="(value, item) => handleCreate(value, item)"
          >
            <a-button type="text" size="small"
              ><icon-plus class="font-14 m-r-5" />{{
                $t('operation.connectors.create')
              }}</a-button
            >
          </primaryButtonGroup>
        </div>
      </template>
    </a-select>
  </div>
</template>

<script lang="ts" setup>
  import { Resources, Actions } from '@/permissions/config';
  import { includes } from 'lodash';
  import { useUserStore } from '@/store';
  import primaryButtonGroup from '@/components/drop-button-group/primary-button-group.vue';
  import { PropType, ref, watchEffect } from 'vue';
  import { connectorTypeList } from '@/views/operation-hub/connectors/config';
  import useCallCommon from '@/hooks/use-call-common';

  const props = defineProps({
    list: {
      type: Array as PropType<
        { label: string; value: string; project?: object; tips?: string }[]
      >,
      default() {
        return [];
      }
    },
    keyMap: {
      type: Object as PropType<{ label: string; value: string }>,
      default() {
        return {
          label: 'label',
          value: 'value'
        };
      }
    },
    placeholder: {
      type: String,
      default() {
        return '';
      }
    },
    selected: {
      type: Array as PropType<string[]>,
      default() {
        return [];
      }
    },
    connectorIDs: {
      type: Array as PropType<string[]>,
      default() {
        return [];
      }
    },
    show: {
      type: Boolean,
      default() {
        return false;
      }
    }
  });
  const { route, router } = useCallCommon();
  const userStore = useUserStore();
  const emits = defineEmits(['confirm', 'update:show', 'update:connectorIDs']);
  const values = ref<string[]>([]);

  const handleConfirm = () => {
    emits('confirm', values.value);
  };
  const handleChange = () => {
    emits('update:connectorIDs', values.value);
    emits('confirm', values.value);
  };
  const handleCancel = () => {
    setTimeout(() => {
      values.value = [];
      emits('update:show', false);
    }, 100);
  };

  const handleCreate = (val, item) => {
    router.push({
      name: item.route,
      params: {
        action: 'edit',
        projectId: route.params.projectId
      }
    });
  };
  watchEffect(() => {
    values.value = [...props.connectorIDs];
  });
</script>

<style></style>
