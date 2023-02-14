<template>
  <div class="configuration-wrap">
    <a-select
      placeholder="添加模块"
      :options="createConfigOptions"
      style="width: 200px; margin-bottom: 8px"
    ></a-select>
    <!-- <a-divider :margin="8"></a-divider> -->
    <moduleWrapper title="webService">
      <a-form ref="formref" :model="formData" auto-label-width>
        <a-form-item label="git地址">
          <a-input></a-input>
        </a-form-item>
        <a-form-item label="git分支">
          <a-input></a-input>
        </a-form-item>
        <a-form-item label="路径">
          <a-input></a-input>
        </a-form-item>
        <a-form-item label="认证">
          <a-radio-group>
            <a-radio
              v-for="item in instanceConfiguration"
              :key="item.value"
              :value="item.value"
              >{{ item.label }}</a-radio
            >
          </a-radio-group>
        </a-form-item>
        <a-form-item label="服务端口">
          <a-input-number></a-input-number>
        </a-form-item>
        <a-form-item label="内存预留">
          <a-input-number hide-button>
            <template #suffix>MB</template>
          </a-input-number>
        </a-form-item>
        <a-form-item label="CPU预留">
          <a-input-number hide-button>
            <template #suffix>Core</template>
          </a-input-number>
        </a-form-item>
        <a-form-item
          v-for="(item, index) in enVarList"
          :key="index"
          :label="`环境变量${index + 1}`"
        >
          <a-input-group style="width: 360px">
            <a-input></a-input><span style="padding: 0 4px">:</span
            ><a-input></a-input>
          </a-input-group>
          <a-button
            type="outline"
            size="mini"
            shape="round"
            style="margin-left: 8px"
            @click="handleAddEnVar"
          >
            <icon-plus></icon-plus>
          </a-button>
          <a-button
            v-if="enVarList.length > 1"
            type="outline"
            size="mini"
            shape="round"
            style="margin-left: 8px"
            @click="handleDeleteEnVar(index)"
          >
            <icon-minus></icon-minus>
          </a-button>
        </a-form-item>
        <a-form-item>
          <editPageFooter
            style="display: flex; margin-top: 0; padding-bottom: 0"
          >
            <template #save>
              <a-button type="primary" size="small" class="cap-title">{{
                $t('common.button.save')
              }}</a-button>
            </template>
            <template #cancel>
              <a-button type="outline" size="small" class="cap-title">{{
                $t('common.button.cancel')
              }}</a-button>
            </template>
          </editPageFooter>
        </a-form-item>
      </a-form>
    </moduleWrapper>
  </div>
</template>

<script lang="ts" setup>
  import { onMounted, ref } from 'vue';
  import editPageFooter from '@/components/edit-page-footer/index.vue';
  import moduleWrapper from './module-wrapper.vue';
  import { createConfigOptions, instanceConfiguration } from '../config';

  const formref = ref();
  const formData = ref({});
  const enVarList = ref([{ label: 'key1', value: '1' }]);

  const handleAddEnVar = () => {
    enVarList.value.push({
      label: 'key',
      value: '1'
    });
  };
  const handleDeleteEnVar = (index) => {
    enVarList.value.splice(index, 1);
  };
  onMounted(() => {
    console.log('configuration');
  });
</script>

<style></style>
