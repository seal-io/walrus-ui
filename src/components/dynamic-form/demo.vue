<template>
  <div>
    <GroupForm
      ref="formref"
      v-model:form-data="formData"
      :schema="schema"
    ></GroupForm>
    <div>
      <a-button type="primary" @click="handleSubmit">{{
        $t('common.button.submit')
      }}</a-button>
    </div>
  </div>
</template>

<script lang="ts" setup>
  import _ from 'lodash';
  import { defineComponent, PropType, ref, watch } from 'vue';

  import GroupForm from './group-form.vue';

  const formData = ref({});
  const formref = ref();
  const schema = _.get({}, 'components.schemas.variables') as any;

  const handleSubmit = async () => {
    const res = await formref.value.validate();
  };
</script>
