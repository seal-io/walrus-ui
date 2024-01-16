<script lang="tsx">
  import i18n from '@/locale';
  import _ from 'lodash';
  import { defineComponent } from 'vue';

  export default defineComponent({
    emits: ['clickLabel'],
    setup(props, { attrs, slots, emit }) {
      const handleClick = () => {
        emit('clickLabel');
      };
      return () => (
        <span
          class={['wrapper']}
          style={{ width: attrs.style?.width || 'max-content' }}
        >
          <span
            class={['label', { disabled: attrs.disabled }]}
            onClick={() => handleClick()}
          >
            <span>
              <span>{attrs.label}</span>
              {attrs.required ? (
                <span
                  class="bold-500 m-l-2 star"
                  style={{ color: 'rgb(var(--danger-6))' }}
                >
                  *
                </span>
              ) : null}
            </span>
            {attrs.popupInfo ? (
              <a-tooltip content={attrs.popupInfo}>
                <icon-info-circle
                  class="m-l-2"
                  style={{ 'stroke-linecap': 'initial', 'cursor': 'default' }}
                />
              </a-tooltip>
            ) : null}
          </span>
          {slots.default?.()}
        </span>
      );
    }
  });
</script>

<style lang="less" scoped>
  @import url('../style/index.less');
</style>
