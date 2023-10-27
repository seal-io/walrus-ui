<script lang="tsx">
  import { defineComponent, reactive, ref, watch } from 'vue';
  import _ from 'lodash';
  import locale from '@/locale';
  import SealFormItemWrap from '@/components/seal-form/components/seal-form-item-wrap.vue';
  import formComponents from '@/components/form-create/components/index';
  import EditPageFooter from '@/components/edit-page-footer/index.vue';
  import versionData from './config/versions-v3.json';
  import { initFormState } from './utils/init-form-state';

  export default defineComponent({
    setup() {
      const { t } = locale.global;
      const formref = ref();
      const formData = ref({});
      let fieldSchemaList: any[] = [];
      const fetchData = () => {
        const result = initFormState(
          _.get(
            versionData,
            'items.0.externalSchema.schema.components.schemas.variables'
          )
        );
        formData.value = result.formData;
        fieldSchemaList = result.fieldSchemaList;
        console.log('result===', formData.value, fieldSchemaList);
      };
      fetchData();

      const handleInput = (val, fm) => {
        _.set(formData.value, _.join(fm.fieldPath, '.'), val);
        console.log('formData===input', formData.value, val);
      };

      const handleFieldChange = (val, fm) => {
        _.set(formData.value, _.join(fm.fieldPath, '.'), val);
        console.log('formData===change', formData.value, val);
      };

      const renderFieldComponent = (fm, index) => {
        const ParentComponent = formComponents[fm.parentCom];
        const ChildComponent = formComponents[fm.childCom];
        return (
          <ParentComponent
            key={`${_.join(fm.fieldPath, '.')}-field`}
            model-value={_.get(formData.value, _.join(fm.fieldPath, '.'))}
            label={`${fm.title || _.join(fm.fieldPath, '.')}`}
            required={fm.required}
            popup-info={fm.description}
            editor-default-value={formData.value[fm.name] || ''}
            style={{ width: '100%' }}
            width="100%"
            editor-id={`${fm.name}_editorId_${index}`}
            onInput={(val) => handleInput(val, fm)}
            onChange={(val) => handleFieldChange(val, fm)}
          >
            {fm.childCom ? (
              <>
                <ChildComponent
                  key={`child_editorId_${index}`}
                  editor-id={`${fm.name}_child_editorId_${index}`}
                  style={{ display: 'none' }}
                ></ChildComponent>
                {_.map(fm.options, (com) => {
                  return (
                    <ChildComponent key={com.label} value={com.value}>
                      {com.value}
                    </ChildComponent>
                  );
                })}
              </>
            ) : null}
          </ParentComponent>
        );
      };

      const handleSubmit = () => {
        console.log('formData===', formData.value);
      };
      const renderField = (fm, index) => {
        return (
          <a-grid-item span={12}>
            <a-form-item
              key={`${_.join(fm.fieldPath, '.')}-form-item`}
              field={_.join(fm.fieldPath, '.')}
              rules={fm.rules}
              hide-label
              label={fm.title || _.join(fm.fieldPath, '.')}
              validate-trigger={['change']}
              v-slots={{
                label: () => (
                  <span>
                    <span>{fm.title || _.join(fm.fieldPath, '.')}</span>
                    {fm.description ? (
                      <a-tooltip content={fm.description}>
                        <icon-info-circle
                          style={{
                            'margin-left': '2px',
                            'stroke-linecap': 'initial'
                          }}
                        />
                      </a-tooltip>
                    ) : null}
                  </span>
                )
              }}
            >
              {renderFieldComponent(fm, index)}
            </a-form-item>
          </a-grid-item>
        );
      };
      return () => (
        <>
          <a-form ref={formref} model={formData.value} auto-label-width>
            <div class="content-wrap">
              <a-grid cols={24} col-gap={10} style="flex: 1">
                {_.map(fieldSchemaList, (fm, index) => {
                  return <>{renderField(fm, index)}</>;
                })}
              </a-grid>
            </div>
          </a-form>
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
