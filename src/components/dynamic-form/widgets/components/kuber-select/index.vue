<script lang="tsx">
  import _ from 'lodash';
  import i18n from '@/locale';
  import { defineComponent, ref, computed, toRefs, inject } from 'vue';
  import {
    InputWidth,
    InjectSchemaFormStatusKey,
    PageAction
  } from '@/views/config';
  import { parentObjectExsits } from '@/components/dynamic-form/utils';
  import schemaFieldProps from '@/components/dynamic-form/fields/schema-field-props';
  import SealViewItemWrap from '@/components/seal-form/components/seal-view-item-wrap.vue';
  import { CheckConnectorCatagory, BU } from '../../types';
  import { BCWidget, queryEnvironmentConnector } from '../../api';
  import useQueryConnector from '../../hooks/use-query-connector';

  export default defineComponent({
    name: 'KuberSelect',
    props: {
      ...schemaFieldProps,
      modelValue: {
        type: [String, Number, Array],
        default() {
          return '';
        }
      },
      widget: {
        type: String,
        default: ''
      },
      rules: {
        type: Array,
        default: () => []
      }
    },
    emits: ['update:modelValue', 'change', 'inputValueChange'],
    widgets: [
      BU.K8sNamespaceSelect,
      BU.K8sSecretSelect,
      BU.K8sConfigMapSelect,
      BU.K8sStorageClassSelect,
      BU.AWSRegion,
      BU.AWSInstanceType
    ],
    setup(props, { attrs, emit }) {
      const schemaFormStatus = inject(
        InjectSchemaFormStatusKey,
        ref(PageAction.CREATE)
      );
      const {
        fetchConnectors,
        connectorID,
        isProjectConnector,
        ProjectEnvironment
      } = useQueryConnector(props);
      const { widget } = toRefs(props);
      const loading = ref(false);
      const dataList = ref<{ label: string; value: string }[]>([]);
      const virtualListProps = computed(() => {
        if (dataList.value.length > 20) {
          return {
            height: 200
          };
        }
        return undefined;
      });

      const handleChange = (data) => {
        emit('change', data);
      };
      const handlePopupVisibleChange = async (visible: boolean) => {
        if (!widget.value || dataList.value.length) return;
        if (visible) {
          try {
            loading.value = true;
            await fetchConnectors();

            const handler = _.get(BCWidget, widget.value);
            const { data } = await handler.request({
              connectorID: connectorID.value
            });
            dataList.value = handler.transform(data);
            loading.value = false;
          } catch (error) {
            loading.value = false;
            dataList.value = [];
          }
        }
      };

      const renderEdit = () => {
        return (
          <a-form-item
            hide-label={true}
            rules={[
              ...props.rules,
              {
                validator: (value, callback) => {
                  if (
                    !parentObjectExsits(props.formData, props.fieldPath) ||
                    !props.required
                  ) {
                    callback();
                    return;
                  }
                  if (!value && value !== 0) {
                    callback(
                      `${i18n.global.t('common.form.rule.select', {
                        name: props.schema.title
                      })}`
                    );
                  } else {
                    callback();
                  }
                }
              }
            ]}
            label={props.schema.title}
            field={_.join(props.fieldPath, '.')}
            validate-trigger={['change']}
          >
            <seal-select
              model-value={_.get(props.uiFormData, props.fieldPath)}
              {...attrs}
              disabled={
                props.readonly ||
                (attrs.immutable &&
                  schemaFormStatus.value !== PageAction.CREATE)
              }
              required={props.required}
              label={props.label}
              popupInfo={props.schema.description}
              placeholder={attrs.label}
              virtual-list-props={virtualListProps}
              style={{ width: `100%` }}
              options={dataList.value}
              allow-search={true}
              loading={loading.value}
              onPopupVisibleChange={(visible) =>
                handlePopupVisibleChange(visible)
              }
              onChange={(value: any) => {
                _.set(props.formData, props.fieldPath, value);
                _.set(props.uiFormData, props.fieldPath, value);
                handleChange(props.formData);
              }}
            ></seal-select>
          </a-form-item>
        );
      };
      const renderView = () => {
        return (
          <a-form-item
            hide-label={true}
            label={props.schema.title}
            field={_.join(props.fieldPath, '.')}
          >
            <SealViewItemWrap label={props.schema.title} style="width: 100%">
              {_.get(props.uiFormData, props.fieldPath)}
            </SealViewItemWrap>
          </a-form-item>
        );
      };
      return () => (
        <>
          {schemaFormStatus.value === PageAction.VIEW
            ? renderView()
            : renderEdit()}
        </>
      );
    }
  });
</script>
