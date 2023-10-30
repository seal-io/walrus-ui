<script lang="tsx">
  import { defineComponent, reactive, ref, watch } from 'vue';
  import _ from 'lodash';
  import locale from '@/locale';
  import SealFormItemWrap from '@/components/seal-form/components/seal-form-item-wrap.vue';
  import formComponents from '@/components/form-create/components/index';
  import EditPageFooter from '@/components/edit-page-footer/index.vue';
  import { FieldSchema } from './config/interface';
  import versionData from './config/versions-v3.json';
  import { initFormState } from './utils/init-form-state';
  import SingleForm from '../form-create/single-form.vue';

  export default defineComponent({
    setup() {
      const { t } = locale.global;
      const formref = ref();
      const formData = ref({});
      const attributes = ref({});
      const fieldSchemaList = ref<FieldSchema[]>([]);
      const fetchData = () => {
        const result = initFormState(
          _.get(
            versionData,
            'items.0.externalSchema.schema.components.schemas.variables'
          )
        );
        formData.value = result.formData;
        attributes.value = { ..._.cloneDeep(result.formData) };
        fieldSchemaList.value = result.fieldSchemaList;
        console.log('result===', formData.value, fieldSchemaList.value);
      };
      fetchData();

      const handleSubmit = async () => {
        console.log('formData===', await formref.value.getFormData());
      };

      return () => (
        <>
          <SingleForm
            ref={formref}
            formSchema={fieldSchemaList.value}
            attributes={attributes.value}
            model={formData.value}
          ></SingleForm>
          <a-space fill>
            <a-button type="primary" onClick={() => handleSubmit()}>
              {t('common.button.save')}
            </a-button>
          </a-space>
        </>
      );
    }
  });
</script>
