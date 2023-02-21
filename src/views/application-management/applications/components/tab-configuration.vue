<template>
  <div class="configuration-wrap">
    <a-dropdown @select="handleSelect">
      <a-button size="small" type="outline" style="margin-bottom: 8px"
        >{{ $t('applications.applications.configuration.create')
        }}<icon-down style="margin-left: 5px"
      /></a-button>
      <template #content>
        <a-doption
          v-for="item in moduleTemplates"
          :key="item.id"
          :value="item.schema"
          >{{ item.id }}</a-doption
        >
      </template>
    </a-dropdown>
    <!-- <a-divider :margin="8"></a-divider> -->
    <a-space :size="10" direction="vertical" fill>
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
      <moduleWrapper
        v-for="(module, index) in moduleList"
        :key="index"
        :title="module.title"
        @delete="handleDeleteModule(index)"
      >
        <formCreate :form-schema="module.varibles"></formCreate>
      </moduleWrapper>
      <!-- <moduleWrapper title="test module">
        <formCreate></formCreate>
      </moduleWrapper> -->
    </a-space>
  </div>
</template>

<script lang="ts" setup>
  import { cloneDeep, get } from 'lodash';
  import { onMounted, ref } from 'vue';
  import editPageFooter from '@/components/edit-page-footer/index.vue';
  import formCreate from '@/components/form-create/index.vue';
  import { queryModules } from '@/views/operation-hub/templates/api';
  import {
    TemplateRowData,
    Schema
  } from '@/views/operation-hub/templates/config/interface';
  import moduleWrapper from './module-wrapper.vue';
  import { instanceConfiguration } from '../config';

  const formref = ref();
  const formData = ref({});
  const moduleTemplates = ref<TemplateRowData[]>([]);
  const moduleList = ref<{ title?: string; varibles: any[] }[]>([]);
  const enVarList = ref([{ label: 'key1', value: '1' }]);

  const ml = ref('');
  const handleChange = (val) => {
    console.log('val>>>>>>>', ml.value);
  };
  const handleAddEnVar = () => {
    enVarList.value.push({
      label: 'key',
      value: '1'
    });
  };
  const handleDeleteEnVar = (index) => {
    enVarList.value.splice(index, 1);
  };
  const handleSelect = (val) => {
    console.log('select===', val);
    moduleList.value.push({
      title: 'new module',
      varibles: cloneDeep(get(val, 'Variables'))
    });
  };
  const handleDeleteModule = (index) => {
    moduleList.value.splice(index, 1);
  };
  const getModules = async () => {
    try {
      const params = {
        page: 1,
        perPage: 100
      };
      const { data } = await queryModules(params);
      moduleTemplates.value = data.items || [];
    } catch (error) {
      console.log(error);
    }
  };
  onMounted(() => {
    getModules();
  });
</script>

<style></style>
