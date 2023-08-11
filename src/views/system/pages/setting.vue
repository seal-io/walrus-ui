<template>
  <div>
    <a-tabs
      v-model="activeKey"
      :default-active-key="activeKey"
      class="page-line-tabs"
    >
      <a-tab-pane
        v-for="(item, index) in sourceList"
        :key="`${index}`"
        class="tb-pane"
        :title="$t(item.label)"
      >
        <settings-form
          :editable="item.editable"
          :data-info="item"
          @settingSave="handleSave"
        ></settings-form>
      </a-tab-pane>
    </a-tabs>
  </div>
</template>

<script lang="ts" setup>
  import _, { cloneDeep, each, map } from 'lodash';
  import { onMounted, ref, computed, reactive } from 'vue';
  import { useUserStore } from '@/store';
  import { useRoute } from 'vue-router';
  import { SettingsItem, valueTypeMap, ValueType } from '../config';
  import settingsForm from '../components/settings-form.vue';
  import settingList from '../config/settings';

  interface formDataType {
    [key: string]: any;
  }
  const userStore = useUserStore();
  const route = useRoute();
  const sourceList = ref<SettingsItem[]>([...cloneDeep(settingList)]);
  const settingFormData = ref<formDataType>({});
  const activeKey = ref('1');
  activeKey.value = (route.query?.tab || '0') as string;

  const setSourceList = () => {
    // set value and property
    sourceList.value = sourceList.value.map((o) => {
      let item = cloneDeep(o);
      if (item.type !== 'layout') {
        item = {
          ...item,
          ...(settingFormData.value[item.key] || {}),
          value: settingFormData.value[item.key]
            ? settingFormData.value[item.key].value
            : ''
        };
      }
      // set dataList
      if (item.dataList && item.dataList.length) {
        item.dataList = item.dataList.map((sItem) => {
          let value: any = null;
          if (sItem?.childProperties?.length) {
            value = {};
            each(sItem.childProperties, (child) => {
              if (sItem.key && settingFormData.value[sItem.key]) {
                const obj =
                  JSON.parse(settingFormData.value[sItem.id]['value']) || {};
                value[child.key] = obj[child.key] || child.value;
              }
            });
          } else if (sItem?.subGroup?.length) {
            // current schema
            sItem.subGroup = map(sItem.subGroup, (child) => {
              return {
                ...child,
                ...settingFormData.value[child.key],
                value:
                  _.get(settingFormData.value, `${child.key}.sensitive`) &&
                  _.get(settingFormData.value, `${child.key}.configured`)
                    ? '********'
                    : _.get(settingFormData.value, `${child.key}.value`)
              };
            });
          } else {
            value = settingFormData.value[sItem.key]
              ? settingFormData.value[sItem.key].value
              : '';
          }
          sItem = {
            ...sItem,
            ..._.get(settingFormData.value, sItem.key),
            value
          };
          return sItem;
        });

        const list = cloneDeep(item.dataList);
        item.dataList = list.filter((o) => !o.hidden);
      }

      return {
        ...item
      };
    });

    // filter invisible id
    const sList = cloneDeep(sourceList.value);
    sourceList.value = sList.filter((item) => {
      return !item.hidden;
    });
  };

  const fetchData = async () => {
    try {
      const data = await userStore.getUserSetting();
      const items = data.items || [];
      settingFormData.value = items.reduce((obj, item) => {
        obj[item.name] = {
          ...item
        };
        return obj;
      }, {});
    } catch (error) {
      sourceList.value = [];
    }
  };

  const init = async () => {
    await fetchData();
    setSourceList();
  };
  const handleSave = async () => {
    init();
  };
  onMounted(() => {
    init();
  });
</script>

<style lang="less" scoped>
  :deep(.arco-tabs) {
    &.arco-tabs-vertical {
      .arco-tabs-nav-vertical {
        &::before {
          width: 0;
        }
      }

      .arco-tabs-content {
        border-left: 1px solid var(--color-border-2);
      }

      .arco-tabs-tab {
        margin-right: 16px;
        padding-left: 0;
      }
    }
  }
</style>
