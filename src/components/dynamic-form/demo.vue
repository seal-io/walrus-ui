<template>
  <GroupForm :form-data="formData" :schema="schema"></GroupForm>
</template>

<script lang="ts" setup>
  import _ from 'lodash';
  import { defineComponent, PropType, ref, watch } from 'vue';
  import testData from './config/test.json';
  import GroupForm from './group-form.vue';

  const formData = ref({});
  const schema = _.get(testData, 'components.schemas.variables') as any;
  console.log('schema======', schema);
</script>
