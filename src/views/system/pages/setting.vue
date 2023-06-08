<template>
  <div class="container">
    <a-tabs
      v-model="activeKey"
      :default-active-key="activeKey"
      class="page-line-tabs"
    >
      <a-tab-pane
        v-for="(item, index) in sourceList"
        :key="`${index}`"
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
  import { cloneDeep, isArray, each, isObject, map } from 'lodash';
  import { onMounted, ref, computed, reactive } from 'vue';
  import { useUserStore } from '@/store';
  import { useRoute } from 'vue-router';
  import { SettingsItem, valueTypeMap, ValueType } from '../config';
  import settingsForm from '../components/settings-form.vue';
  import dataInfo from '../components/data';
  import { settingList } from '../config/settings-model';

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
    console.log('settingFormData===', settingFormData.value);
    // set value and property
    sourceList.value = sourceList.value.map((item) => {
      if (item.type !== 'layout') {
        item = {
          ...item,
          ...(settingFormData.value[item.id] || {}),
          value: settingFormData.value[item.id]
            ? settingFormData.value[item.id].value
            : ''
        };
      }
      // set dataList
      if (item.dataList && item.dataList.length) {
        item.dataList = item.dataList.map((sItem) => {
          let value: any = null;
          const subGroupValue = {};
          if (sItem?.childProperties?.length) {
            value = {};
            each(sItem.childProperties, (child) => {
              if (sItem.id && settingFormData.value[sItem.id]) {
                const obj =
                  JSON.parse(settingFormData.value[sItem.id]['value']) || {};
                value[child.id] = obj[child.id] || child.value;
              }
            });
          } else if (sItem?.subGroup?.length) {
            sItem.subGroup = map(sItem.subGroup, (child) => {
              // value[child.id] = settingFormData.value[child.id]['value'];
              return {
                ...child,
                ...settingFormData.value[child.id]
              };
            });
          } else {
            value = settingFormData.value[sItem.id]
              ? settingFormData.value[sItem.id].value
              : '';
          }
          sItem = {
            ...sItem,
            ...(settingFormData.value[sItem.id] || {}),
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
    console.log('sourceList:', settingFormData.value, sourceList.value);
  };
  const fetchData = async () => {
    try {
      const data = await userStore.getUserSetting();
      console.log('data:', data);
      const items = data.items || [];
      settingFormData.value = items.reduce((obj, item) => {
        obj[item.name] = {
          ...item,
          id: item.name
        };
        return obj;
      }, {});
      setSourceList();
    } catch (error) {
      console.log(error);
      sourceList.value = [];
    }
  };
  const handleSave = async () => {
    console.log('save');
    await fetchData();
  };
  onMounted(() => {
    fetchData();
  });
</script>

<style></style>
