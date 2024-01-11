<script lang="tsx">
  import _ from 'lodash';
  import { defineComponent, PropType, toRef } from 'vue';
  import SealFormItemWrap from '@/components/seal-form/components/seal-form-item-wrap.vue';
  import SealViewItemWrap from '@/components/seal-form/components/seal-view-item-wrap.vue';

  export default defineComponent({
    name: 'CommonList',
    emits: ['edit', 'delete', 'update:modelValue'],
    props: {
      modelValue: {
        type: Array as PropType<any[]>,
        default: () => []
      },
      viewStatus: {
        type: Boolean,
        default: false
      },
      label: {
        type: String,
        default: ''
      }
    },
    setup(props, ctx) {
      const dataList = toRef(props, 'modelValue');

      const handleDelete = (index) => {
        dataList.value.splice(index, 1);
        ctx.emit('update:modelValue', _.cloneDeep(dataList.value));
      };
      const handleAdd = () => {
        dataList.value.push('');
        ctx.emit('update:modelValue', _.cloneDeep(dataList.value));
      };
      const handleInput = (val: any, index: number) => {
        dataList.value[index] = val;
        ctx.emit('update:modelValue', _.cloneDeep(dataList.value));
      };

      const renderButtons = (index) => {
        if (!props.viewStatus) {
          return null;
        }
        return (
          <span class="btn-wrap">
            <a-link onClick={() => handleDelete(index)} class="p-0">
              <icon-minus-circle class="size-20"></icon-minus-circle>
            </a-link>
            {index === dataList.value.length - 1 && (
              <a-link
                onClick={() => handleAdd()}
                style="margin-left: 10px"
                class="p-0"
              >
                <icon-plus-circle-fill class="size-20"></icon-plus-circle-fill>
              </a-link>
            )}
          </span>
        );
      };
      const renderEmpty = () => {
        return (
          <SealFormItemWrap
            style={{ width: ctx.attrs.style?.width }}
            SealFormItemWraplabel={props.label}
          >
            <a-link onClick={() => handleAdd()}>
              <icon-plus-circle-fill class="size-20"></icon-plus-circle-fill>
            </a-link>
          </SealFormItemWrap>
        );
      };
      const renderList = () => {
        return (
          <a-space
            direction="vertical"
            class="common-list"
            style={{ width: ctx.attrs.style?.width }}
          >
            {_.map(dataList.value, (item, index) => {
              return (
                <span class="item" style={{ width: '100%' }}>
                  <seal-input
                    style={{ width: '100%' }}
                    label={index + 1}
                    model-value={item}
                    viewStatus={!props.viewStatus}
                    onInput={(val) => handleInput(val, index)}
                  ></seal-input>
                  {renderButtons(index)}
                </span>
              );
            })}
          </a-space>
        );
      };
      return () => <>{dataList.value.length ? renderList() : renderEmpty()}</>;
    }
  });
</script>

<style lang="less" scoped>
  .common-list {
    .item {
      display: flex;
      align-items: center;

      .btn-wrap {
        display: flex;
        flex: none;
        align-items: center;
        justify-content: space-between;
        width: 60px;
        margin-left: 10px;
      }
    }
  }
</style>
