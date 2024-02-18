<script lang="tsx">
  import { defineComponent, ref, computed, watch } from 'vue';

  export default defineComponent({
    props: {
      loading: {
        type: Boolean,
        default: false
      },
      title: {
        type: String,
        default: ''
      },
      subtitle: {
        type: String,
        default: ''
      }
    },
    setup(props, { slots }) {
      return () => (
        <div class="result-view">
          {props.loading ? (
            <div
              style={{
                height: '200px'
              }}
            ></div>
          ) : (
            <a-result
              title={props.title}
              subtitle={props.subtitle}
              v-slots={{
                icon: () => {
                  return slots.icon ? slots.icon() : <icon-empty />;
                },
                extra: () => {
                  return slots.extra ? slots.extra() : null;
                }
              }}
            ></a-result>
          )}
        </div>
      );
    }
  });
</script>

<style lang="less" scoped>
  .result-view {
    :deep(.arco-result-title) {
      font-size: var(--font-size-small);
    }
  }
</style>
