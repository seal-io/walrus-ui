<script lang="tsx">
  import { defineComponent } from 'vue';

  export default defineComponent({
    name: 'SealSpin',
    setup(props, { slots, attrs }) {
      return () => (
        <a-spin
          {...attrs}
          v-slots={{
            tip: slots.tip ? () => slots.tip?.() : null,
            icon: slots.icon ? () => slots.icon?.() : null,
            element: slots.element ? () => slots.element?.() : null
          }}
        >
          {slots.default?.()}
        </a-spin>
      );
    }
  });
</script>
