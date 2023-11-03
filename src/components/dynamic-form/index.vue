<script lang="tsx">
  import { defineComponent, reactive, ref, watch, toRaw } from 'vue';
  import _, { result } from 'lodash';
  import locale from '@/locale';
  import { FieldSchema } from './config/interface';
  import { initFormState } from './utils/init-form-state';
  import SingleForm from '../form-create/single-form.vue';

  export default defineComponent({
    setup() {
      const { t } = locale.global;
      const treeData = ref<any[]>([]);
      const formref = ref();
      const formData = ref({});
      const attributes = ref({});
      const fieldSchemaList = ref<FieldSchema[]>([]);
      const fetchData = () => {
        const result = initFormState(
          _.get(
            {},
            'items.0.externalSchema.schema.components.schemas.variables'
          )
        );
        formData.value = result.formData;
        attributes.value = { ..._.cloneDeep(result.formData) };
        fieldSchemaList.value = result.fieldSchemaList;
        console.log('result===', formData.value, fieldSchemaList.value);
      };
      fetchData();

      const convertToTree = (input) => {
        const result: any[] = [];

        _.keys(input).forEach((key) => {
          if (typeof input[key] === 'object' && !Array.isArray(input[key])) {
            const children = convertToTree(input[key]);
            if (children.length > 0) {
              result.push({ key, title: key, children });
            }
          } else {
            result.push({ key, title: key });
          }
        });
        console.log('result===', result);
        return result;
      };
      treeData.value = convertToTree(toRaw(formData.value));

      const handleSubmit = async () => {
        console.log('formData===', await formref.value.getFormData());
      };

      return () => (
        <>
          <div class="flex flex-justify-between">
            <SingleForm
              style="flex:1"
              ref={formref}
              formSchema={fieldSchemaList.value}
              attributes={attributes.value}
              model={formData.value}
            ></SingleForm>
            <a-tree data={treeData} class="m-l-10" />
          </div>
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
